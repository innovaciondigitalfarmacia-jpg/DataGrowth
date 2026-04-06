// v4 - fal.ai Kling video generation (faster than Veo)
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: "No fal.ai API key configured" });

  const FAL_HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Key " + FAL_KEY
  };

  // ── GET: check status of a running job ──
  if (req.method === 'GET') {
    const action = req.query.action;

    if (action === "test") {
      return res.status(200).json({ key: "SI", model: "kling-video/v2.1/standard/text-to-video", status: "ready" });
    }

    if (action === "check") {
      const requestId = req.query.op;
      if (!requestId) return res.status(400).json({ error: "No request ID" });

      try {
        // Check status
        const statusRes = await fetch(
          `https://queue.fal.run/fal-ai/kling-video/requests/${requestId}/status`,
          { headers: FAL_HEADERS }
        );
        const statusData = await statusRes.json();

        if (statusData.status === "COMPLETED") {
          // Get result
          const resultRes = await fetch(
            `https://queue.fal.run/fal-ai/kling-video/requests/${requestId}`,
            { headers: FAL_HEADERS }
          );
          const resultData = await resultRes.json();
          const videoUrl = resultData.video?.url;

          if (videoUrl) {
            // Download and return as base64
            const vr = await fetch(videoUrl);
            if (vr.ok) {
              const buf = Buffer.from(await vr.arrayBuffer());
              const b64 = buf.toString("base64");
              return res.status(200).json({ status: "completed", video_base64: b64, mime_type: "video/mp4" });
            }
            return res.status(200).json({ status: "completed_no_download", video_uri: videoUrl });
          }
          return res.status(200).json({ status: "completed_unknown", raw: JSON.stringify(resultData).substring(0, 500) });
        } else if (statusData.status === "FAILED") {
          return res.status(200).json({ status: "error", error: statusData.error || "Video generation failed" });
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

  try {
    // Choose model based on whether image is provided
    const model = image_base64
      ? "fal-ai/kling-video/v2.1/standard/image-to-video"
      : "fal-ai/kling-video/v2.1/standard/text-to-video";

    const falBody = {
      prompt: prompt,
      duration: "5",
      aspect_ratio: aspect_ratio === "9:16" ? "9:16" : "16:9",
    };

    if (image_base64) {
      falBody.image_url = `data:image/jpeg;base64,${image_base64}`;
    }

    const r = await fetch(`https://queue.fal.run/${model}`, {
      method: "POST",
      headers: FAL_HEADERS,
      body: JSON.stringify(falBody)
    });

    const d = await r.json();

    if (d.request_id) {
      return res.status(200).json({ status: "started", operation: d.request_id });
    }

    return res.status(200).json({ status: "error", error: d.detail || d.error || "No request ID returned" });
  } catch (e) {
    return res.status(500).json({ status: "error", error: e.message });
  }
}
