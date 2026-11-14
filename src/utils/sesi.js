// Sesi login sederhana: token yang ditandatangani, disimpan di cookie.
// Isinya id pengguna, nama pengguna, dan waktu kadaluarsa,
// lalu ditandai HMAC supaya isinya nggak bisa diubah diam-diam.
// Sesi disimpan di cookie, bukan di basis data — cukup buat warung
// yang servernya cuma satu, dan gampang dijelaskan.
const crypto = require('crypto');

// Rahasia penanda token. Di server beneran wajib diganti lewat .env,
// kalau nggak, siapa pun yang tahu nilai bawaannya bisa memalsukan sesi.
const RAHASIA = process.env.SESSION_SECRET || 'ganti-rahasia-ini-di-production';
const LAMA_SESI_MS = 12 * 60 * 60 * 1000; // 12 jam

function buatToken(pengguna) {
  const kadaluarsa = Date.now() + LAMA_SESI_MS;
  const isi = pengguna.id + '.' + pengguna.nama_pengguna + '.' + kadaluarsa;
  const tanda = crypto.createHmac('sha256', RAHASIA).update(isi).digest('hex');
  return Buffer.from(isi, 'utf8').toString('base64url') + '.' + tanda;
}

// Memeriksa token dari cookie. Hasilnya data pengguna kalau token sah
// dan belum kadaluarsa, atau null kalau token rusak, palsu, atau sudah lewat.
function periksaToken(token) {
  if (typeof token !== 'string') return null;
  const pisah = token.split('.');
  if (pisah.length !== 2) return null;
  const [isiB64, tanda] = pisah;
  let isi;
  try {
    isi = Buffer.from(isiB64, 'base64url').toString('utf8');
  } catch (e) {
    return null;
  }
  const tandaBenar = crypto.createHmac('sha256', RAHASIA).update(isi).digest('hex');
  const a = Buffer.from(tanda, 'utf8');
  const b = Buffer.from(tandaBenar, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const [id, namaPengguna, kadaluarsa] = isi.split('.');
  if (!id || !namaPengguna || Number(kadaluarsa) < Date.now()) return null;
  return { id: Number(id), nama_pengguna: namaPengguna };
}

// Mengambil satu cookie dari header permintaan.
function ambilCookie(req, nama) {
  const mentah = req.headers.cookie || '';
  const ketemu = mentah
    .split(';')
    .map((bagian) => bagian.trim())
    .find((bagian) => bagian.startsWith(nama + '='));
  return ketemu ? decodeURIComponent(ketemu.slice(nama.length + 1)) : null;
}

module.exports = { buatToken, periksaToken, ambilCookie, LAMA_SESI_MS };
