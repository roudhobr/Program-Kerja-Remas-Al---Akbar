import { put, list, del } from '@vercel/blob';
import { isAdmin } from '../lib/auth.js';
import { blobToken } from '../lib/token.js';
const token = blobToken();

async function readDok() {
  const { blobs } = await list({ prefix: 'dok.json', token });
  const b = blobs.find(x => x.pathname === 'dok.json');
  if (!b) return {};
  const r = await fetch(b.url + '?t=' + Date.now());
  return r.ok ? await r.json() : {};
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, s-maxage=20, stale-while-revalidate=60');
      return res.status(200).json(await readDok());
    }
    if (req.method === 'POST') {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Password salah' });
      const { dok, remove, check } = req.body || {};
      if (check) return res.status(200).json({ ok: true });
      if (!dok || typeof dok !== 'object' || Array.isArray(dok)) return res.status(400).json({ error: 'Data tidak valid' });
      await put('dok.json', JSON.stringify(dok), {
        access: 'public', addRandomSuffix: false, allowOverwrite: true,
        contentType: 'application/json', cacheControlMaxAge: 60, token
      });
      const urls = (remove || []).filter(u => typeof u === 'string' && u.includes('.blob.vercel-storage.com/'));
      if (urls.length) await del(urls, { token });
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
