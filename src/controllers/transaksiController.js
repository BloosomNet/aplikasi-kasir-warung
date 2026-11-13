// Pengatur transaksi: menerima keranjang dari halaman kasir,
// memeriksa isinya, lalu memanggil model untuk menyimpan transaksi.
const Transaksi = require('../models/Transaksi');
const { bacaRentangTanggal } = require('../utils/rentangTanggal');

async function buatTransaksi(req, res) {
  const barang = req.body.barang;
  const bayar = req.body.bayar;

  if (!Array.isArray(barang) || barang.length === 0) {
    return res.status(400).json({ pesan: 'Keranjang masih kosong' });
  }
  for (const item of barang) {
    if (!Number.isInteger(item.produk_id) || !Number.isInteger(item.jumlah) || item.jumlah <= 0) {
      return res.status(400).json({ pesan: 'Isi keranjang tidak sah' });
    }
  }
  if (!Number.isInteger(bayar) || bayar <= 0) {
    return res.status(400).json({ pesan: 'Jumlah bayar harus bilangan bulat di atas nol' });
  }

  try {
    const transaksi = await Transaksi.buatTransaksi(barang, bayar);
    res.status(201).json(transaksi);
  } catch (kesalahan) {
    console.error(kesalahan);
    // Kesalahan dari model (stok tidak cukup, uang kurang, produk tidak ada)
    // adalah kesalahan isi, bukan kesalahan server.
    if (
      kesalahan.message.includes('tidak ditemukan') ||
      kesalahan.message.includes('tidak cukup') ||
      kesalahan.message.includes('kurang')
    ) {
      return res.status(400).json({ pesan: kesalahan.message });
    }
    res.status(500).json({ pesan: 'Gagal menyimpan transaksi' });
  }
}

module.exports = { buatTransaksi, lihatRiwayat, lihatSatu };

// Melihat daftar transaksi dalam rentang tanggal.
// Contoh: GET /api/transaksi?dari=2026-11-01&sampai=2026-11-13
async function lihatRiwayat(req, res) {
  const rentang = bacaRentangTanggal(req.query);
  if (rentang.galat) {
    return res.status(400).json({ pesan: rentang.galat });
  }
  try {
    const daftar = await Transaksi.lihatRiwayat(rentang.dari, rentang.sampai);
    res.json({ dari: rentang.dari, sampai: rentang.sampai, transaksi: daftar });
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal mengambil riwayat transaksi' });
  }
}

// Melihat satu transaksi beserta rincian barangnya.
async function lihatSatu(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ pesan: 'Nomor transaksi tidak sah' });
  }
  try {
    const transaksi = await Transaksi.lihatSatu(id);
    if (!transaksi) {
      return res.status(404).json({ pesan: 'Transaksi tidak ditemukan' });
    }
    res.json(transaksi);
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal mengambil rincian transaksi' });
  }
}
