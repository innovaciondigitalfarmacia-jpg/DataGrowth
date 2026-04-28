// Admin endpoint to change client password
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wmonacfzxjpndbhwsdsf.supabase.co';

  if (!SERVICE_KEY) return res.status(500).json({ error: 'Service key not configured' });

  try {
    const { user_id, new_password, admin_id } = req.body;
    if (!user_id || !new_password) return res.status(400).json({ error: 'Missing user_id or new_password' });
    if (new_password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    // Verify admin role
    const profileRes = await fetch(SUPABASE_URL + '/rest/v1/profiles?id=eq.' + admin_id + '&select=role', {
      headers: { 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY }
    });
    const profiles = await profileRes.json();
    if (!profiles?.[0] || profiles[0].role !== 'agency') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update user password
    const r = await fetch(SUPABASE_URL + '/auth/v1/admin/users/' + user_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY
      },
      body: JSON.stringify({ password: new_password })
    });

    if (r.ok) {
      return res.status(200).json({ success: true });
    } else {
      const err = await r.text();
      return res.status(400).json({ error: 'Failed: ' + err.substring(0, 200) });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
