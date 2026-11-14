// Rute auth: alamat-alamat yang berhubungan dengan masuk dan keluar.
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const perluLogin = require('../middleware/perluLogin');

router.post('/masuk', authController.masuk);
router.post('/keluar', authController.keluar);
router.get('/saya', perluLogin, authController.saya);

module.exports = router;
