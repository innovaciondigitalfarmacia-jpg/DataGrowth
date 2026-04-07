export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: "No FAL_KEY" });

  if (req.method === 'GET') {
    const { action, op, endpoint, response_url, status_url } = req.query;
    if (action === 'test') return res.status(200).json({ status: 'ready', model: 'minimax-video-01-live', v: '12' });
    if (action === 'check') {
      try {
        // Try multiple URL patterns to find which one works
        const base = endpoint || 'fal-ai/minimax/video-01-live';
        const urls = [];
        
        // If we have explicit URLs from the POST response, use those first
        if (response_url) urls.push(decodeURIComponent(response_url));
        if (status_url) urls.push(decodeURIComponent(status_url));
        
        // Standard queue API patterns
        if (op) {
          urls.push('https://queue.fal.run/' + base + '/requests/' + op + '/status');
          urls.push('https://queue.fal.run/' + base + '/requests/' + op);
        }
        
        // Debug mode
        if (req.query.debug) {
          const results = [];
          for (const url of urls) {
            try {
              const r = await fetch(url, { headers: { 'Authorization': 'Key ' + FAL_KEY } });
              const t = await r.text();
              results.push({ url, status: r.status, body: t.substring(0, 200) });
            } catch (e) {
              results.push({ url, error: e.message });
            }
          }
          return res.status(200).json({ results });
        }
        
        // Try each URL until we get a valid response
        for (const url of urls) {
          try {
            const r = await fetch(url, { headers: { 'Authorization': 'Key ' + FAL_KEY } });
            
            if (r.status === 200) {
              const text = await r.text();
              if (!text) continue;
              const d = JSON.parse(text);
              
              // Has video URL = completed
              if (d.video?.url) {
                return res.status(200).json({ status: 'completed', video_url: d.video.url });
              }
              // Status field says completed
              if (d.status === 'COMPLETED') {
                // Try to get result
                if (d.response_url) {
                  const r2 = await fetch(d.response_url, { headers: { 'Authorization': 'Key ' + FAL_KEY } });
                  const d2 = await r2.json();
                  if (d2.video?.url) return res.status(200).json({ status: 'completed', video_url: d2.video.url });
                }
                return res.status(200).json({ status: 'completed_no_url', debug: JSON.stringify(d).substring(0, 500) });
              }
              if (d.status === 'FAILED') {
                return res.status(200).json({ status: 'error', error: d.detail || d.error || 'Video fallo' });
              }
              // IN_QUEUE or IN_PROGRESS
              if (d.status === 'IN_QUEUE' || d.status === 'IN_PROGRESS') {
                return res.status(200).json({ status: 'processing', fal_status: d.status });
              }
            }
            
            if (r.status === 202) {
              return res.status(200).json({ status: 'processing', note: '202' });
            }
            
            // 405 = wrong URL, try next
          } catch (e) { continue; }
        }
        
        return res.status(200).json({ status: 'processing' });
      } catch (e) {
        return res.status(200).json({ status: 'processing', debug: e.message });
      }
    }
    return res.status(400).json({ error: 'Unknown action' });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const prompt = body && body.prompt;
      const image_base64 = body && body.image_base64;
      if (!prompt) return res.status(400).json({ error: 'No prompt' });

      let imageUrl = null;
      if (image_base64) {
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

      const endpoint = imageUrl
        ? 'fal-ai/minimax/video-01-live/image-to-video'
        : 'fal-ai/minimax/video-01-live';

      const payload = { prompt: prompt, prompt_optimizer: true };
      if (imageUrl) payload.image_url = imageUrl;

      const r = await fetch('https://queue.fal.run/' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Key ' + FAL_KEY },
        body: JSON.stringify(payload)
      });
      const text = await r.text();
      const d = JSON.parse(text);
      if (d.detail || d.error) return res.status(200).json({ status: 'error', error: d.detail || d.error });
      if (d.request_id) {
        // Return ALL URLs from fal.ai response for polling
        return res.status(200).json({ 
          status: 'started', 
          operation: d.request_id, 
          endpoint: endpoint,
          response_url: d.response_url || '',
          status_url: d.status_url || '',
          cancel_url: d.cancel_url || '',
          raw_keys: Object.keys(d).join(',')
        });
      }
      return res.status(200).json({ status: 'error', error: 'Respuesta: ' + text.substring(0, 200) });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}