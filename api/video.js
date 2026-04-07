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
    if (action === 'test') return res.status(200).json({ status: 'ready', model: 'hailuo-02', v: '14' });
    if (action === 'check') {
      try {
        const base = endpoint || 'fal-ai/minimax/hailuo-02/standard/text-to-video';
        const urls = [];
        if (response_url) urls.push(decodeURIComponent(response_url));
        if (status_url) urls.push(decodeURIComponent(status_url));
        if (op) {
          urls.push('https://queue.fal.run/' + base + '/requests/' + op);
          urls.push('https://queue.fal.run/' + base + '/requests/' + op + '/status');
        }

        if (req.query.debug) {
          const results = [];
          for (const url of urls) {
            try {
              const r = await fetch(url, { headers: { 'Authorization': 'Key ' + FAL_KEY } });
              const t = await r.text();
              results.push({ url: url.substring(0, 100), status: r.status, body: t.substring(0, 200) });
            } catch (e) { results.push({ url: url.substring(0, 100), error: e.message }); }
          }
          return res.status(200).json({ results });
        }

        for (const url of urls) {
          try {
            const r = await fetch(url, { headers: { 'Authorization': 'Key ' + FAL_KEY } });
            if (r.status === 200) {
              const text = await r.text();
              if (!text) continue;
              const d = JSON.parse(text);
              if (d.video?.url) return res.status(200).json({ status: 'completed', video_url: d.video.url });
              if (d.status === 'COMPLETED' && d.response_url) {
                const r2 = await fetch(d.response_url, { headers: { 'Authorization': 'Key ' + FAL_KEY } });
                const d2 = await r2.json();
                if (d2.video?.url) return res.status(200).json({ status: 'completed', video_url: d2.video.url });
                return res.status(200).json({ status: 'completed_no_url', debug: JSON.stringify(d2).substring(0, 500) });
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

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const prompt = body && body.prompt;
      const image_base64 = body && body.image_base64;
      if (!prompt) return res.status(400).json({ error: 'No prompt' });

      let imageUrl = null;
      let uploadError = null;

      if (image_base64) {
        // Method 1: Upload to fal storage
        try {
          const imgBuf = Buffer.from(image_base64, 'base64');
          const uploadRes = await fetch('https://fal.run/fal-ai/storage/upload', {
            method: 'POST',
            headers: {
              'Authorization': 'Key ' + FAL_KEY,
              'Content-Type': 'application/octet-stream',
            },
            body: imgBuf
          });
          const uploadText = await uploadRes.text();
          if (uploadRes.ok) {
            const uploadData = JSON.parse(uploadText);
            imageUrl = uploadData.url || uploadData.file_url || uploadData.access_url;
          } else {
            uploadError = 'Upload1: ' + uploadRes.status + ' ' + uploadText.substring(0, 100);
          }
        } catch (e) {
          uploadError = 'Upload1 error: ' + e.message;
        }

        // Method 2: Try REST endpoint if first failed
        if (!imageUrl) {
          try {
            const imgBuf = Buffer.from(image_base64, 'base64');
            const uploadRes = await fetch('https://rest.fal.run/storage/upload', {
              method: 'PUT',
              headers: {
                'Authorization': 'Key ' + FAL_KEY,
                'Content-Type': 'image/jpeg',
              },
              body: imgBuf
            });
            const uploadText = await uploadRes.text();
            if (uploadRes.ok) {
              const uploadData = JSON.parse(uploadText);
              imageUrl = uploadData.url || uploadData.file_url || uploadData.access_url;
            } else {
              uploadError += ' | Upload2: ' + uploadRes.status + ' ' + uploadText.substring(0, 100);
            }
          } catch (e) {
            uploadError += ' | Upload2 error: ' + e.message;
          }
        }

        // Method 3: Try data URI directly
        if (!imageUrl) {
          imageUrl = 'data:image/jpeg;base64,' + image_base64;
        }
      }

      const endpoint = (image_base64 && imageUrl)
        ? 'fal-ai/minimax/hailuo-02/standard/image-to-video'
        : 'fal-ai/minimax/hailuo-02/standard/text-to-video';

      const payload = { prompt: prompt, prompt_optimizer: true, duration: 10, resolution: "768P" };
      if (imageUrl) payload.image_url = imageUrl;

      const r = await fetch('https://queue.fal.run/' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Key ' + FAL_KEY },
        body: JSON.stringify(payload)
      });
      const text = await r.text();
      const d = JSON.parse(text);
      if (d.detail || d.error) {
        return res.status(200).json({ status: 'error', error: (d.detail || d.error) + (uploadError ? ' [' + uploadError + ']' : '') });
      }
      if (d.request_id) {
        return res.status(200).json({
          status: 'started',
          operation: d.request_id,
          endpoint: endpoint,
          response_url: d.response_url || '',
          status_url: d.status_url || '',
          used_image: !!image_base64,
          image_method: imageUrl?.startsWith('data:') ? 'data_uri' : 'uploaded'
        });
      }
      return res.status(200).json({ status: 'error', error: 'Respuesta: ' + text.substring(0, 200) });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}