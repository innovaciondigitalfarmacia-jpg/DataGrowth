export default async function handler(req, res) {
  const K = process.env.GEMINI_API_KEY;
  const results = { geminiKey: K ? "Existe (" + K.slice(0, 8) + "...)" : "No configurada" };

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=" + K,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Generate a simple image of a blue circle on white background" }] }],
          generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
        })
      }
    );
    const d = await r.json();
    if (r.ok && d.candidates?.[0]?.content?.parts?.some(p => p.inlineData)) {
      results.geminiFlash = "FUNCIONA";
    } else {
      results.geminiFlash = "FALLO status " + r.status;
      results.geminiFlashError = JSON.stringify(d).substring(0, 500);
    }
  } catch (e) {
    results.geminiFlash = "ERROR: " + e.message;
  }

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=" + K,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: "a blue circle" }],
          parameters: { sampleCount: 1, aspectRatio: "1:1" }
        })
      }
    );
    const d = await r.json();
    if (r.ok && d.predictions?.[0]?.bytesBase64Encoded) {
      results.imagen4 = "FUNCIONA";
    } else {
      results.imagen4 = "FALLO status " + r.status;
      results.imagen4Error = JSON.stringify(d).substring(0, 500);
    }
  } catch (e) {
    results.imagen4 = "ERROR: " + e.message;
  }

  return res.status(200).json(results);
}
