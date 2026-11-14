// Halaman masuk: kirim nama pengguna dan kata sandi ke server,
// kalau cocok langsung pindah ke halaman kelola produk.
const formMasuk = document.getElementById('form-masuk');
const inputNamaPengguna = document.getElementById('nama-pengguna');
const inputKataSandi = document.getElementById('kata-sandi');
const pesanMasuk = document.getElementById('pesan-masuk');
const tombolMasuk = document.getElementById('tombol-masuk');

function tampilkanPesan(teks) {
  pesanMasuk.textContent = teks;
  pesanMasuk.hidden = !teks;
}

// Kalau sudah masuk, nggak usah isi formulir lagi — langsung ke halaman utama.
fetch('/api/saya')
  .then((tanggapan) => {
    if (tanggapan.ok) window.location.href = '/';
  })
  .catch(() => {
    // Server tidak bisa dihubungi, biarin formulir tetap tampil.
  });

formMasuk.addEventListener('submit', async (kejadian) => {
  kejadian.preventDefault();
  tombolMasuk.disabled = true;
  tampilkanPesan('');
  try {
    const tanggapan = await fetch('/api/masuk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_pengguna: inputNamaPengguna.value.trim(),
        kata_sandi: inputKataSandi.value,
      }),
    });
    const hasil = await tanggapan.json();
    if (!tanggapan.ok) {
      // Pesan gagalnya sengaja dibuat sama untuk nama salah maupun kata sandi salah.
      tampilkanPesan(hasil.pesan || 'Gagal masuk.');
      tombolMasuk.disabled = false;
      return;
    }
    // Berhasil masuk, cookie sesi sudah dipasang server — pindah ke halaman utama.
    window.location.href = '/';
  } catch (kesalahan) {
    tampilkanPesan('Gagal masuk. Periksa server dan basis data.');
    tombolMasuk.disabled = false;
  }
});

inputNamaPengguna.focus();
