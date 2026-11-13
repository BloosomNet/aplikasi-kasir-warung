// Pengatur laporan: omzet harian dan produk terlaris dalam rentang tanggal.
const Transaksi = require('../models/Transaksi');
const { bacaRentangTanggal } = require('../utils/rentangTanggal');

// Laporan harian: tiap tanggal berisi jumlah transaksi dan omzetnya.
// Contoh: GET /api/laporan/harian?dari=2026-11-01&sampai=2026-11-13
async function laporanHarian(req, res) {
  const rentang = bacaRentangTanggal(req.query);
  if (rentang.galat) {
    return res.status(400).json({ pesan: rentang.galat });
  }
  try {
    const laporan = await Transaksi.laporanHarian(rentang.dari, rentang.sampai);
    res.json({ dari: rentang.dari, sampai: rentang.sampai, harian: laporan });
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal mengambil laporan harian' });
  }
}

// Produk terlaris: 10 produk dengan jumlah terjual terbanyak.
// Contoh: GET /api/laporan/terlaris?dari=2026-11-01&sampai=2026-11-13
async function produkTerlaris(req, res) {
  const rentang = bacaRentangTanggal(req.query);
  if (rentang.galat) {
    return res.status(400).json({ pesan: rentang.galat });
  }
  try {
    const terlaris = await Transaksi.produkTerlaris(rentang.dari, rentang.sampai);
    res.json({ dari: rentang.dari, sampai: rentang.sampai, terlaris });
  } catch (kesalahan) {
    console.error(kesalahan);
    res.status(500).json({ pesan: 'Gagal mengambil produk terlaris' });
  }
}

module.exports = { laporanHarian, produkTerlaris };
