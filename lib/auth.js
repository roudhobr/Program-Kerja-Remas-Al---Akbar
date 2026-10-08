import { timingSafeEqual } from 'node:crypto';

// Cek header x-admin-password terhadap env ADMIN_PASSWORD
export function isAdmin(req) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const a = Buffer.from(String(req.headers['x-admin-password'] || ''));
  const b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}
