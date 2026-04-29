// Instagram integration - Instagram Login (direct) + Publishing
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const APP_ID = process.env.INSTAGRAM_APP_ID;
  const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wmonacfzxjpndbhwsdsf.supabase.co';
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const BASE_URL = 'https://datagrowthagency.com';
  const GRAPH = 'https://graph.instagram.com';

  if (!APP_ID || !APP_SECRET) return res.status(500).json({ error: 'Instagram App not configured. Set INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET.' });

  // ── GET: OAuth flow ──
  if (req.method === 'GET') {
    const { action, code, state } = req.query;
    const brand_id = req.query.brand_id || state || '';

    // Step 1: Redirect to Instagram Login
    if (action === 'connect') {
      const redirect = BASE_URL + '/api/instagram?action=callback';
      const scope = 'instagram_business_basic,instagram_business_content_publish';
      const url = 'https://www.instagram.com/oauth/authorize?client_id=' + APP_ID + '&redirect_uri=' + encodeURIComponent(redirect) + '&scope=' + scope + '&response_type=code&state=' + encodeURIComponent(brand_id);
      return res.redirect(302, url);
    }

    // Step 2: OAuth callback (detect by action=callback OR presence of code)
    if (action === 'callback' || code) {
      if (!code) return res.status(400).send('No code received');
      const redirect = BASE_URL + '/api/instagram?action=callback';
      const brandId = state || brand_id || '';

      try {
        // Exchange code for short-lived token
        const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'client_id=' + APP_ID + '&client_secret=' + APP_SECRET + '&grant_type=authorization_code&redirect_uri=' + encodeURIComponent(redirect) + '&code=' + code
        });
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) return res.status(400).send('<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#0a0e1a;color:#fff"><h2 style="color:#ef4444">Error de token</h2><p>' + JSON.stringify(tokenData).substring(0, 300) + '</p><script>setTimeout(()=>window.close(),5000)</script></body></html>');

        const shortToken = tokenData.access_token;
        const userId = tokenData.user_id;

        // Exchange for long-lived token (60 days)
        const longRes = await fetch(GRAPH + '/access_token?grant_type=ig_exchange_token&client_secret=' + APP_SECRET + '&access_token=' + shortToken);
        const longData = await longRes.json();
        const longToken = longData.access_token || shortToken;

        // Get Instagram user info
        const userRes = await fetch(GRAPH + '/me?fields=user_id,username,account_type,profile_picture_url&access_token=' + longToken);
        const userData = await userRes.json();
        const username = userData.username || '';

        // Save to brand in Supabase
        if (brandId && SERVICE_KEY) {
          await fetch(SUPABASE_URL + '/rest/v1/brands?id=eq.' + brandId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ ig_token: longToken, ig_user_id: String(userId), instagram: '@' + username })
          });
        }

        // Success page
        return res.status(200).send('<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#0a0e1a;color:#fff"><h2 style="color:#37c2eb">✅ Instagram conectado</h2><p>Cuenta: @' + username + '</p><p style="color:#888">Esta ventana se cerrara automaticamente...</p><script>setTimeout(()=>{ window.opener?.postMessage({type:"ig_connected",username:"' + username + '"},"*"); window.close(); },2000)</script></body></html>');
      } catch (e) {
        return res.status(500).send('<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#0a0e1a;color:#fff"><h2 style="color:#ef4444">Error</h2><p>' + e.message + '</p><script>setTimeout(()=>window.close(),5000)</script></body></html>');
      }
    }

    // Check connection status
    if (action === 'status') {
      const { ig_token, ig_user_id } = req.query;
      if (!ig_token || !ig_user_id) return res.status(200).json({ connected: false });
      try {
        const r = await fetch(GRAPH + '/me?fields=username&access_token=' + ig_token);
        const d = await r.json();
        return res.status(200).json({ connected: !!d.username, username: d.username });
      } catch (e) {
        return res.status(200).json({ connected: false });
      }
    }

    return res.status(400).json({ error: 'Unknown action' });
  }

  // ── POST: Publish to Instagram ──
  if (req.method === 'POST') {
    const { ig_token, ig_user_id, image_base64, image_url, video_url, caption, media_type } = req.body;
    if (!ig_token || !ig_user_id) return res.status(400).json({ error: 'Instagram not connected' });
    if (!caption) return res.status(400).json({ error: 'No caption' });

    try {
      // VIDEO/REELS publishing
      if (media_type === 'REELS' && video_url) {
        const createRes = await fetch(GRAPH + '/' + ig_user_id + '/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ video_url: video_url, caption: caption, media_type: 'REELS', access_token: ig_token })
        });
        const createData = await createRes.json();
        if (!createData.id) return res.status(400).json({ error: 'Failed to create video: ' + JSON.stringify(createData).substring(0, 300) });

        let ready = false;
        for (let i = 0; i < 30; i++) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          const statusRes = await fetch(GRAPH + '/' + createData.id + '?fields=status_code&access_token=' + ig_token);
          const statusData = await statusRes.json();
          if (statusData.status_code === 'FINISHED') { ready = true; break; }
          if (statusData.status_code === 'ERROR') return res.status(400).json({ error: 'Video processing failed' });
        }
        if (!ready) return res.status(400).json({ error: 'Video processing timed out' });

        const pubRes = await fetch(GRAPH + '/' + ig_user_id + '/media_publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creation_id: createData.id, access_token: ig_token })
        });
        const pubData = await pubRes.json();
        if (pubData.id) return res.status(200).json({ success: true, post_id: pubData.id });
        return res.status(400).json({ error: 'Failed to publish: ' + JSON.stringify(pubData).substring(0, 300) });
      }

      // IMAGE publishing
      let publicUrl = image_url;

      if (image_base64 && !publicUrl) {
        const imgBuf = Buffer.from(image_base64, 'base64');
        const fileName = 'ig_' + Date.now() + '.jpg';
        const uploadRes = await fetch(SUPABASE_URL + '/storage/v1/object/public-images/' + fileName, {
          method: 'POST',
          headers: { 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY, 'Content-Type': 'image/jpeg' },
          body: imgBuf
        });
        if (uploadRes.ok) {
          publicUrl = SUPABASE_URL + '/storage/v1/object/public/public-images/' + fileName;
        }
      }

      if (!publicUrl) return res.status(400).json({ error: 'No image URL available' });

      const createRes = await fetch(GRAPH + '/' + ig_user_id + '/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: publicUrl, caption: caption, access_token: ig_token })
      });
      const createData = await createRes.json();
      if (!createData.id) return res.status(400).json({ error: 'Failed to create media: ' + JSON.stringify(createData).substring(0, 300) });

      await new Promise(resolve => setTimeout(resolve, 3000));

      const pubRes = await fetch(GRAPH + '/' + ig_user_id + '/media_publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: createData.id, access_token: ig_token })
      });
      const pubData = await pubRes.json();
      if (pubData.id) return res.status(200).json({ success: true, post_id: pubData.id });
      return res.status(400).json({ error: 'Failed to publish: ' + JSON.stringify(pubData).substring(0, 300) });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}