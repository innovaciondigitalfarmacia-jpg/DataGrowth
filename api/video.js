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
    if (action === 'test') return res.status(200).json({ status: 'ready' });
    if (action === 'check' && op) {
      try {
        // Use the same endpoint base that was used for submission
        const base = endpoint || 'fal-ai/kling-video/v2/master/text-to-video';
        const statusUrl = 'https://queue.fal.run/' + base + '/requests/' + op + '/status';
        const r = await fetch(statusUrl, {
          headers: { 'Authorization': 'Key ' + FAL_KEY }
        });
        const text = await r.text();
        console.log('Status response:', text);
        if (!text) return res.status(200).json({ status: 'processing' });
        const d = JSON.parse(text);
        if (d.status === 'COMPLETED') {
          const resultUrl = 'https://queue.fal.run/' + base + '/requests/' + op;
          const r2 = await fetch(resultUrl, { headers: { 'Authorization': 'Key ' + FAL_KEY } });
          const d2 = await r2.json();
          console.log('Result keys:', JSON.stringify(Object.keys(d2)));
          const url = d2.video?.url || d2.data?.video?.url;
          if (url) {
            const vr = await fetch(url);
            const buf = Buffer.from(await vr.arrayBuffer());
            return res.status(200).json({ status: 'completed', video_base64: buf.toString('base64'), mime_type: 'video/mp4' });
          }
          // Debug: return the actual response so we can see what's there
          return res.status(200).json({ status: 'completed_no_url', debug: JSON.stringify(d2).substring(0, 500) });
        }
        if (d.status === 'FAILED') return res.status(200).json({ status: 'error', error: d.error || 'Video fallo en fal.ai' });
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

      const endpoint = image_base64
        ? 'fal-ai/kling-video/v2/master/image-to-video'
        : 'fal-ai/kling-video/v2/master/text-to-video';

      const payload = { prompt: prompt, duration: '5', aspect_ratio: '9:16' };
      if (image_base64) payload.image_url = 'data:image/jpeg;base64,' + image_base64;

      const r = await fetch('https://queue.fal.run/' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Key ' + FAL_KEY },
        body: JSON.stringify(payload)
      });
      const text = await r.text();
      const d = JSON.parse(text);
      if (d.request_id) return res.status(200).json({ status: 'started', operation: d.request_id, endpoint: endpoint });
      return res.status(200).json({ status: 'error', error: d.detail || d.error || 'Sin request_id' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}