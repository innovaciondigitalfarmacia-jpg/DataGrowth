export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const GEM = process.env.GEMINI_API_KEY;
  const ANT = process.env.ANTHROPIC_API_KEY;
  if (ANT) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ANT, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify(req.body)
      });
      const d = await r.json();
      if (!d.error) return res.status(200).json(d);
    } catch (e) {}
  }
  if (!GEM) return res.status(500).json({ error: 'No API key' });
  try {
    const sys = req.body.system || '';
    const msg = req.body.messages?.[0]?.content || '';
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEM;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: sys + '\n\n' + msg }] }] })
    });
    const d = await r.json();
    const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (e) { return res.status(500).json({ error: 'API failed' }); }
}
