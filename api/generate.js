// v6 - Brand-aware text generation: recibe brand completo y lo inyecta SIEMPRE
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEM = process.env.GEMINI_API_KEY;
  if (!GEM) return res.status(500).json({ error: 'No API key' });

  const buildBrandContext = (brand) => {
    if (!brand) return "";
    const parts = [];
    if (brand.name) parts.push("MARCA: " + brand.name);
    if (brand.industry) parts.push("INDUSTRIA: " + brand.industry);
    if (brand.tone) parts.push("TONO: " + brand.tone);
    if (brand.audience) parts.push("AUDIENCIA: " + brand.audience);
    if (brand.brandVoice || brand.brand_voice) parts.push("VOZ DE MARCA: " + (brand.brandVoice || brand.brand_voice));
    let colors = "";
    if (Array.isArray(brand.colors) && brand.colors.length > 0) colors = brand.colors.join(", ");
    else if (brand.color) colors = brand.color;
    if (colors) parts.push("COLORES DE MARCA: " + colors);
    if (brand.imgStyle || brand.img_style) parts.push("ESTILO VISUAL: " + (brand.imgStyle || brand.img_style));
    if (brand.products) parts.push("PRODUCTOS REALES (USA SOLO ESTOS, NUNCA INVENTES): " + String(brand.products).substring(0, 800));
    if (brand.description) parts.push("DESCRIPCION: " + String(brand.description).substring(0, 400));
    if (brand.differentiator) parts.push("DIFERENCIADOR: " + String(brand.differentiator).substring(0, 300));
    if (brand.website) parts.push("WEB: " + brand.website);
    if (brand.instagram) parts.push("INSTAGRAM: " + brand.instagram);
    if (brand.facebook) parts.push("FACEBOOK: " + brand.facebook);
    if (brand.knowledge) parts.push("BASE DE CONOCIMIENTO REAL DE LA MARCA (info de web/IG/archivos - USA ESTA INFO):\n" + String(brand.knowledge).substring(0, 4000));
    if (brand.realInfo) parts.push("INFO LIVE DE LA WEB (recien scrapeada - DATA FRESCA):\n" + String(brand.realInfo).substring(0, 2500));
    return parts.length > 0
      ? "\n=== CONTEXTO DE LA MARCA (CRITICO - USA esta data REAL, NUNCA inventes precios, productos, datos ni nada) ===\n" + parts.join("\n") + "\n=== FIN CONTEXTO MARCA ===\n\n"
      : "";
  };

  try {
    const sys = req.body.system || '';
    const msg = req.body.messages?.[0]?.content || '';
    const images = req.body.images || [];
    const brand = req.body.brand || null;

    const brandContext = buildBrandContext(brand);

    const parts = [];
    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) parts.push({ inlineData: { mimeType: 'image/jpeg', data: img } });
    }
    parts.push({ text: brandContext + sys + '\n\n' + msg });

    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEM,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts }] }) }
    );
    const d = await r.json();
    const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (e) {
    return res.status(500).json({ error: 'API failed: ' + e.message });
  }
}