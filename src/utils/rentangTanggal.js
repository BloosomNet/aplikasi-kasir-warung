// Membaca dan memeriksa rentang tanggal dari permintaan.
// Dipakai halaman riwayat dan laporan, supaya aturannya sama di semua tempat.
// Kalau tanggal tidak diisi, dipakai 7 hari terakhir sampai hari ini.
// Mengembalikan { dari, sampai } atau { galat } kalau tanggal tidak sah.
function bacaRentangTanggal(query) {
  const hariIni = new Date();
  const tujuhHariLalu = new Date(hariIni);
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);

  // Ubah tanggal menjadi teks YYYY-MM-DD memakai waktu setempat.
  const keTeks = (tanggal) => tanggal.toISOString().slice(0, 10);

  const dari = query.dari || keTeks(tujuhHariLalu);
  const sampai = query.sampai || keTeks(hariIni);

  const polaTanggal = /^\d{4}-\d{2}-\d{2}$/;
  if (!polaTanggal.test(dari) || !polaTanggal.test(sampai)) {
    return { galat: 'Tanggal harus memakai format YYYY-MM-DD' };
  }
  if (dari > sampai) {
    return { galat: 'Tanggal awal tidak boleh sesudah tanggal akhir' };
  }
  return { dari, sampai };
}

module.exports = { bacaRentangTanggal };
