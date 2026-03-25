// v1 - Fetch real info from brand websites
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DataGrowthBot/1.0)",
        "Accept": "text/html,application/xhtml+xml"
      },
      redirect: "follow"
    });

    if (!r.ok) return res.status(200).json({ error: "Could not fetch: " + r.status, text: "" });

    const html = await r.text();

    // Extract text content from HTML (remove tags, scripts, styles)
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    // Limit to first 3000 chars to avoid huge prompts
    text = text.substring(0, 3000);

    return res.status(200).json({ text: text, source: url });
  } catch (e) {
    return res.status(200).json({ error: e.message, text: "" });
  }
}
