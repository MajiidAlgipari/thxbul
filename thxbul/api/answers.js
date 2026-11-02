const crypto = require('crypto');
const { cmd, KEY } = require('./_db');

function same(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const pass = process.env.azka;
  if (!pass) return res.status(500).json({ error: 'ADMIN_PASSWORD belum disetel' });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!same(b.password || '', pass)) return res.status(401).json({ error: 'Password salah' });
    const list = await cmd(['LRANGE', KEY, 0, -1]);
    const rows = (list || []).map((s) => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
    return res.status(200).json({ rows });
  } catch (e) {
    return res.status(500).json({ error: 'Gagal membaca data' });
  }
};
