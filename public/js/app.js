// Memeriksa apakah server berjalan, lalu menampilkan hasilnya di halaman utama.
fetch('/api/sehat')
  .then((tanggapan) => tanggapan.json())
  .then((data) => {
    document.getElementById('status').textContent = data.pesan;
  })
  .catch(() => {
    document.getElementById('status').textContent = 'Server tidak bisa dihubungi.';
  });
