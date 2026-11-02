const { cmd, KEY } = require('./_db');
const MOODS = ['senang', 'lumayan', 'capek', 'cemas', 'badmood'];
const str = (v, n) => String(v == null ? '' : v).slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!MOODS.includes(b.moodKey)) return res.status(400).json({ error: 'Mood tidak valid' });
    const rec = {
      moodKey: b.moodKey,
      moodEmoji: str(b.moodEmoji, 8),
      moodLabel: str(b.moodLabel, 40),
      reasons: Array.isArray(b.reasons) ? b.reasons.slice(0, 10).map((x) => str(x, 100)) : [],
      extra: str(b.extra, 1500),
      ts: Date.now(),
    };
    await cmd(['LPUSH', KEY, JSON.stringify(rec)]);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Gagal menyimpan' });
  }
};
