// Model Produk: semua perintah ke tabel produk dikumpulkan di sini.
const pool = require('../config/database');

// Mengambil semua produk, diurutkan berdasarkan nama.
// Kalau diberi kata kunci, hanya produk yang nama atau kategorinya cocok yang dikembalikan.
// Tanda % dan _ di kata kunci diamankan supaya dianggap huruf biasa, bukan pola LIKE.
async function semuaProduk(kataKunci) {
  const kata = typeof kataKunci === 'string' ? kataKunci.trim() : '';
  if (!kata) {
    const [baris] = await pool.query('SELECT * FROM produk ORDER BY nama ASC');
    return baris;
  }
  const pola = '%' + kata.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_') + '%';
  // Tanda \ di pola sudah diamankan di atas; LIKE MySQL memakai \ sebagai
  // karakter pelindung bawaan, jadi tidak perlu klausa ESCAPE.
  const [baris] = await pool.query(
    'SELECT * FROM produk WHERE nama LIKE ? OR kategori LIKE ? ORDER BY nama ASC',
    [pola, pola]
  );
  return baris;
}

// Mengambil satu produk berdasarkan id. Hasilnya null kalau tidak ditemukan.
async function cariBerdasarkanId(id) {
  const [baris] = await pool.query('SELECT * FROM produk WHERE id = ?', [id]);
  return baris[0] || null;
}

// Menambah produk baru, lalu mengembalikan data produk yang baru dibuat.
async function tambahProduk(data) {
  const [hasil] = await pool.query(
    'INSERT INTO produk (nama, harga, stok, kategori) VALUES (?, ?, ?, ?)',
    [data.nama, data.harga, data.stok, data.kategori || null]
  );
  return cariBerdasarkanId(hasil.insertId);
}

// Mengubah produk yang sudah ada. Mengembalikan data terbaru, atau null kalau tidak ditemukan.
async function ubahProduk(id, data) {
  const [hasil] = await pool.query(
    'UPDATE produk SET nama = ?, harga = ?, stok = ?, kategori = ? WHERE id = ?',
    [data.nama, data.harga, data.stok, data.kategori || null, id]
  );
  if (hasil.affectedRows === 0) return null;
  return cariBerdasarkanId(id);
}

// Menghapus produk. Mengembalikan true kalau ada baris yang terhapus.
async function hapusProduk(id) {
  const [hasil] = await pool.query('DELETE FROM produk WHERE id = ?', [id]);
  return hasil.affectedRows > 0;
}

module.exports = { semuaProduk, cariBerdasarkanId, tambahProduk, ubahProduk, hapusProduk };
