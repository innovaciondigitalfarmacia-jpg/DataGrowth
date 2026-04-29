// v21 - Brand-aware: recibe brand y lo inyecta al prompt antes de mandar al modelo
export const config = { api: { bodyParser: { sizeLimit: '10mb' }, responseLimit: '15mb' } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const FAL_KEY = process.env.FAL_KEY;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const HEDRA_KEY = process.env.HEDRA_API_KEY;
  const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
  const HEDRA_BASE = "https://api.hedra.com/web-app/public";
  const HEDRA_CHARACTER_3 = "d1dd37a3-e39a-4854-a298-6510289f9cf2";

  if (!FAL_KEY && !GEMINI_KEY && !HEDRA_KEY) return res.status(500).json({ error: "No API keys configured" });

  const buildBrandContext = (brand) => {
    if (!brand) return "";
    const parts = [];
    if (brand.name) parts.push("BRAND: " + brand.name);
    if (brand.industry) parts.push("INDUSTRY: " + brand.industry);
    let colors = "";
    if (Array.isArray(brand.colors) && brand.colors.length > 0) colors = brand.colors.join(", ");
    else if (brand.color) colors = brand.color;
    if (colors) parts.push("BRAND COLORS: " + colors);
    if (brand.imgStyle || brand.img_style) parts.push("VISUAL STYLE: " + (brand.imgStyle || brand.img_style));
    if (brand.tone) parts.push("TONE: " + brand.tone);
    if (brand.audience) parts.push("AUDIENCE: " + brand.audience);
    if (brand.products) parts.push("REAL PRODUCTS (use ONLY these, do NOT invent): " + String(brand.products).substring(0, 400));
    if (brand.description) parts.push("DESCRIPTION: " + String(brand.description).substring(0, 300));
    if (brand.differentiator) parts.push("DIFFERENTIATOR: " + String(brand.differentiator).substring(0, 200));
    if (brand.knowledge) parts.push("REAL BRAND KNOWLEDGE (use this REAL data, NEVER invent): " + String(brand.knowledge).substring(0, 1500));
    if (brand.realInfo) parts.push("LIVE WEB INFO: " + String(brand.realInfo).substring(0, 1000));
    return parts.length > 0
      ? "BRAND CONTEXT (use this REAL data, do NOT invent products, prices, or facts): " + parts.join(" | ") + ". "
      : "";
  };

  if (req.method === 'GET') {
    const { action, op, endpoint, response_url, status_url, provider } = req.query;
    if (action === 'test') return res.status(200).json({ status: 'ready', model: 'hedra+minimax+veo-fallback', v: '21' });

    if (action === 'proxy' && req.query.uri) {
      try {
        const uri = req.query.uri;
        const separator = uri.includes('?') ? '&' : '?';
        return res.redirect(302, uri + separator + 'key=' + GEMINI_KEY);
      } catch (e) {}
      return res.status(500).json({ error: 'Proxy failed' });
    }

    if (action === 'check') {
      if (provider === 'hedra' && op) {
        try {
          const r = await fetch(HEDRA_BASE + '/generations/' + op + '/status', { headers: { 'X-API-Key': HEDRA_KEY } });
          if (r.ok) {
            const d = await r.json();
            if (d.status === 'complete') {
              const assetId = d.asset_id || d.video_id;
              if (assetId) {
                try {
                  const aRes = await fetch(HEDRA_BASE + '/assets?ids=' + assetId, { headers: { 'X-API-Key': HEDRA_KEY } });
                  if (aRes.ok) {
                    const aData = await aRes.json();
                    const asset = Array.isArray(aData) ? aData[0] : (aData.assets ? aData.assets[0] : aData);
                    const videoUrl = asset?.url || asset?.asset_url || asset?.download_url;
                    if (videoUrl) return res.status(200).json({ status: 'completed', video_url: videoUrl });
                  }
                } catch (e) {}
              }
              return res.status(200).json({ status: 'error', error: 'Hedra completo sin URL' });
            }
            if (d.status === 'error') return res.status(200).json({ status: 'error', error: d.error || 'Hedra falló' });
            return res.status(200).json({ status: 'processing', provider: 'hedra' });
          }
          return res.status(200).json({ status: 'processing', provider: 'hedra' });
        } catch (e) { return res.status(200).json({ status: 'processing', provider: 'hedra' }); }
      }

      if (provider === 'gemini' && op) {
        try {
          const r = await fetch(GEMINI_BASE + '/' + op, { headers: { 'x-goog-api-key': GEMINI_KEY } });
          if (r.ok) {
            const d = await r.json();
            if (d.done) {
              const videoUri = d.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
                || d.response?.generatedVideos?.[0]?.video?.uri
                || d.response?.predictions?.[0]?.video?.uri
                || d.response?.predictions?.[0]?.videoUri;
              if (videoUri) return res.status(200).json({ status: 'completed', video_url: '/api/video?action=proxy&uri=' + encodeURIComponent(videoUri) });
              return res.status(200).json({ status: 'error', error: 'Video done but no URL' });
            }
            return res.status(200).json({ status: 'processing', provider: 'gemini' });
          }
          return res.status(200).json({ status: 'processing', provider: 'gemini' });
        } catch (e) { return res.status(200).json({ status: 'processing', provider: 'gemini' }); }
      }

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
                return res.status(200).json({ status: 'completed_no_url' });
              }
              if (d.status === 'FAILED') return res.status(200).json({ status: 'error', error: d.detail || d.error || 'Video falló' });
              if (d.status === 'IN_QUEUE' || d.status === 'IN_PROGRESS') return res.status(200).json({ status: 'processing', fal_status: d.status });
            }
            if (r.status === 202) return res.status(200).json({ status: 'processing' });
          } catch (e) { continue; }
        }
        return res.status(200).json({ status: 'processing' });
      } catch (e) { return res.status(200).json({ status: 'processing' }); }
    }
    return res.status(400).json({ error: 'Unknown action' });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const prompt = body && body.prompt;
      const image_base64 = body && body.image_base64;
      const brand = body && body.brand;
      const mode = body && body.mode;
      const script = body && body.script;
      const aspect_ratio = (body && body.aspect_ratio) || '9:16';
      const resolution = (body && body.resolution) || '540p';
      const duration_ms = (body && body.duration_ms) || 5000;
      const voice_id = body && body.voice_id;

      if (!prompt && !script) return res.status(400).json({ error: 'No prompt' });

      // ⬇ INYECTAR BRAND CONTEXT al prompt
      const brandContext = buildBrandContext(brand);
      const finalPrompt = brandContext + (prompt || "");

      // HEDRA - persona hablando
      if (mode === 'talking' && script && HEDRA_KEY) {
        try {
          const hedraPayload = {
            type: 'video',
            ai_model_id: HEDRA_CHARACTER_3,
            generated_video_inputs: {
              text_prompt: finalPrompt.substring(0, 500) || 'A person talking naturally',
              ai_model_id: HEDRA_CHARACTER_3,
              resolution: resolution,
              aspect_ratio: aspect_ratio,
              duration_ms: duration_ms
            },
            audio_generation: { text: script, type: 'text_to_speech', language: 'auto', stability: 1, speed: 1 }
          };
          if (voice_id) hedraPayload.audio_generation.voice_id = voice_id;

          const r = await fetch(HEDRA_BASE + '/generations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-API-Key': HEDRA_KEY },
            body: JSON.stringify(hedraPayload)
          });
          if (r.ok) {
            const d = await r.json();
            if (d.id) return res.status(200).json({ status: 'started', operation: d.id, provider: 'hedra' });
          }
        } catch (e) { console.log('Hedra exception:', e.message); }
      }

      // PRIMARY: fal.ai
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
            if (!imageUrl) imageUrl = 'data:image/jpeg;base64,' + image_base64;
          }

          const falEndpoint = (image_base64 && imageUrl)
            ? 'fal-ai/minimax/video-01-live/image-to-video'
            : 'fal-ai/minimax/video-01-live';

          const payload = { prompt: finalPrompt.substring(0, 2000), prompt_optimizer: false };
          if (imageUrl) payload.image_url = imageUrl;

          const r = await fetch('https://queue.fal.run/' + falEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Key ' + FAL_KEY },
            body: JSON.stringify(payload)
          });
          const text = await r.text();
          const d = JSON.parse(text);
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
        } catch (e) { console.log('fal exception:', e.message); }
      }

      // FALLBACK: Gemini Veo
      if (GEMINI_KEY) {
        try {
          const instance = { prompt: finalPrompt.substring(0, 500) };
          if (image_base64) instance.image = { bytesBase64Encoded: image_base64, mimeType: 'image/jpeg' };
          const errors = [];
          const models = ['veo-3.1-generate-preview', 'veo-3.1-lite-generate-preview'];
          for (const model of models) {
            try {
              const r = await fetch(GEMINI_BASE + '/models/' + model + ':predictLongRunning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
                body: JSON.stringify({ instances: [instance], parameters: { aspectRatio: '9:16' } })
              });
              if (r.ok) {
                const d = await r.json();
                if (d.name) return res.status(200).json({ status: 'started', operation: d.name, provider: 'gemini' });
              } else {
                const errText = await r.text();
                errors.push(model + ': ' + r.status + ' - ' + errText.substring(0, 200));
                if (image_base64 && instance.image) {
                  const instanceNoImg = { prompt: instance.prompt };
                  const r2 = await fetch(GEMINI_BASE + '/models/' + model + ':predictLongRunning', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
                    body: JSON.stringify({ instances: [instanceNoImg], parameters: { aspectRatio: '9:16' } })
                  });
                  if (r2.ok) {
                    const d2 = await r2.json();
                    if (d2.name) return res.status(200).json({ status: 'started', operation: d2.name, provider: 'gemini' });
                  }
                }
              }
            } catch (e) { console.log('Gemini Veo exception:', e.message); }
          }
          return res.status(200).json({ status: 'error', error: 'Gemini Veo errors: ' + errors.join(' | ') });
        } catch (e) { console.log('Gemini Veo outer exception:', e.message); }
      }

      return res.status(200).json({ status: 'error', error: 'Todos los servicios fallaron' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}