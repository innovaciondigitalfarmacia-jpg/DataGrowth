// v1 - File reading with Gemini (PDF, images, Word, Excel)
export const config = { api: { bodyParser: { sizeLimit: '15mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEM = process.env.GEMINI_API_KEY;
  if (!GEM) return res.status(500).json({ error: 'No API key' });

  try {
    const { file_base64, mime_type, filename } = req.body;
    if (!file_base64) return res.status(400).json({ error: 'No file' });

    const mimeType = mime_type || 'application/pdf';
    
    // Use Gemini to extract text from the file
    const parts = [
      { inlineData: { mimeType: mimeType, data: file_base64 } },
      { text: "Extract ALL text content from this document. Include: headings, paragraphs, tables, lists, prices, product names, services, contact info, descriptions, and any other relevant information. Return the extracted text in a clean, organized format. If it's a spreadsheet, format the data as readable text. If it's an image, describe everything visible including any text. Return ONLY the extracted content, no commentary." }
    ];

    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEM,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      }
    );

    if (!r.ok) {
      const errText = await r.text();
      console.log('Gemini fileread error:', errText.substring(0, 300));
      return res.status(500).json({ error: 'Failed to read file' });
    }

    const d = await r.json();
    const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return res.status(200).json({ 
      text: text.substring(0, 5000),
      chars: text.length,
      filename: filename || 'document'
    });
  } catch (e) {
    return res.status(500).json({ error: 'Error: ' + e.message });
  }
}
