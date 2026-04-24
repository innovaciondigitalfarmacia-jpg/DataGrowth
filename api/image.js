// v9 - Gemini primary, fal.ai Flux fallback - IMPROVED EDITING
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const FAL_KEY = process.env.FAL_KEY;

  // ── GET: Image generation ──
  if (req.method === 'GET') {
    const { prompt, test } = req.query;
    if (test) return res.status(200).json({ key: GEMINI_KEY ? "SI" : "NO", model: "gemini-image" });
    if (!prompt) return res.status(400).json({ error: "No prompt" });

    if (GEMINI_KEY) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const r = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=" + GEMINI_KEY,
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
              if (part.inlineData?.data) {
                const buf = Buffer.from(part.inlineData.data, "base64");
                res.setHeader("Content-Type", part.inlineData.mimeType || "image/png");
                return res.send(buf);
              }
            }
            break;
          } else if ((r.status === 503 || r.status === 500) && attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 5000));
            continue;
          } else {
            break;
          }
        } catch (e) { break; }
      }
    }

    if (FAL_KEY) {
      try {
        const r = await fetch("https://fal.run/fal-ai/flux/dev", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Key " + FAL_KEY },
          body: JSON.stringify({ prompt, image_size: "square_hd", num_images: 1, output_format: "jpeg", guidance_scale: 3.5, num_inference_steps: 28 })
        });
        if (r.ok) {
          const d = await r.json();
          const imageUrl = d.images?.[0]?.url;
          if (imageUrl) {
            const imgRes = await fetch(imageUrl);
            if (imgRes.ok) {
              const buf = Buffer.from(await imgRes.arrayBuffer());
              res.setHeader("Content-Type", "image/jpeg");
              return res.send(buf);
            }
          }
        }
      } catch (e) {}
    }

    const seed = Math.abs(prompt.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
    return res.redirect(302, "https://picsum.photos/seed/" + seed + "/768/768");
  }

  // ── POST: Image editing ──
  if (req.method === 'POST') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const { prompt, image_base64, images } = body || {};
    if (!prompt) return res.status(400).json({ error: "No prompt" });

    const hasImages = (images && Array.isArray(images) && images.length > 0) || image_base64;

    if (GEMINI_KEY) {
      const parts = [];

      // System instruction BEFORE images to force editing behavior
      if (hasImages) {
        parts.push({ text: "You are an expert image compositor and editor. CRITICAL RULES:\n1. Follow the user's instructions LITERALLY and COMPLETELY — every single detail.\n2. If the user says 'put A on B', you MUST place A on B exactly.\n3. If multiple images are provided, each has a specific role described in the instructions (e.g., IMAGE 1 = style reference, IMAGE 2 = element to insert).\n4. Do NOT improvise or add things not requested.\n5. Do NOT skip any instruction no matter how small.\n6. Output ONLY the final image, no text.\n\nImages provided:" });
      }

      if (images && Array.isArray(images)) {
        for (let i = 0; i < images.length; i++) {
          parts.push({ text: "IMAGE " + (i + 1) + ":" });
          parts.push({ inlineData: { mimeType: "image/jpeg", data: images[i] } });
        }
      } else if (image_base64) {
        parts.push({ inlineData: { mimeType: "image/jpeg", data: image_base64 } });
      }

      if (hasImages) {
        parts.push({ text: "NOW FOLLOW THESE INSTRUCTIONS EXACTLY. Do NOT skip any part:\n" + prompt });
      } else {
        parts.push({ text: prompt + "\n\nRespond ONLY with the generated image, no text." });
      }

      // Retry up to 3 times on 503 (high demand)
      for (let attempt = 0; attempt < 3; attempt++) {
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
                const buf = Buffer.from(part.inlineData.data, "base64");
                res.setHeader("Content-Type", part.inlineData.mimeType || "image/png");
                return res.send(buf);
              }
            }
            console.log("Gemini no image in response:", JSON.stringify(d).substring(0, 500));
            break; // Don't retry if response was ok but no image
          } else if ((r.status === 503 || r.status === 500) && attempt < 2) {
            console.log("Gemini 503 (attempt " + (attempt + 1) + "), retrying in " + ((attempt + 1) * 5) + "s...");
            await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 5000));
            continue;
          } else {
            const errText = await r.text();
            console.log("Gemini error " + r.status + ":", errText.substring(0, 500));
            break;
          }
        } catch (e) {
          console.log("Gemini exception:", e.message);
          break;
        }
      }
    }

    // FALLBACK: fal.ai Flux - lower strength to preserve more of original
    if (hasImages && FAL_KEY) {
      try {
        const imgData = image_base64 || images?.[0];
        const r = await fetch("https://fal.run/fal-ai/flux/dev/image-to-image", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Key " + FAL_KEY },
          body: JSON.stringify({ prompt, image_url: `data:image/jpeg;base64,${imgData}`, strength: 0.55, num_images: 1, output_format: "jpeg", guidance_scale: 3.5, num_inference_steps: 28 })
        });
        if (r.ok) {
          const d = await r.json();
          const imageUrl = d.images?.[0]?.url;
          if (imageUrl) {
            const imgRes = await fetch(imageUrl);
            if (imgRes.ok) {
              const buf = Buffer.from(await imgRes.arrayBuffer());
              res.setHeader("Content-Type", "image/jpeg");
              return res.send(buf);
            }
          }
        }
      } catch (e) {}
    }

    return res.status(500).json({ error: "Image generation failed. Gemini and fallback both failed." });
  }

  return res.status(405).json({ error: "Method not allowed" });
}