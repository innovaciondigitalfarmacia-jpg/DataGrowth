// v4
export default async function handler(req, res) {
  const { prompt, test } = req.query;
  const K = process.env.GEMINI_API_KEY;

  if (test) {
    const results = { key: K ? "SI (" + K.slice(0, 8) + "...)" : "NO" };
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
      results.nano_banana_status = r.status;
      if (r.ok && d.candidates?.[0]?.content?.parts?.some(p => p.inlineData)) {
        results.nano_banana = "FUNCIONA";
      } else {
        results.nano_banana = "FALLO";
        results.nano_banana_error = JSON.stringify(d).substring(0, 500);
      }
    } catch (e) { results.nano_banana = "ERROR: " + e.message; }
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
