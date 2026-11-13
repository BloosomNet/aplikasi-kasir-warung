// Pengatur produk: menerima permintaan dari rute, lalu memanggil model.
// Tahap 2 akan mengisi pengatur ini dengan tambah, ubah, dan hapus produk.
const Produk = require('../models/Produk');

async function daftarProduk(req, res) {
  try {
    const produk = await Produk.semuaProduk();
    res.json(produk);
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal mengambil daftar produk' });
  }
}

module.exports = { daftarProduk };
