export default async function handler(req, res) {
  const { prompt } = req.query;
  if (!prompt) return res.status(400).json({ error: "No prompt" });

  const K = process.env.GEMINI_API_KEY;
  if (!K) return res.redirect(302, "https://picsum.photos/768/768");

  // ── Attempt 1: Gemini 2.0 Flash Image Generation ──
  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=" + K,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Generate a professional social media image: " + prompt + ". No text, no words, no letters in the image."
                }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"]
          }
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
          res.setHeader("Cache-Control", "public, max-age=86400");
          return res.send(buf);
        }
      }
    }
  } catch (e) {}

  // ── Attempt 2: Imagen 4 predict (backup) ──
  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=" + K,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: prompt }],
          parameters: { sampleCount: 1, aspectRatio: "1:1", personGeneration: "ALLOW_ADULT" }
        })
      }
    );
    if (r.ok) {
      const d = await r.json();
      const img = d.predictions?.[0]?.bytesBase64Encoded;
      if (img) {
        const buf = Buffer.from(img, "base64");
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(buf);
      }
    }
  } catch (e) {}

  // ── Fallback: placeholder ──
  const seed = Math.abs(prompt.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  return res.redirect(302, "https://picsum.photos/seed/" + seed + "/768/768");
}
