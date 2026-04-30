// v11 - Brand-aware: recibe el brand completo y lo inyecta SIEMPRE al prompt
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const OPENAI_KEY = process.env.OPENAI_API_KEY;

  // ═══ Construye contexto completo del brand para inyectar al prompt ═══
  const buildBrandContext = (brand) => {
    if (!brand) return "";
    const parts = [];
    if (brand.name) parts.push("BRAND: " + brand.name);
    if (brand.industry) parts.push("INDUSTRY: " + brand.industry);
    let colors = "";
    if (Array.isArray(brand.colors) && brand.colors.length > 0) colors = brand.colors.join(", ");
    else if (brand.color) colors = brand.color;
    if (colors) parts.push("EXACT BRAND COLORS (use these hex codes in the design): " + colors);
    if (brand.imgStyle || brand.img_style) parts.push("VISUAL STYLE: " + (brand.imgStyle || brand.img_style));
    if (brand.tone) parts.push("BRAND TONE: " + brand.tone);
    if (brand.audience) parts.push("AUDIENCE: " + brand.audience);
    if (brand.products) parts.push("REAL PRODUCTS (use ONLY these, do NOT invent): " + String(brand.products).substring(0, 600));
    if (brand.description) parts.push("DESCRIPTION: " + String(brand.description).substring(0, 400));
    if (brand.differentiator) parts.push("DIFFERENTIATOR: " + String(brand.differentiator).substring(0, 250));
    if (brand.website) parts.push("WEBSITE: " + brand.website);
    if (brand.instagram) parts.push("INSTAGRAM: " + brand.instagram);
    if (brand.knowledge) parts.push("REAL BRAND KNOWLEDGE (from web/IG/files - USE THIS REAL DATA): " + String(brand.knowledge).substring(0, 2000));
    if (brand.realInfo) parts.push("LIVE WEB INFO (just scraped now): " + String(brand.realInfo).substring(0, 1500));
    return parts.length > 0
      ? "\n=== BRAND CONTEXT (CRITICAL - use this REAL data, do NOT invent anything) ===\n" + parts.join("\n") + "\n=== END BRAND CONTEXT ===\n\n"
      : "";
  };

  const tryGemini = async (prompt, imageDataArray) => {
    if (!GEMINI_KEY) return null;
    const parts = [];
    if (imageDataArray && imageDataArray.length > 0) {
      for (const img of imageDataArray) parts.push({ inlineData: { mimeType: "image/jpeg", data: img } });
    }
    parts.push({ text: prompt });
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const r = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=" + GEMINI_KEY,
          { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseModalities: ["IMAGE", "TEXT"] } }) }
        );
        if (r.ok) {
          const d = await r.json();
          const resParts = d.candidates?.[0]?.content?.parts || [];
          for (const part of resParts) {
            if (part.inlineData?.data) return { data: Buffer.from(part.inlineData.data, "base64"), type: part.inlineData.mimeType || "image/png", engine: "gemini" };
          }
          return null;
        }
        if (r.status === 500 || r.status === 503) { await new Promise(resolve => setTimeout(resolve, 3000)); continue; }
        return null;
      } catch (e) {
        if (attempt === 0) { await new Promise(resolve => setTimeout(resolve, 2000)); continue; }
        return null;
      }
    }
    return null;
  };

  const tryDalle = async (prompt, size) => {
    if (!OPENAI_KEY) return null;
    try {
      const r = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
        body: JSON.stringify({ model: "dall-e-3", prompt: prompt.substring(0, 4000), n: 1, size: size || "1024x1024", quality: "hd", style: "vivid" })
      });
      if (r.ok) {
        const d = await r.json();
        const imageUrl = d.data?.[0]?.url;
        if (imageUrl) {
          const imgRes = await fetch(imageUrl);
          if (imgRes.ok) return { data: Buffer.from(await imgRes.arrayBuffer()), type: "image/png", engine: "dall-e-3" };
        }
      }
      return null;
    } catch (e) { return null; }
  };

  if (req.method === 'GET') {
    const { prompt, test } = req.query;
    if (test) return res.status(200).json({ gemini: GEMINI_KEY ? "SI" : "NO", openai: OPENAI_KEY ? "SI" : "NO" });
    if (!prompt) return res.status(400).json({ error: "No prompt" });
    let result = await tryDalle(prompt);
    if (!result) result = await tryGemini(prompt, null);
    if (result) {
      res.setHeader("Content-Type", result.type);
      res.setHeader("X-Engine", result.engine);
      return res.send(result.data);
    }
    const seed = Math.abs(prompt.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
    return res.redirect(302, "https://picsum.photos/seed/" + seed + "/768/768");
  }

  if (req.method === 'POST') {
    let body;
    try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
    catch (e) { return res.status(400).json({ error: "Invalid JSON" }); }

    const { prompt, image_base64, images, brand } = body || {};
    if (!prompt) return res.status(400).json({ error: "No prompt" });

    // ⬇ Brand context se inyecta SIEMPRE al inicio del prompt
    const brandContext = buildBrandContext(brand);
    const finalPrompt = brandContext + prompt;

    const imageArray = [];
    if (images && Array.isArray(images)) imageArray.push(...images);
    else if (image_base64) imageArray.push(image_base64);

    let result = await tryGemini(finalPrompt, imageArray.length > 0 ? imageArray : null);
    if (!result) {
      const editPrompt = imageArray.length > 0
        ? "Based on the following instructions, create a NEW image that matches this description. " + finalPrompt
        : finalPrompt;
      result = await tryDalle(editPrompt);
    }
    if (result) {
      res.setHeader("Content-Type", result.type);
      res.setHeader("X-Engine", result.engine);
      return res.send(result.data);
    }
    return res.status(500).json({ error: "No API available" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}