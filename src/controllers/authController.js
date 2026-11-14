// Pengatur auth: masuk, keluar, dan cek siapa yang sedang masuk.
const Pengguna = require('../models/Pengguna');
const { cocok } = require('../utils/kataSandi');
const { buatToken, LAMA_SESI_MS } = require('../utils/sesi');

// Masuk: cek nama pengguna dan kata sandi, kalau benar kasih cookie sesi.
// Pesan gagalnya dibuat sama untuk nama salah maupun kata sandi salah,
// supaya orang luar nggak bisa menebak nama pengguna mana yang ada.
async function masuk(req, res) {
  const namaPengguna = req.body && typeof req.body.nama_pengguna === 'string' ? req.body.nama_pengguna.trim() : '';
  const kataSandi = req.body && typeof req.body.kata_sandi === 'string' ? req.body.kata_sandi : '';
  if (!namaPengguna || !kataSandi) {
    return res.status(400).json({ pesan: 'Nama pengguna dan kata sandi wajib diisi' });
  }
  try {
    const pengguna = await Pengguna.cariBerdasarkanNama(namaPengguna);
    if (!pengguna || !cocok(kataSandi, pengguna.kata_sandi)) {
      return res.status(401).json({ pesan: 'Nama pengguna atau kata sandi salah' });
    }
    const token = buatToken(pengguna);
    // httpOnly: JavaScript di peramban nggak bisa membaca cookie ini,
    // jadi lebih aman dari pencurian lewat skrip jahat.
    res.cookie('sesi', token, { httpOnly: true, sameSite: 'lax', maxAge: LAMA_SESI_MS, path: '/' });
    res.json({ pesan: 'Berhasil masuk', pengguna: { id: pengguna.id, nama_pengguna: pengguna.nama_pengguna } });
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal masuk' });
  }
}

// Keluar: hapus cookie sesi.
function keluar(req, res) {
  res.clearCookie('sesi', { path: '/' });
  res.json({ pesan: 'Berhasil keluar' });
}

// Cek sesi: dipakai halaman untuk tahu siapa yang sedang masuk.
// Rute ini sudah dijaga perluLogin, jadi req.pengguna pasti ada.
function saya(req, res) {
  res.json({ masuk: true, pengguna: req.pengguna });
}

// Ganti kata sandi: yang masuk harus tahu kata sandi lamanya dulu,
// kata sandi baru minimal 6 huruf dan harus beda dengan yang lama.
// Rute ini sudah dijaga perluLogin, jadi req.pengguna pasti ada.
async function gantiKataSandi(req, res) {
  const kataSandiLama = req.body && typeof req.body.kata_sandi_lama === 'string' ? req.body.kata_sandi_lama : '';
  const kataSandiBaru = req.body && typeof req.body.kata_sandi_baru === 'string' ? req.body.kata_sandi_baru : '';
  if (!kataSandiLama || !kataSandiBaru) {
    return res.status(400).json({ pesan: 'Kata sandi lama dan kata sandi baru wajib diisi' });
  }
  if (kataSandiBaru.length < 6) {
    return res.status(400).json({ pesan: 'Kata sandi baru minimal 6 huruf' });
  }
  if (kataSandiBaru === kataSandiLama) {
    return res.status(400).json({ pesan: 'Kata sandi baru harus beda dengan yang lama' });
  }
  try {
    const pengguna = await Pengguna.cariBerdasarkanId(req.pengguna.id);
    if (!pengguna || !cocok(kataSandiLama, pengguna.kata_sandi)) {
      return res.status(401).json({ pesan: 'Kata sandi lama salah' });
    }
    await Pengguna.ubahKataSandi(pengguna.id, kataSandiBaru);
    res.json({ pesan: 'Kata sandi sudah diganti' });
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal mengganti kata sandi' });
  }
}

module.exports = { masuk, keluar, saya, gantiKataSandi };
