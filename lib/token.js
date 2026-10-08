// Cari token Blob: BLOB_READ_WRITE_TOKEN, atau nama lain berakhiran _READ_WRITE_TOKEN
// (Vercel memakai awalan custom jika saat connect store Anda mengubah "Environment Variable Prefix").
export function blobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const k = Object.keys(process.env).find(x => x.endsWith('_READ_WRITE_TOKEN') && process.env[x]);
  return k ? process.env[k] : undefined;
}
