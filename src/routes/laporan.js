// Rute laporan: alamat yang berhubungan dengan laporan penjualan.
const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');

router.get('/harian', laporanController.laporanHarian);
router.get('/terlaris', laporanController.produkTerlaris);

module.exports = router;
