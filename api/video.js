export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: "No FAL_KEY" });

  if (req.method === 'GET') {
    const { action, op, endpoint } = req.query;
    if (action === 'test') return res.status(200).json({ status: 'ready', model: 'minimax-video-01-live' });
    if (action === 'check' && op) {
      try {
        const base = endpoint || 'fal-ai/minimax/video-01-live';
        // Try to get result directly (skip status check)
        const resultUrl = 'https://queue.fal.run/' + base + '/requests/' + op;
        const r = await fetch(resultUrl, {
          headers: { 'Authorization': 'Key ' + FAL_KEY }
        });
        
        if (r.status === 202) {
          // 202 = still processing
          return res.status(200).json({ status: 'processing' });
        }
        
        const text = await r.text();
        
        if (req.query.debug) {
          return res.status(200).json({ raw: text.substring(0, 500), httpStatus: r.status });
        }
        
        if (!text) return res.status(200).json({ status: 'processing' });
        
        const d = JSON.parse(text);
        
        // Check if it's a completed result with video
        if (d.video?.url) {
          return res.status(200).json({ status: 'completed', video_url: d.video.url });
        }
        
        // Check if status field indicates still processing
        if (d.status === 'IN_QUEUE' || d.status === 'IN_PROGRESS') {
          return res.status(200).json({ status: 'processing', fal_status: d.status });
        }
        
        if (d.status === 'FAILED' || d.detail) {
          return res.status(200).json({ status: 'error', error: d.detail || d.error || 'Video fallo' });
        }
        
        // Unknown response - return as debug
        return res.status(200).json({ status: 'processing', debug: text.substring(0, 300) });
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
      if (d.request_id) return res.status(200).json({ status: 'started', operation: d.request_id, endpoint: endpoint });
      return res.status(200).json({ status: 'error', error: 'Respuesta inesperada' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}