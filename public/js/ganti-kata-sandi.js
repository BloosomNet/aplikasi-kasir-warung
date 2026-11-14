// Halaman ganti kata sandi: kirim kata sandi lama dan yang baru ke server.
// Kalau belum masuk, dilempar ke halaman masuk.
const formGantiSandi = document.getElementById('form-ganti-sandi');
const inputLama = document.getElementById('kata-sandi-lama');
const inputBaru = document.getElementById('kata-sandi-baru');
const inputBaruUlang = document.getElementById('kata-sandi-baru-ulang');
const pesanGantiSandi = document.getElementById('pesan-ganti-sandi');
const tombolGantiSandi = document.getElementById('tombol-ganti-sandi');

function tampilkanPesan(teks) {
  pesanGantiSandi.textContent = teks;
  pesanGantiSandi.hidden = !teks;
}

// Kalau belum masuk, nggak usah isi formulir — langsung ke halaman masuk.
fetch('/api/saya').catch(() => {
  window.location.href = '/masuk.html';
});

formGantiSandi.addEventListener('submit', async (kejadian) => {
  kejadian.preventDefault();
  if (inputBaru.value !== inputBaruUlang.value) {
    tampilkanPesan('Kata sandi baru dan ulangannya tidak sama.');
    return;
  }
  if (inputBaru.value.length < 6) {
    tampilkanPesan('Kata sandi baru minimal 6 huruf.');
    return;
  }
  tombolGantiSandi.disabled = true;
  tampilkanPesan('');
  try {
    const tanggapan = await fetch('/api/ganti-kata-sandi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kata_sandi_lama: inputLama.value,
        kata_sandi_baru: inputBaru.value,
      }),
    });
    const hasil = await tanggapan.json();
    if (!tanggapan.ok) {
      tampilkanPesan(hasil.pesan || 'Gagal mengganti kata sandi.');
      tombolGantiSandi.disabled = false;
      return;
    }
    tampilkanPesan('Kata sandi sudah diganti. Sesi yang lain masih bisa dipakai sampai habis waktunya.');
    formGantiSandi.reset();
    tombolGantiSandi.disabled = false;
  } catch (kesalahan) {
    tampilkanPesan('Gagal mengganti kata sandi. Periksa server dan basis data.');
    tombolGantiSandi.disabled = false;
  }
});

inputLama.focus();
