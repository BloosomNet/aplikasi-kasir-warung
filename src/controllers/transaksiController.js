// Pengatur transaksi: menerima keranjang dari halaman kasir,
// memeriksa isinya, lalu memanggil model untuk menyimpan transaksi.
const Transaksi = require('../models/Transaksi');

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

module.exports = { buatTransaksi };
