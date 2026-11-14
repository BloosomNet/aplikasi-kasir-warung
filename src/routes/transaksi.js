// Rute transaksi: alamat yang berhubungan dengan pembayaran di kasir.
const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const perluLogin = require('../middleware/perluLogin');

// Bikin transaksi hanya pemilik warung yang sudah masuk.
// Lihat riwayat tetap terbuka, karena yang ditampilkan cuma angka penjualan.
router.post('/', perluLogin, transaksiController.buatTransaksi);
router.get('/', transaksiController.lihatRiwayat);
router.get('/:id', transaksiController.lihatSatu);

module.exports = router;
