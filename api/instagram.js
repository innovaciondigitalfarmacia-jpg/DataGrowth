// Instagram integration - OAuth + Publishing
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const APP_ID = process.env.FACEBOOK_APP_ID;
  const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wmonacfzxjpndbhwsdsf.supabase.co';
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const BASE_URL = 'https://datagrowthagency.com';
  const GRAPH = 'https://graph.facebook.com/v21.0';

  if (!APP_ID || !APP_SECRET) return res.status(500).json({ error: 'Facebook App not configured' });

  // ── GET: OAuth flow ──
  if (req.method === 'GET') {
    const { action, code, brand_id } = req.query;

    // Step 1: Redirect to Facebook Login
    if (action === 'connect') {
      const redirect = BASE_URL + '/api/instagram?action=callback';
      const scope = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement';
      const state = brand_id || '';
      const url = 'https://www.facebook.com/v21.0/dialog/oauth?client_id=' + APP_ID + '&redirect_uri=' + encodeURIComponent(redirect) + '&scope=' + scope + '&response_type=code&state=' + encodeURIComponent(state);
      return res.redirect(302, url);
    }

    // Step 2: OAuth callback
    if (action === 'callback') {
      if (!code) return res.status(400).send('No code received');
      const redirect = BASE_URL + '/api/instagram?action=callback';
      const brandId = req.query.state || brand_id || '';

      try {
        // Exchange code for short-lived token
        const tokenRes = await fetch(GRAPH + '/oauth/access_token?client_id=' + APP_ID + '&redirect_uri=' + encodeURIComponent(redirect) + '&client_secret=' + APP_SECRET + '&code=' + code);
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) return res.status(400).send('Token error: ' + JSON.stringify(tokenData));

        // Exchange for long-lived token (60 days)
        const longRes = await fetch(GRAPH + '/oauth/access_token?grant_type=fb_exchange_token&client_id=' + APP_ID + '&client_secret=' + APP_SECRET + '&fb_exchange_token=' + tokenData.access_token);
        const longData = await longRes.json();
        const longToken = longData.access_token || tokenData.access_token;

        // Get Facebook Pages
        const pagesRes = await fetch(GRAPH + '/me/accounts?access_token=' + longToken);
        const pagesData = await pagesRes.json();
        const page = pagesData.data?.[0];
        if (!page) return res.status(400).send('<html><body style="font-family:sans-serif;padding:40px;text-align:center"><h2>No se encontro una pagina de Facebook</h2><p>Tu cuenta debe tener una Pagina de Facebook conectada a Instagram.</p><script>setTimeout(()=>window.close(),3000)</script></body></html>');

        // Get page token (doesn't expire)
        const pageToken = page.access_token;

        // Get Instagram Business Account ID
        const igRes = await fetch(GRAPH + '/' + page.id + '?fields=instagram_business_account&access_token=' + pageToken);
        const igData = await igRes.json();
        const igId = igData.instagram_business_account?.id;
        if (!igId) return res.status(400).send('<html><body style="font-family:sans-serif;padding:40px;text-align:center"><h2>No se encontro cuenta de Instagram Business</h2><p>Conecta tu Instagram como cuenta Business/Creator a tu pagina de Facebook.</p><script>setTimeout(()=>window.close(),3000)</script></body></html>');

        // Get Instagram username
        const igInfoRes = await fetch(GRAPH + '/' + igId + '?fields=username,profile_picture_url&access_token=' + pageToken);
        const igInfo = await igInfoRes.json();

        // Save to brand in Supabase
        if (brandId && SERVICE_KEY) {
          await fetch(SUPABASE_URL + '/rest/v1/brands?id=eq.' + brandId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ ig_token: pageToken, ig_user_id: igId, instagram: '@' + (igInfo.username || '') })
          });
        }

        // Success page that closes itself
        return res.status(200).send('<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#0a0e1a;color:#fff"><h2 style="color:#37c2eb">✅ Instagram conectado</h2><p>Cuenta: @' + (igInfo.username || 'conectada') + '</p><p style="color:#888">Esta ventana se cerrara automaticamente...</p><script>setTimeout(()=>{ window.opener?.postMessage({type:"ig_connected",username:"' + (igInfo.username || '') + '"},"*"); window.close(); },2000)</script></body></html>');
      } catch (e) {
        return res.status(500).send('Error: ' + e.message);
      }
    }

    // Check connection status
    if (action === 'status') {
      const { ig_token, ig_user_id } = req.query;
      if (!ig_token || !ig_user_id) return res.status(200).json({ connected: false });
      try {
        const r = await fetch(GRAPH + '/' + ig_user_id + '?fields=username&access_token=' + ig_token);
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

      // If base64 image, upload to Supabase Storage to get public URL
      if (image_base64 && !publicUrl) {
        const imgBuf = Buffer.from(image_base64, 'base64');
        const fileName = 'ig_' + Date.now() + '.jpg';
        
        // Upload to Supabase Storage
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

      // Step 1: Create media container
      const createRes = await fetch(GRAPH + '/' + ig_user_id + '/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: publicUrl, caption: caption, access_token: ig_token })
      });
      const createData = await createRes.json();
      if (!createData.id) return res.status(400).json({ error: 'Failed to create media: ' + JSON.stringify(createData).substring(0, 300) });

      // Step 2: Wait for processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 3: Publish
      const pubRes = await fetch(GRAPH + '/' + ig_user_id + '/media_publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: createData.id, access_token: ig_token })
      });
      const pubData = await pubRes.json();
      if (pubData.id) {
        return res.status(200).json({ success: true, post_id: pubData.id });
      } else {
        return res.status(400).json({ error: 'Failed to publish: ' + JSON.stringify(pubData).substring(0, 300) });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}