// Delete user - requires SUPABASE_SERVICE_KEY
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id } = req.body || {};
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wmonacfzxjpndbhwsdsf.supabase.co';

  if (!SERVICE_KEY) return res.status(500).json({ error: 'No service key' });
  if (!user_id) return res.status(400).json({ error: 'No user_id' });

  try {
    // Delete from auth (cascades to profiles and brands)
    const r = await fetch(SUPABASE_URL + '/auth/v1/admin/users/' + user_id, {
      method: 'DELETE',
      headers: { 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY }
    });

    if (r.ok) {
      return res.status(200).json({ success: true });
    } else {
      const d = await r.json().catch(() => ({}));
      return res.status(400).json({ error: d.message || d.msg || 'Error deleting user' });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
