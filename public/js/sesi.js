// Dipakai di semua halaman: cek siapa yang sedang masuk,
// lalu tampilkan namanya dan tombol keluar di navigasi.
// Kalau belum masuk, tampilkan tautan ke halaman Masuk.
const infoMasuk = document.getElementById('info-masuk');

if (infoMasuk) {
  fetch('/api/saya')
    .then((tanggapan) => {
      if (!tanggapan.ok) throw new Error('belum masuk');
      return tanggapan.json();
    })
    .then((data) => {
      // Sudah masuk: tampilkan nama pengguna dan tombol keluar.
      const teksNama = document.createElement('span');
      teksNama.textContent = `Masuk sebagai ${data.pengguna.nama_pengguna}`;
      const tombolKeluar = document.createElement('button');
      tombolKeluar.type = 'button';
      tombolKeluar.textContent = 'Keluar';
      tombolKeluar.className = 'tombol-kecil tombol-keluar';
      tombolKeluar.addEventListener('click', async () => {
        try {
          await fetch('/api/keluar', { method: 'POST' });
        } catch (kesalahan) {
          // Cookie gagal dihapus di server, tetap muat ulang halamannya.
        }
        window.location.reload();
      });
      infoMasuk.append(teksNama, tombolKeluar);
    })
    .catch(() => {
      // Belum masuk: tampilkan tautan ke halaman Masuk.
      const tautanMasuk = document.createElement('a');
      tautanMasuk.href = '/masuk.html';
      tautanMasuk.textContent = 'Masuk';
      infoMasuk.appendChild(tautanMasuk);
    });
}
