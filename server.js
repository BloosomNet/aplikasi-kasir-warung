// Titik masuk aplikasi: menjalankan server Express dan melayani halaman utama.
// Tahap 1: kerangka saja. Fitur produk, kasir, dan laporan dibuat di tahap berikutnya.
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Membaca data JSON dari permintaan (dipakai saat simpan produk dan transaksi nanti)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Melayani file statis dari folder public (HTML, CSS, dan JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Rute pemeriksaan: memastikan server dan basis data masih bisa dihubungi
app.get('/api/sehat', async (req, res) => {
  res.json({ status: 'ok', pesan: 'Server kasir warung berjalan' });
});

// Rute produk, kasir, dan laporan akan dipasang di tahap berikutnya
app.use('/api/produk', require('./src/routes/produk'));

app.listen(PORT, () => {
  console.log(`Server kasir warung berjalan di http://localhost:${PORT}`);
});
