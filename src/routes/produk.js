// Rute produk: alamat-alamat yang berhubungan dengan data produk.
const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');

router.get('/', produkController.daftarProduk);
router.get('/:id', produkController.detailProduk);
router.post('/', produkController.tambahProduk);
router.put('/:id', produkController.ubahProduk);
router.delete('/:id', produkController.hapusProduk);

module.exports = router;
