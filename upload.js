import { put } from '@vercel/blob';
import { isAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!isAdmin(req)) return res.status(401).json({ error: 'Password salah' });
    const chunks = [];
    let size = 0;
    for await (const c of req) {
      size += c.length;
      if (size > 4 * 1024 * 1024) return res.status(413).json({ error: 'Foto terlalu besar (maks 4 MB)' });
      chunks.push(c);
    }
    const slug = String(req.query.slug || 'umum').replace(/[^a-z0-9-]/gi, '').slice(0, 60) || 'umum';
    const blob = await put(`dokumentasi/${slug}/${Date.now()}.jpg`, Buffer.concat(chunks), {
      access: 'public', contentType: 'image/jpeg', addRandomSuffix: true
    });
    res.status(200).json({ url: blob.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
