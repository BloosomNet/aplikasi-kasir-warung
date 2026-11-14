// Penjaga rute: hanya yang sudah masuk yang boleh lewat.
// Token dibaca dari cookie "sesi", diperiksa, lalu datanya
// ditempel di req.pengguna supaya pengatur bisa memakainya.
// Kalau belum masuk, dijawab 401.
const { ambilCookie, periksaToken } = require('../utils/sesi');

function perluLogin(req, res, next) {
  const sesi = periksaToken(ambilCookie(req, 'sesi'));
  if (!sesi) return res.status(401).json({ pesan: 'Harus masuk dulu' });
  req.pengguna = sesi;
  next();
}

module.exports = perluLogin;
