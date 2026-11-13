// Rute produk: alamat-alamat yang berhubungan dengan data produk.
// Tahap 2 menambahkan rute tambah, ubah, dan hapus di berkas ini.
const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');

router.get('/', produkController.daftarProduk);

module.exports = router;
