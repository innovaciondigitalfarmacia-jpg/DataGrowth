export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: "No FAL_KEY" });

  if (req.method === 'GET') {
    const { action, op } = req.query;
    if (action === 'test') return res.status(200).json({ status: 'ready', model: 'kling' });
    if (action === 'check' && op) {
      try {
        const r = await fetch('https://queue.fal.run/fal-ai/kling-video/v2/master/text-to-video/requests/' + op + '/status', {
          headers: { 'Authorization': 'Key ' + FAL_KEY }
        });
        const d = await r.json();
        if (d.status === 'COMPLETED') {
          const r2 = await fetch('https://queue.fal.run/fal-ai/kling-video/v2/master/text-to-video/requests/' + op, {
            headers: { 'Authorization': 'Key ' + FAL_KEY }
          });
          const d2 = await r2.json();
          const url = d2.video && d2.video.url;
          if (url) {
            const vr = await fetch(url);
            const buf = Buffer.from(await vr.arrayBuffer());
            return res.status(200).json({ status: 'completed', video_base64: buf.toString('base64'), mime_type: 'video/mp4' });
          }
        }
        if (d.status === 'FAILED') return res.status(200).json({ status: 'error', error: 'Video fallo' });
        return res.status(200).json({ status: 'processing' });
      } catch (e) {
        return res.status(200).json({ status: 'error', error: e.message });
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

      const endpoint = image_base64
        ? 'https://queue.fal.run/fal-ai/kling-video/v2/master/image-to-video'
        : 'https://queue.fal.run/fal-ai/kling-video/v2/master/text-to-video';

      const payload = { prompt: prompt, duration: '5', aspect_ratio: '9:16' };
      if (image_base64) payload.image_url = 'data:image/jpeg;base64,' + image_base64;

      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Key ' + FAL_KEY },
        body: JSON.stringify(payload)
      });
      const d = await r.json();
      if (d.request_id) return res.status(200).json({ status: 'started', operation: d.request_id });
      return res.status(200).json({ status: 'error', error: d.detail || d.error || 'Sin request_id' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}