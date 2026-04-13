// v5 - Gemini for text generation + image vision
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEM = process.env.GEMINI_API_KEY;
  if (!GEM) return res.status(500).json({ error: 'No API key' });

  try {
    const sys = req.body.system || '';
    const msg = req.body.messages?.[0]?.content || '';
    const images = req.body.images || [];

    // Build parts array
    const parts = [];
    
    // Add images if provided (for vision/description)
    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        parts.push({ inlineData: { mimeType: 'image/jpeg', data: img } });
      }
    }
    
    // Add text
    parts.push({ text: sys + '\n\n' + msg });

    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEM,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      }
    );
    const d = await r.json();
    const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (e) {
    return res.status(500).json({ error: 'API failed: ' + e.message });
  }
}
