// v6 - Nano Banana with image editing + increased body size
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const K = process.env.GEMINI_API_KEY;

  // ── GET: Normal image generation ──
  if (req.method === 'GET') {
    const { prompt, test } = req.query;

    if (test) {
      const results = { key: K ? "SI" : "NO" };
      try {
        const r = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" + K,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "Generate a simple blue circle on white background" }] }],
              generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
            })
          }
        );
        const d = await r.json();
        results.status = r.status;
        results.works = r.ok && d.candidates?.[0]?.content?.parts?.some(p => p.inlineData) ? "YES" : "NO";
      } catch (e) { results.error = e.message; }
      return res.status(200).json(results);
    }

    if (!prompt) return res.status(400).json({ error: "No prompt" });
    if (!K) return res.redirect(302, "https://picsum.photos/768/768");

    try {
      const r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" + K,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
          })
        }
      );
      if (r.ok) {
        const d = await r.json();
        const parts = d.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const buf = Buffer.from(part.inlineData.data, "base64");
            res.setHeader("Content-Type", part.inlineData.mimeType || "image/png");
            return res.send(buf);
          }
        }
      }
    } catch (e) {}

    const seed = Math.abs(prompt.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
    return res.redirect(302, "https://picsum.photos/seed/" + seed + "/768/768");
  }

  // ── POST: Image editing (user uploads a photo + prompt) ──
  if (req.method === 'POST') {
    if (!K) return res.status(500).json({ error: "No API key" });

    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const { prompt, image_base64 } = body || {};
    if (!prompt) return res.status(400).json({ error: "No prompt" });

    const parts = [];
    if (image_base64) {
      parts.push({ inlineData: { mimeType: "image/jpeg", data: image_base64 } });
    }
    parts.push({ text: prompt });

    try {
      const r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" + K,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
          })
        }
      );
      if (r.ok) {
        const d = await r.json();
        const resParts = d.candidates?.[0]?.content?.parts || [];
        for (const part of resParts) {
          if (part.inlineData && part.inlineData.data) {
            const buf = Buffer.from(part.inlineData.data, "base64");
            res.setHeader("Content-Type", part.inlineData.mimeType || "image/png");
            return res.send(buf);
          }
        }
        return res.status(500).json({ error: "No image in response", raw: JSON.stringify(d).substring(0, 300) });
      }
      const errData = await r.text();
      return res.status(500).json({ error: "API error " + r.status, detail: errData.substring(0, 300) });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
