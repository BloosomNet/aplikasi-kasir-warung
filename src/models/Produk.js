// Model Produk: semua perintah ke tabel produk dikumpulkan di sini.
// Tahap 2 akan mengisi fungsi-fungsi ini: lihat semua, tambah, ubah, dan hapus produk.
const pool = require('../config/database');

async function semuaProduk() {
  const [baris] = await pool.query('SELECT * FROM produk ORDER BY nama ASC');
  return baris;
}

module.exports = { semuaProduk };
