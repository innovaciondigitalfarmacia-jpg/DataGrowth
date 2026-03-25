// v1 - Veo 3.1 Video Generation
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const K = process.env.GEMINI_API_KEY;
  if (!K) return res.status(500).json({ error: "No API key" });

  const BASE = "https://generativelanguage.googleapis.com/v1beta";
  const action = req.query.action || req.body?.action;

  // ── TEST: /api/video?action=test ──
  if (action === "test") {
    return res.status(200).json({ key: K ? "SI" : "NO", model: "veo-3.1-generate-preview", status: "ready" });
  }

  // ── CHECK STATUS: /api/video?action=check&op=OPERATION_NAME ──
  if (action === "check") {
    const op = req.query.op || req.body?.op;
    if (!op) return res.status(400).json({ error: "No operation name" });
    try {
      const r = await fetch(BASE + "/" + op + "?key=" + K);
      const d = await r.json();
      if (d.done) {
        const video = d.response?.generatedVideos?.[0];
        const videoUri = video?.video?.uri;
        if (videoUri) {
          // Fetch the actual video file
          const vr = await fetch(videoUri + "&key=" + K);
          if (vr.ok) {
            const buf = Buffer.from(await vr.arrayBuffer());
            const b64 = buf.toString("base64");
            return res.status(200).json({
              status: "completed",
              video_base64: b64,
              mime_type: "video/mp4"
            });
          }
        }
        return res.status(200).json({ status: "completed", raw: JSON.stringify(d.response).substring(0, 500) });
      } else {
        return res.status(200).json({ status: "processing" });
      }
    } catch (e) {
      return res.status(200).json({ status: "error", error: e.message });
    }
  }

  // ── GENERATE: POST /api/video ──
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const { prompt, aspect_ratio } = req.body;
  if (!prompt) return res.status(400).json({ error: "No prompt" });

  try {
    const r = await fetch(
      BASE + "/models/veo-3.1-generate-preview:generateVideos?key=" + K,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            aspectRatio: aspect_ratio || "9:16",
            numberOfVideos: 1
          }
        })
      }
    );
    const d = await r.json();

    if (d.error) {
      return res.status(200).json({ status: "error", error: d.error.message || JSON.stringify(d.error) });
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
