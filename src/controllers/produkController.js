// Pengatur produk: menerima permintaan dari rute, lalu memanggil model.
const Produk = require('../models/Produk');

// Memeriksa isi produk dari formulir. Harga harus bilangan bulat di atas nol,
// stok harus bilangan bulat nol atau lebih, dan nama tidak boleh kosong.
function periksaIsiProduk(data) {
  if (!data || typeof data.nama !== 'string' || data.nama.trim() === '') {
    return 'Nama produk wajib diisi';
  }
  if (!Number.isInteger(data.harga) || data.harga <= 0) {
    return 'Harga harus bilangan bulat di atas nol';
  }
  if (!Number.isInteger(data.stok) || data.stok < 0) {
    return 'Stok harus bilangan bulat nol atau lebih';
  }
  return null;
}

// Merapikan isi produk sebelum disimpan: nama dipangkas, kategori kosong jadi null.
function rapikanIsiProduk(data) {
  return {
    nama: data.nama.trim(),
    harga: data.harga,
    stok: data.stok,
    kategori: typeof data.kategori === 'string' && data.kategori.trim() !== '' ? data.kategori.trim() : null,
  };
}

async function daftarProduk(req, res) {
  try {
    const produk = await Produk.semuaProduk();
    res.json(produk);
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal mengambil daftar produk' });
  }
}

async function detailProduk(req, res) {
  try {
    const produk = await Produk.cariBerdasarkanId(req.params.id);
    if (!produk) return res.status(404).json({ pesan: 'Produk tidak ditemukan' });
    res.json(produk);
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal mengambil produk' });
  }
}

async function tambahProduk(req, res) {
  const kesalahanIsi = periksaIsiProduk(req.body);
  if (kesalahanIsi) return res.status(400).json({ pesan: kesalahanIsi });
  try {
    const produk = await Produk.tambahProduk(rapikanIsiProduk(req.body));
    res.status(201).json(produk);
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal menambah produk' });
  }
}

async function ubahProduk(req, res) {
  const kesalahanIsi = periksaIsiProduk(req.body);
  if (kesalahanIsi) return res.status(400).json({ pesan: kesalahanIsi });
  try {
    const produk = await Produk.ubahProduk(req.params.id, rapikanIsiProduk(req.body));
    if (!produk) return res.status(404).json({ pesan: 'Produk tidak ditemukan' });
    res.json(produk);
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal mengubah produk' });
  }
}

async function hapusProduk(req, res) {
  try {
    const terhapus = await Produk.hapusProduk(req.params.id);
    if (!terhapus) return res.status(404).json({ pesan: 'Produk tidak ditemukan' });
    res.json({ pesan: 'Produk berhasil dihapus' });
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal menghapus produk' });
  }
}

module.exports = { daftarProduk, detailProduk, tambahProduk, ubahProduk, hapusProduk };
