// v3 - Veo 3.1 Video Generation with image-to-video support
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const K = process.env.GEMINI_API_KEY;
  if (!K) return res.status(500).json({ error: "No API key configured" });

  const BASE = "https://generativelanguage.googleapis.com/v1beta";
  const HEADERS = { "Content-Type": "application/json", "x-goog-api-key": K };

  // ── GET actions: test and check ──
  if (req.method === 'GET') {
    const action = req.query.action;

    if (action === "test") {
      return res.status(200).json({ key: "SI", model: "veo-3.1-generate-preview", status: "ready" });
    }

    if (action === "check") {
      const op = req.query.op;
      if (!op) return res.status(400).json({ error: "No operation name" });
      try {
        const r = await fetch(BASE + "/" + op, { headers: { "x-goog-api-key": K } });
        const d = await r.json();
        if (d.done) {
          const videoUri = d.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
          if (videoUri) {
            const vr = await fetch(videoUri, { headers: { "x-goog-api-key": K }, redirect: "follow" });
            if (vr.ok) {
              const buf = Buffer.from(await vr.arrayBuffer());
              const b64 = buf.toString("base64");
              return res.status(200).json({ status: "completed", video_base64: b64, mime_type: "video/mp4" });
            }
            return res.status(200).json({ status: "completed_no_download", video_uri: videoUri });
          }
          return res.status(200).json({ status: "completed_unknown", raw: JSON.stringify(d.response || d).substring(0, 800) });
        } else {
          return res.status(200).json({ status: "processing" });
        }
      } catch (e) {
        return res.status(200).json({ status: "error", error: e.message });
      }
    }

    return res.status(400).json({ error: "Unknown action" });
  }

  // ── POST: Generate video ──
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { prompt, aspect_ratio, image_base64 } = body || {};
  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  // Build request body
  const instance = { prompt: prompt };

  // If image provided, add it as first frame for image-to-video
  if (image_base64) {
    instance.image = {
      bytesBase64Encoded: image_base64,
      mimeType: "image/jpeg"
    };
  }

  try {
    const r = await fetch(
      BASE + "/models/veo-3.1-generate-preview:predictLongRunning",
      {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({
          instances: [instance],
          parameters: { aspectRatio: aspect_ratio || "9:16" }
        })
      }
    );
    const text = await r.text();
    let d;
    try { d = JSON.parse(text); } catch { return res.status(200).json({ status: "error", error: "Invalid response from Veo", raw: text.substring(0, 500) }); }

    if (d.error) {
      return res.status(200).json({ status: "error", error: d.error.message || JSON.stringify(d.error).substring(0, 300) });
    }

    const opName = d.name;
    if (opName) {
      return res.status(200).json({ status: "started", operation: opName });
    }

    return res.status(200).json({ status: "error", error: "No operation returned", raw: JSON.stringify(d).substring(0, 500) });
  } catch (e) {
    return res.status(500).json({ status: "error", error: e.message });
  }
}
