// Model Pengguna: semua perintah ke tabel pengguna dikumpulkan di sini.
// Kata sandi tidak pernah disimpan apa adanya — yang disimpan hash-nya.
const pool = require('../config/database');
const { buatHash } = require('../utils/kataSandi');

// Mengambil satu pengguna berdasarkan nama pengguna. Hasilnya null kalau tidak ada.
async function cariBerdasarkanNama(namaPengguna) {
  const [baris] = await pool.query('SELECT * FROM pengguna WHERE nama_pengguna = ?', [namaPengguna]);
  return baris[0] || null;
}

// Mengambil satu pengguna berdasarkan id. Hasilnya null kalau tidak ditemukan.
async function cariBerdasarkanId(id) {
  const [baris] = await pool.query('SELECT * FROM pengguna WHERE id = ?', [id]);
  return baris[0] || null;
}

// Menghitung jumlah pengguna yang sudah ada, dipakai untuk tahu
// apakah akun pemilik pertama sudah dibuat atau belum.
async function jumlahPengguna() {
  const [baris] = await pool.query('SELECT COUNT(*) AS jumlah FROM pengguna');
  return baris[0].jumlah;
}

// Menambah pengguna baru, kata sandinya langsung di-hash sebelum disimpan.
async function buat(namaPengguna, kataSandi) {
  const hash = buatHash(kataSandi);
  const [hasil] = await pool.query(
    'INSERT INTO pengguna (nama_pengguna, kata_sandi) VALUES (?, ?)',
    [namaPengguna, hash]
  );
  return cariBerdasarkanId(hasil.insertId);
}

// Mengganti kata sandi pengguna, di-hash dulu sebelum disimpan.
async function ubahKataSandi(id, kataSandiBaru) {
  const hash = buatHash(kataSandiBaru);
  await pool.query('UPDATE pengguna SET kata_sandi = ? WHERE id = ?', [hash, id]);
}

module.exports = { cariBerdasarkanNama, cariBerdasarkanId, jumlahPengguna, buat, ubahKataSandi };
