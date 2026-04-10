export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DataGrowthBot/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-CO,es;q=0.9,en;q=0.8"
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(200).json({ text: "", error: "HTTP " + response.status });
    }

    const html = await response.text();

    // Extract useful text from HTML
    let text = html
      // Remove scripts and styles
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
      // Remove HTML tags
      .replace(/<[^>]+>/g, " ")
      // Decode common entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&#\d+;/g, " ")
      // Clean whitespace
      .replace(/\s+/g, " ")
      .trim();

    // Limit to 2000 chars
    if (text.length > 2000) text = text.substring(0, 2000);

    // If text is too short, probably not useful
    if (text.length < 50) {
      return res.status(200).json({ text: "", error: "No useful content found" });
    }

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(200).json({ text: "", error: e.message || "Failed to scrape" });
  }
}
