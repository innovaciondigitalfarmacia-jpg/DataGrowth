// v9 - Gemini primary, DALL-E 3 fallback, fal.ai last resort
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const FAL_KEY = process.env.FAL_KEY;

  // ═══ Helper: Try Gemini ═══
  const tryGemini = async (prompt, imageDataArray) => {
    if (!GEMINI_KEY) return null;
    const parts = [];
    if (imageDataArray && imageDataArray.length > 0) {
      for (const img of imageDataArray) {
        parts.push({ inlineData: { mimeType: "image/jpeg", data: img } });
      }
    }
    parts.push({ text: prompt });

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const r = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=" + GEMINI_KEY,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
            })
          }
        );
        if (r.ok) {
          const d = await r.json();
          const resParts = d.candidates?.[0]?.content?.parts || [];
          for (const part of resParts) {
            if (part.inlineData?.data) {
              return { data: Buffer.from(part.inlineData.data, "base64"), type: part.inlineData.mimeType || "image/png", engine: "gemini" };
            }
          }
          return null; // Gemini responded but no image
        }
        if (r.status === 500 || r.status === 503) {
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue; // Retry
        }
        return null; // Other error, don't retry
      } catch (e) {
        if (attempt === 0) { await new Promise(resolve => setTimeout(resolve, 2000)); continue; }
        return null;
      }
    }
    return null;
  };

  // ═══ Helper: Try DALL-E 3 ═══
  const tryDalle = async (prompt, size) => {
    if (!OPENAI_KEY) return null;
    try {
      const r = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt.substring(0, 4000),
          n: 1,
          size: size || "1024x1024",
          quality: "hd",
          style: "vivid"
        })
      });
      if (r.ok) {
        const d = await r.json();
        const imageUrl = d.data?.[0]?.url;
        if (imageUrl) {
          const imgRes = await fetch(imageUrl);
          if (imgRes.ok) {
            const buf = Buffer.from(await imgRes.arrayBuffer());
            return { data: buf, type: "image/png", engine: "dall-e-3" };
          }
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // ═══ Helper: Try fal.ai Flux ═══
  const tryFal = async (prompt, imageBase64) => {
    if (!FAL_KEY) return null;
    try {
      const url = imageBase64 ? "https://fal.run/fal-ai/flux/dev/image-to-image" : "https://fal.run/fal-ai/flux/dev";
      const body = imageBase64
        ? { prompt, image_url: "data:image/jpeg;base64," + imageBase64, strength: 0.85, num_images: 1, output_format: "jpeg", guidance_scale: 3.5, num_inference_steps: 28 }
        : { prompt, image_size: "square_hd", num_images: 1, output_format: "jpeg", guidance_scale: 3.5, num_inference_steps: 28 };

      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Key " + FAL_KEY },
        body: JSON.stringify(body)
      });
      if (r.ok) {
        const d = await r.json();
        const imageUrl = d.images?.[0]?.url;
        if (imageUrl) {
          const imgRes = await fetch(imageUrl);
          if (imgRes.ok) {
            const buf = Buffer.from(await imgRes.arrayBuffer());
            return { data: buf, type: "image/jpeg", engine: "fal" };
          }
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // ═══ GET: Image generation (text to image) ═══
  if (req.method === 'GET') {
    const { prompt, test } = req.query;
    if (test) return res.status(200).json({ gemini: GEMINI_KEY ? "SI" : "NO", openai: OPENAI_KEY ? "SI" : "NO", fal: FAL_KEY ? "SI" : "NO" });
    if (!prompt) return res.status(400).json({ error: "No prompt" });

    // 1. Try Gemini
    let result = await tryGemini(prompt, null);
    
    // 2. Fallback: DALL-E 3
    if (!result) result = await tryDalle(prompt);
    
    // 3. Last resort: fal.ai
    if (!result) result = await tryFal(prompt);

    if (result) {
      res.setHeader("Content-Type", result.type);
      res.setHeader("X-Engine", result.engine);
      return res.send(result.data);
    }

    // Ultimate fallback: placeholder
    const seed = Math.abs(prompt.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
    return res.redirect(302, "https://picsum.photos/seed/" + seed + "/768/768");
  }

  // ═══ POST: Image editing (with reference images) ═══
  if (req.method === 'POST') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const { prompt, image_base64, images } = body || {};
    if (!prompt) return res.status(400).json({ error: "No prompt" });

    // Collect images
    const imageArray = [];
    if (images && Array.isArray(images)) {
      imageArray.push(...images);
    } else if (image_base64) {
      imageArray.push(image_base64);
    }

    // 1. Try Gemini (best at editing - understands images + follows instructions)
    let result = await tryGemini(prompt, imageArray.length > 0 ? imageArray : null);

    // 2. Fallback: DALL-E 3 (can't edit directly, but generates from detailed prompt)
    if (!result) {
      const editPrompt = imageArray.length > 0
        ? "Based on the following instructions, create a NEW image that matches this description. " + prompt
        : prompt;
      result = await tryDalle(editPrompt);
    }

    // 3. Last resort: fal.ai
    if (!result) result = await tryFal(prompt, imageArray[0] || null);

    if (result) {
      res.setHeader("Content-Type", result.type);
      res.setHeader("X-Engine", result.engine);
      return res.send(result.data);
    }

    return res.status(500).json({ error: "No API available for image generation" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}