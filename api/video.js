export const config = { api: { bodyParser: { sizeLimit: '10mb' }, responseLimit: '15mb' } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const FAL_KEY = process.env.FAL_KEY;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

  if (!FAL_KEY && !GEMINI_KEY) return res.status(500).json({ error: "No API keys configured" });

  // ── GET: Check status or proxy video ──
  if (req.method === 'GET') {
    const { action, op, endpoint, response_url, status_url, provider } = req.query;
    if (action === 'test') return res.status(200).json({ status: 'ready', model: 'minimax+veo-fallback', v: '19' });

    // Proxy Gemini video download - redirect with key
    if (action === 'proxy' && req.query.uri) {
      try {
        const uri = req.query.uri;
        const separator = uri.includes('?') ? '&' : '?';
        const directUrl = uri + separator + 'key=' + GEMINI_KEY;
        return res.redirect(302, directUrl);
      } catch (e) {}
      return res.status(500).json({ error: 'Proxy failed' });
    }

    if (action === 'check') {
      // ── Gemini Veo check ──
      if (provider === 'gemini' && op) {
        try {
          const r = await fetch(GEMINI_BASE + '/' + op, { headers: { 'x-goog-api-key': GEMINI_KEY } });
          if (r.ok) {
            const d = await r.json();
            if (d.done) {
              // Try multiple possible response formats
              const videoUri = d.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
                || d.response?.generatedVideos?.[0]?.video?.uri
                || d.response?.predictions?.[0]?.video?.uri
                || d.response?.predictions?.[0]?.videoUri;
              
              if (videoUri) {
                const proxyUrl = '/api/video?action=proxy&uri=' + encodeURIComponent(videoUri);
                return res.status(200).json({ status: 'completed', video_url: proxyUrl });
              }
              // Log full response to debug
              console.log('Gemini video done, response:', JSON.stringify(d.response || d).substring(0, 1000));
              return res.status(200).json({ status: 'error', error: 'Video done but no URL found. Debug: ' + JSON.stringify(d.response || d).substring(0, 300) });
            }
            return res.status(200).json({ status: 'processing', provider: 'gemini' });
          }
          return res.status(200).json({ status: 'processing', provider: 'gemini' });
        } catch (e) {
          return res.status(200).json({ status: 'processing', provider: 'gemini' });
        }
      }

      // ── fal.ai check ──
      try {
        const base = endpoint || 'fal-ai/minimax/video-01-live';
        const urls = [];
        
        if (response_url) urls.push(response_url);
        if (status_url) urls.push(status_url);
        if (op) {
          urls.push('https://queue.fal.run/' + base + '/requests/' + op);
          urls.push('https://queue.fal.run/' + base + '/requests/' + op + '/status');
        }
        
        for (const url of urls) {
          try {
            const r = await fetch(url, { headers: { 'Authorization': 'Key ' + FAL_KEY } });
            
            if (r.status === 200) {
              const text = await r.text();
              if (!text) continue;
              const d = JSON.parse(text);
              
              if (d.video?.url) return res.status(200).json({ status: 'completed', video_url: d.video.url });
              if (d.status === 'COMPLETED') {
                const resultUrl = d.response_url || ('https://queue.fal.run/' + base + '/requests/' + op);
                try {
                  const r2 = await fetch(resultUrl, { headers: { 'Authorization': 'Key ' + FAL_KEY } });
                  const d2 = await r2.json();
                  if (d2.video?.url) return res.status(200).json({ status: 'completed', video_url: d2.video.url });
                } catch (e) {}
                return res.status(200).json({ status: 'completed_no_url', debug: JSON.stringify(d).substring(0, 500) });
              }
              if (d.status === 'FAILED') return res.status(200).json({ status: 'error', error: d.detail || d.error || 'Video fallo' });
              if (d.status === 'IN_QUEUE' || d.status === 'IN_PROGRESS') return res.status(200).json({ status: 'processing', fal_status: d.status });
            }
            if (r.status === 202) return res.status(200).json({ status: 'processing' });
          } catch (e) { continue; }
        }
        
        return res.status(200).json({ status: 'processing' });
      } catch (e) {
        return res.status(200).json({ status: 'processing', debug: e.message });
      }
    }
    return res.status(400).json({ error: 'Unknown action' });
  }

  // ── POST: Start video generation ──
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const prompt = body && body.prompt;
      const image_base64 = body && body.image_base64;
      if (!prompt) return res.status(400).json({ error: 'No prompt' });

      // ── PRIMARY: fal.ai MiniMax ──
      if (FAL_KEY) {
        try {
          let imageUrl = null;

          if (image_base64) {
            try {
              const imgBuf = Buffer.from(image_base64, 'base64');
              const uploadRes = await fetch('https://fal.run/fal-ai/storage/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Key ' + FAL_KEY, 'Content-Type': 'application/octet-stream' },
                body: imgBuf
              });
              if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url || uploadData.file_url || uploadData.access_url;
              }
            } catch (e) {}

            if (!imageUrl) {
              try {
                const imgBuf = Buffer.from(image_base64, 'base64');
                const uploadRes = await fetch('https://rest.fal.run/storage/upload', {
                  method: 'PUT',
                  headers: { 'Authorization': 'Key ' + FAL_KEY, 'Content-Type': 'image/jpeg' },
                  body: imgBuf
                });
                if (uploadRes.ok) {
                  const uploadData = await uploadRes.json();
                  imageUrl = uploadData.url || uploadData.file_url;
                }
              } catch (e) {}
            }

            if (!imageUrl) {
              imageUrl = 'data:image/jpeg;base64,' + image_base64;
            }
          }

          const falEndpoint = (image_base64 && imageUrl)
            ? 'fal-ai/minimax/video-01-live/image-to-video'
            : 'fal-ai/minimax/video-01-live';

          const payload = { prompt: prompt, prompt_optimizer: false };
          if (imageUrl) payload.image_url = imageUrl;

          const r = await fetch('https://queue.fal.run/' + falEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Key ' + FAL_KEY },
            body: JSON.stringify(payload)
          });
          const text = await r.text();
          const d = JSON.parse(text);

          // Check if fal.ai failed (locked account, no balance, etc.)
          const falError = d.detail || d.error || '';
          const isFalDown = falError.toLowerCase().includes('locked') || 
                            falError.toLowerCase().includes('balance') || 
                            falError.toLowerCase().includes('unauthorized') ||
                            falError.toLowerCase().includes('forbidden') ||
                            r.status >= 400;

          if (d.request_id && !isFalDown) {
            return res.status(200).json({
              status: 'started',
              operation: d.request_id,
              endpoint: falEndpoint,
              provider: 'fal',
              response_url: d.response_url || '',
              status_url: d.status_url || ''
            });
          }

          // fal.ai failed, fall through to Gemini
          console.log('fal.ai failed, falling back to Gemini Veo:', falError);
        } catch (e) {
          console.log('fal.ai exception, falling back to Gemini Veo:', e.message);
        }
      }

      // ── FALLBACK: Gemini Veo ──
      if (GEMINI_KEY) {
        try {
          const instance = { prompt: prompt.substring(0, 500) };

          // Send image to Veo if available (resized to 720p JPEG)
          if (image_base64) {
            instance.image = { bytesBase64Encoded: image_base64 };
          }

          const errors = [];
          const models = ['veo-3.1-generate-preview', 'veo-3.1-lite-generate-preview'];
          
          for (const model of models) {
            try {
              const r = await fetch(
                GEMINI_BASE + '/models/' + model + ':predictLongRunning',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
                  body: JSON.stringify({
                    instances: [instance],
                    parameters: { aspectRatio: '9:16' }
                  })
                }
              );

              if (r.ok) {
                const d = await r.json();
                if (d.name) {
                  console.log('Gemini Veo started with model:', model, 'operation:', d.name);
                  return res.status(200).json({
                    status: 'started',
                    operation: d.name,
                    provider: 'gemini'
                  });
                }
              } else {
                const errText = await r.text();
                errors.push(model + ': ' + r.status + ' - ' + errText.substring(0, 200));
                console.log('Gemini Veo ' + model + ' error ' + r.status + ':', errText.substring(0, 500));
                
                // If image caused the error, retry with different image format
                if (image_base64 && instance.image) {
                  // Try inlineData format
                  instance.image = { inlineData: { mimeType: 'image/jpeg', data: image_base64 } };
                  const r2 = await fetch(
                    GEMINI_BASE + '/models/' + model + ':predictLongRunning',
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
                      body: JSON.stringify({
                        instances: [instance],
                        parameters: { aspectRatio: '9:16' }
                      })
                    }
                  );
                  if (r2.ok) {
                    const d2 = await r2.json();
                    if (d2.name) {
                      console.log('Gemini Veo started (inlineData) with model:', model);
                      return res.status(200).json({
                        status: 'started',
                        operation: d2.name,
                        provider: 'gemini'
                      });
                    }
                  }
                  // Last retry: without image at all
                  delete instance.image;
                  const r3 = await fetch(
                    GEMINI_BASE + '/models/' + model + ':predictLongRunning',
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
                      body: JSON.stringify({
                        instances: [instance],
                        parameters: { aspectRatio: '9:16' }
                      })
                    }
                  );
                  if (r3.ok) {
                    const d3 = await r3.json();
                    if (d3.name) {
                      console.log('Gemini Veo started (no image) with model:', model);
                      return res.status(200).json({
                        status: 'started',
                        operation: d3.name,
                        provider: 'gemini'
                      });
                    }
                  }
                }
              }
            } catch (e) {
              console.log('Gemini Veo ' + model + ' exception:', e.message);
            }
          }

          console.log('Gemini Veo all models failed');
          return res.status(200).json({ status: 'error', error: 'Gemini Veo errors: ' + errors.join(' | ') });
        } catch (e) {
          console.log('Gemini Veo exception:', e.message);
        }
      }

      return res.status(200).json({ status: 'error', error: 'Ambos servicios de video fallaron (fal.ai y Gemini). Verifica tu saldo en fal.ai o tu API key de Gemini.' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}