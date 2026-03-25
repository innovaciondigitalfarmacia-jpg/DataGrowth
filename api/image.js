// v2
export default async function handler(req, res) {
  const { prompt, test } = req.query;

  const K = process.env.GEMINI_API_KEY;

  // ── MODO TEST: /api/image?test=1 ──
  if (test) {
    const results = { key: K ? "SI (" + K.slice(0, 8) + "...)" : "NO" };
    try {
      const r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=" + K,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Generate a simple blue circle" }] }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
          })
        }
      );
      const d = await r.json();
      results.flash_status = r.status;
      if (r.ok && d.candidates?.[0]?.content?.parts?.some(p => p.inlineData)) {
        results.flash = "FUNCIONA";
      } else {
        results.flash = "FALLO";
        results.flash_error = JSON.stringify(d).substring(0, 500);
      }
    } catch (e) { results.flash = "ERROR: " + e.message; }

    try {
      const r2 = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=" + K,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instances: [{ prompt: "blue circle" }], parameters: { sampleCount: 1 } })
        }
      );
      const d2 = await r2.json();
      results.imagen4_status = r2.status;
      if (r2.ok && d2.predictions?.[0]?.bytesBase64Encoded) {
        results.imagen4 = "FUNCIONA";
      } else {
        results.imagen4 = "FALLO";
        results.imagen4_error = JSON.stringify(d2).substring(0, 500);
      }
    } catch (e) { results.imagen4 = "ERROR: " + e.message; }

    return res.status(200).json(results);
  }

  // ── MODO NORMAL: generar imagen ──
  if (!prompt) return res.status(400).json({ error: "No prompt" });
  if (!K) return res.redirect(302, "https://picsum.photos/768/768");

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=" + K,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Generate a professional social media image: " + prompt + ". No text, no words, no letters." }] }],
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

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=" + K,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: "1:1", personGeneration: "ALLOW_ADULT" } })
      }
    );
    if (r.ok) {
      const d = await r.json();
      const img = d.predictions?.[0]?.bytesBase64Encoded;
      if (img) {
        const buf = Buffer.from(img, "base64");
        res.setHeader("Content-Type", "image/png");
        return res.send(buf);
      }
    }
  } catch (e) {}

  const seed = Math.abs(prompt.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  return res.redirect(302, "https://picsum.photos/seed/" + seed + "/768/768");
}
