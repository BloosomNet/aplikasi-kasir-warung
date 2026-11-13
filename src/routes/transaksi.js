// Rute transaksi: alamat yang berhubungan dengan pembayaran di kasir.
const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

router.post('/', transaksiController.buatTransaksi);
router.get('/', transaksiController.lihatRiwayat);
router.get('/:id', transaksiController.lihatSatu);

module.exports = router;
