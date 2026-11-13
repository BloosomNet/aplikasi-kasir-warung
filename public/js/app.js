// Halaman kelola produk: mengambil daftar dari server, lalu menampilkan,
// menambah, mengubah, dan menghapus produk lewat Fetch API.
const formProduk = document.getElementById('form-produk');
const inputNama = document.getElementById('nama');
const inputHarga = document.getElementById('harga');
const inputStok = document.getElementById('stok');
const inputKategori = document.getElementById('kategori');
const judulForm = document.getElementById('judul-form');
const tombolSimpan = document.getElementById('tombol-simpan');
const tombolBatal = document.getElementById('tombol-batal');
const pesanForm = document.getElementById('pesan-form');
const pesanDaftar = document.getElementById('pesan-daftar');
const daftarProduk = document.getElementById('daftar-produk');
const teksKosong = document.getElementById('kosong');

// Id produk yang sedang diubah. Null berarti formulir sedang menambah produk baru.
let idYangDiubah = null;

function tampilkanPesan(el, teks) {
  el.textContent = teks;
  el.hidden = !teks;
}

// Mengubah angka menjadi format rupiah, contoh: 5000 menjadi Rp5.000
function formatRupiah(angka) {
  return 'Rp' + Number(angka).toLocaleString('id-ID');
}

async function muatProduk() {
  try {
    const tanggapan = await fetch('/api/produk');
    if (!tanggapan.ok) throw new Error('gagal memuat');
    const produk = await tanggapan.json();
    tampilkanPesan(pesanDaftar, '');
    daftarProduk.innerHTML = '';
    teksKosong.hidden = produk.length > 0;

    produk.forEach((item) => {
      const baris = document.createElement('tr');

      const selNama = document.createElement('td');
      selNama.textContent = item.nama;
      baris.appendChild(selNama);

      const selHarga = document.createElement('td');
      selHarga.textContent = formatRupiah(item.harga);
      baris.appendChild(selHarga);

      const selStok = document.createElement('td');
      selStok.textContent = item.stok;
      baris.appendChild(selStok);

      const selKategori = document.createElement('td');
      selKategori.textContent = item.kategori || '-';
      baris.appendChild(selKategori);

      const selAksi = document.createElement('td');
      const tombolUbah = document.createElement('button');
      tombolUbah.type = 'button';
      tombolUbah.textContent = 'Ubah';
      tombolUbah.className = 'tombol-kecil';
      tombolUbah.addEventListener('click', () => isiFormUntukUbah(item));
      const tombolHapus = document.createElement('button');
      tombolHapus.type = 'button';
      tombolHapus.textContent = 'Hapus';
      tombolHapus.className = 'tombol-kecil tombol-hapus';
      tombolHapus.addEventListener('click', () => hapusProduk(item));
      selAksi.append(tombolUbah, tombolHapus);
      baris.appendChild(selAksi);

      daftarProduk.appendChild(baris);
    });
  } catch (kesalahan) {
    tampilkanPesan(pesanDaftar, 'Daftar produk tidak bisa dimuat. Periksa server dan basis data.');
  }
}

function isiFormUntukUbah(item) {
  idYangDiubah = item.id;
  inputNama.value = item.nama;
  inputHarga.value = item.harga;
  inputStok.value = item.stok;
  inputKategori.value = item.kategori || '';
  judulForm.textContent = 'Ubah Produk';
  tombolSimpan.textContent = 'Simpan Perubahan';
  tombolBatal.hidden = false;
  tampilkanPesan(pesanForm, '');
  inputNama.focus();
}

function kosongkanForm() {
  idYangDiubah = null;
  formProduk.reset();
  judulForm.textContent = 'Tambah Produk';
  tombolSimpan.textContent = 'Simpan Produk';
  tombolBatal.hidden = true;
}

formProduk.addEventListener('submit', async (kejadian) => {
  kejadian.preventDefault();
  const isi = {
    nama: inputNama.value.trim(),
    harga: Number(inputHarga.value),
    stok: Number(inputStok.value),
    kategori: inputKategori.value.trim(),
  };

  const alamat = idYangDiubah ? `/api/produk/${idYangDiubah}` : '/api/produk';
  const cara = idYangDiubah ? 'PUT' : 'POST';

  try {
    const tanggapan = await fetch(alamat, {
      method: cara,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isi),
    });
    const hasil = await tanggapan.json();
    if (!tanggapan.ok) {
      tampilkanPesan(pesanForm, hasil.pesan || 'Produk gagal disimpan.');
      return;
    }
    tampilkanPesan(pesanForm, '');
    kosongkanForm();
    await muatProduk();
  } catch (kesalahan) {
    tampilkanPesan(pesanForm, 'Produk gagal disimpan. Periksa server dan basis data.');
  }
});

tombolBatal.addEventListener('click', () => {
  kosongkanForm();
  tampilkanPesan(pesanForm, '');
});

async function hapusProduk(item) {
  if (!confirm(`Hapus produk "${item.nama}"?`)) return;
  try {
    const tanggapan = await fetch(`/api/produk/${item.id}`, { method: 'DELETE' });
    const hasil = await tanggapan.json();
    if (!tanggapan.ok) {
      tampilkanPesan(pesanDaftar, hasil.pesan || 'Produk gagal dihapus.');
      return;
    }
    await muatProduk();
  } catch (kesalahan) {
    tampilkanPesan(pesanDaftar, 'Produk gagal dihapus. Periksa server dan basis data.');
  }
}

// Memeriksa server, lalu memuat daftar produk saat halaman dibuka.
fetch('/api/sehat')
  .then((tanggapan) => tanggapan.json())
  .then((data) => {
    document.getElementById('status').textContent = data.pesan;
  })
  .catch(() => {
    document.getElementById('status').textContent = 'Server tidak bisa dihubungi.';
  });

muatProduk();
