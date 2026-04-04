export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, password } = req.body;
  if (!userId || !password) return res.status(400).json({ error: 'Faltan datos' });
  if (password.length < 8) return res.status(400).json({ error: 'Mínimo 8 caracteres' });

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SERVICE_KEY) return res.status(500).json({ error: 'Sin clave de servicio' });

  try {
    const r = await fetch(`https://wmonacfzxjpndbhwsdsf.supabase.co/auth/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      },
      body: JSON.stringify({ password })
    });
    const data = await r.json();
    if (data.id) return res.status(200).json({ success: true });
    return res.status(400).json({ error: data.message || 'No se pudo cambiar' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
