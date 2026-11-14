// Kata sandi disimpan sebagai hash, bukan teks aslinya.
// Pakai scrypt yang sudah ada di Node, jadi nggak perlu paket tambahan.
// Hasilnya "garam:hash", garamnya acak tiap kata sandi.
const crypto = require('crypto');

function buatHash(kataSandi) {
  const garam = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(kataSandi, garam, 64).toString('hex');
  return garam + ':' + hash;
}

// Mengecek kata sandi yang diketik dengan hash yang tersimpan.
// Pakai timingSafeEqual supaya waktu pengecekannya selalu sama,
// jadi nggak bisa ditebak dari cepat-lambatnya jawaban server.
function cocok(kataSandi, tersimpan) {
  if (typeof kataSandi !== 'string' || typeof tersimpan !== 'string') return false;
  const pisah = tersimpan.split(':');
  if (pisah.length !== 2) return false;
  const [garam, hash] = pisah;
  const coba = crypto.scryptSync(kataSandi, garam, 64);
  const benar = Buffer.from(hash, 'hex');
  if (coba.length !== benar.length) return false;
  return crypto.timingSafeEqual(coba, benar);
}

module.exports = { buatHash, cocok };
