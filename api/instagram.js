// Instagram integration - Instagram Login (direct) + Publishing
export const config = { api: { bodyParser: { sizeLimit: '50mb' } } };

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

    if (action === 'connect') {
      const redirect = BASE_URL + '/api/instagram';
      const scope = 'instagram_business_basic,instagram_business_content_publish';
      const url = 'https://www.instagram.com/oauth/authorize?client_id=' + APP_ID + '&redirect_uri=' + encodeURIComponent(redirect) + '&scope=' + scope + '&response_type=code&state=' + encodeURIComponent(brand_id);
      return res.redirect(302, url);
    }

    if (action === 'callback' || code) {
      if (!code) return res.status(400).send('No code received');
      const redirect = BASE_URL + '/api/instagram';
      const brandId = state || brand_id || '';

      try {
        var tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'client_id=' + APP_ID + '&client_secret=' + APP_SECRET + '&grant_type=authorization_code&redirect_uri=' + encodeURIComponent(redirect) + '&code=' + code
        });
        var tokenData = await tokenRes.json();
        if (!tokenData.access_token) return res.status(400).send('<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#0a0e1a;color:#fff"><h2 style="color:#ef4444">Error de token</h2><p>' + JSON.stringify(tokenData).substring(0, 300) + '</p><script>setTimeout(function(){window.close()},5000)</script></body></html>');

        var shortToken = tokenData.access_token;
        var usrId = tokenData.user_id;

        var longRes = await fetch(GRAPH + '/access_token?grant_type=ig_exchange_token&client_secret=' + APP_SECRET + '&access_token=' + shortToken);
        var longData = await longRes.json();
        var longToken = longData.access_token || shortToken;

        var userRes = await fetch(GRAPH + '/me?fields=user_id,username,account_type,profile_picture_url&access_token=' + longToken);
        var userData = await userRes.json();
        var username = userData.username || '';

        var saveOk = false;
        if (brandId && SERVICE_KEY) {
          for (var attempt = 0; attempt < 3; attempt++) {
            try {
              var patchRes = await fetch(SUPABASE_URL + '/rest/v1/brands?id=eq.' + brandId, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY, 'Prefer': 'return=minimal' },
                body: JSON.stringify({ ig_token: longToken, ig_user_id: String(usrId), instagram: '@' + username })
              });
              if (patchRes.ok || patchRes.status === 204) { saveOk = true; break; }
              await new Promise(function(r) { setTimeout(r, 1000); });
            } catch (e2) {}
          }
        }

        var msgPayload = JSON.stringify({ type: 'ig_connected', username: username, ig_token: longToken, ig_user_id: String(usrId), saved: saveOk });
        var msgB64 = Buffer.from(msgPayload).toString('base64');
        return res.status(200).send('<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#0a0e1a;color:#fff"><h2 style="color:#37c2eb">Instagram conectado</h2><p>Cuenta: @' + username + '</p><p style="color:#888">Esta ventana se cerrara automaticamente.</p><script>try{var d=JSON.parse(atob("' + msgB64 + '"));if(window.opener){window.opener.postMessage(d,"*");}}catch(err){}setTimeout(function(){try{window.close()}catch(e){}},3000)</script></body></html>');
      } catch (e) {
        return res.status(500).send('<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#0a0e1a;color:#fff"><h2 style="color:#ef4444">Error</h2><p>' + e.message + '</p><script>setTimeout(function(){window.close()},5000)</script></body></html>');
      }
    }

    if (action === 'status') {
      var ig_t = req.query.ig_token;
      var ig_u = req.query.ig_user_id;
      if (!ig_t || !ig_u) return res.status(200).json({ connected: false });
      try {
        var sr = await fetch(GRAPH + '/me?fields=username&access_token=' + ig_t);
        var sd = await sr.json();
        return res.status(200).json({ connected: !!sd.username, username: sd.username });
      } catch (e) {
        return res.status(200).json({ connected: false });
      }
    }

    return res.status(400).json({ error: 'Unknown action' });
  }

  // ── POST: Publish to Instagram ──
  if (req.method === 'POST') {
    var ig_token = req.body.ig_token;
    var ig_user_id = req.body.ig_user_id;
    var image_base64 = req.body.image_base64;
    var image_url = req.body.image_url;
    var video_url = req.body.video_url;
    var caption = req.body.caption;
    var media_type = req.body.media_type;

    if (!ig_token || !ig_user_id) return res.status(400).json({ error: 'Instagram not connected' });
    if (!caption) return res.status(400).json({ error: 'No caption' });

    try {
      // ── VIDEO publishing (REELS or STORIES) ──
      if ((media_type === 'REELS' || media_type === 'STORIES') && video_url) {
        // Upload video to Supabase Storage so Instagram can access a permanent URL
        var finalVideoUrl = video_url;
        if (SERVICE_KEY) {
          try {
            var vidRes = await fetch(video_url);
            if (vidRes.ok) {
              var vidBuf = Buffer.from(await vidRes.arrayBuffer());
              var vidName = 'ig_vid_' + Date.now() + '.mp4';
              var upRes = await fetch(SUPABASE_URL + '/storage/v1/object/public-images/' + vidName, {
                method: 'POST',
                headers: { 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY, 'Content-Type': 'video/mp4' },
                body: vidBuf
              });
              if (upRes.ok) {
                finalVideoUrl = SUPABASE_URL + '/storage/v1/object/public/public-images/' + vidName;
              }
            }
          } catch (ve) { /* use original URL */ }
        }

        var vidMediaBody = media_type === 'STORIES'
          ? { video_url: finalVideoUrl, media_type: 'STORIES', access_token: ig_token }
          : { video_url: finalVideoUrl, caption: caption, media_type: 'REELS', access_token: ig_token };

        var vidCreateRes = await fetch(GRAPH + '/' + ig_user_id + '/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vidMediaBody)
        });
        var vidCreateData = await vidCreateRes.json();
        if (!vidCreateData.id) return res.status(400).json({ error: 'Failed to create video: ' + JSON.stringify(vidCreateData).substring(0, 300) });

        var vidReady = false;
        for (var vi = 0; vi < 30; vi++) {
          await new Promise(function(resolve) { setTimeout(resolve, 5000); });
          var vidStatusRes = await fetch(GRAPH + '/' + vidCreateData.id + '?fields=status_code&access_token=' + ig_token);
          var vidStatusData = await vidStatusRes.json();
          if (vidStatusData.status_code === 'FINISHED') { vidReady = true; break; }
          if (vidStatusData.status_code === 'ERROR') return res.status(400).json({ error: 'Video processing failed: ' + JSON.stringify(vidStatusData).substring(0, 500) });
        }
        if (!vidReady) return res.status(400).json({ error: 'Video processing timed out' });

        var vidPubRes = await fetch(GRAPH + '/' + ig_user_id + '/media_publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creation_id: vidCreateData.id, access_token: ig_token })
        });
        var vidPubData = await vidPubRes.json();
        if (vidPubData.id) return res.status(200).json({ success: true, post_id: vidPubData.id });
        return res.status(400).json({ error: 'Failed to publish: ' + JSON.stringify(vidPubData).substring(0, 300) });
      }

      // ── IMAGE publishing ──
      var publicUrl = image_url;

      if (image_base64 && !publicUrl) {
        var imgBuf = Buffer.from(image_base64, 'base64');
        // Resize to Instagram format (1080x1080)
        try {
          var sharp = require('sharp');
          imgBuf = await sharp(imgBuf)
            .resize(1080, 1080, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 90 })
            .toBuffer();
        } catch (se) { /* sharp not available, send original */ }
        var fileName = 'ig_' + Date.now() + '.jpg';
        var imgUploadRes = await fetch(SUPABASE_URL + '/storage/v1/object/public-images/' + fileName, {
          method: 'POST',
          headers: { 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY, 'Content-Type': 'image/jpeg' },
          body: imgBuf
        });
        if (imgUploadRes.ok) {
          publicUrl = SUPABASE_URL + '/storage/v1/object/public/public-images/' + fileName;
        }
      }

      if (!publicUrl) return res.status(400).json({ error: 'No image URL available' });

      var imgCreateRes = await fetch(GRAPH + '/' + ig_user_id + '/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: publicUrl, caption: caption, access_token: ig_token })
      });
      var imgCreateData = await imgCreateRes.json();
      if (!imgCreateData.id) return res.status(400).json({ error: 'Failed to create media: ' + JSON.stringify(imgCreateData).substring(0, 300) });

      await new Promise(function(resolve) { setTimeout(resolve, 3000); });

      var imgPubRes = await fetch(GRAPH + '/' + ig_user_id + '/media_publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: imgCreateData.id, access_token: ig_token })
      });
      var imgPubData = await imgPubRes.json();
      if (imgPubData.id) return res.status(200).json({ success: true, post_id: imgPubData.id });
      return res.status(400).json({ error: 'Failed to publish: ' + JSON.stringify(imgPubData).substring(0, 300) });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}