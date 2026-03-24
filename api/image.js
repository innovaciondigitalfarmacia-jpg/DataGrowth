export default async function handler(req, res) {
  const { prompt } = req.query;
  if (!prompt) return res.status(400).json({ error: "No prompt" });
  const FAL = process.env.FAL_KEY;
  if (FAL) {
    try {
      const r = await fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: { Authorization: "Key " + FAL, "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt, image_size: "square_hd" })
      });
      if (r.ok) {
        const d = await r.json();
        const url = d.images?.[0]?.url;
        if (url) return res.redirect(302, url);
      }
    } catch (e) {}
  }
  const GEM = process.env.GEMINI_API_KEY;
  if (GEM) {
    try {
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=" + GEM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1 } })
      });
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
  }
  const seed = Math.abs(prompt.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  return res.redirect(302, "https://picsum.photos/seed/" + seed + "/768/768");
}
