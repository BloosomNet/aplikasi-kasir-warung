// Rute produk: alamat-alamat yang berhubungan dengan data produk.
const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');
const perluLogin = require('../middleware/perluLogin');

// Lihat produk boleh siapa saja, tapi tambah, ubah, dan hapus
// hanya pemilik warung yang sudah masuk.
router.get('/', produkController.daftarProduk);
router.get('/:id', produkController.detailProduk);
router.post('/', perluLogin, produkController.tambahProduk);
router.put('/:id', perluLogin, produkController.ubahProduk);
router.delete('/:id', perluLogin, produkController.hapusProduk);

module.exports = router;
