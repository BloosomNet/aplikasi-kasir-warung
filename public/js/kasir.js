// Halaman kasir: memilih produk ke keranjang, menghitung total dan kembalian,
// lalu mengirim transaksi ke server untuk disimpan.
const daftarPilihProduk = document.getElementById('daftar-pilih-produk');
const produkKosong = document.getElementById('produk-kosong');
const pesanProduk = document.getElementById('pesan-produk');
const tabelKeranjang = document.getElementById('keranjang');
const teksKeranjangKosong = document.getElementById('keranjang-kosong');
const teksTotal = document.getElementById('total');
const inputBayar = document.getElementById('bayar');
const teksKembalian = document.getElementById('kembalian');
const pesanBayar = document.getElementById('pesan-bayar');
const pesanBerhasil = document.getElementById('pesan-berhasil');

// Daftar semua produk dari server, dipakai untuk menampilkan pilihan.
let semuaProduk = [];
// Keranjang: kunci id produk, isi jumlah yang dibeli.
let keranjang = {};

function tampilkanPesan(el, teks) {
  el.textContent = teks;
  el.hidden = !teks;
}

function formatRupiah(angka) {
  return 'Rp' + Number(angka).toLocaleString('id-ID');
}

function hitungTotal() {
  let total = 0;
  for (const id of Object.keys(keranjang)) {
    const produk = semuaProduk.find((item) => item.id === Number(id));
    if (produk) total += produk.harga * keranjang[id];
  }
  return total;
}

function perbaruiKembalian() {
  const total = hitungTotal();
  const bayar = Number(inputBayar.value) || 0;
  teksKembalian.textContent = formatRupiah(Math.max(bayar - total, 0));
}

function gambarKeranjang() {
  const total = hitungTotal();
  teksTotal.textContent = formatRupiah(total);
  tabelKeranjang.innerHTML = '';
  const isiKeranjang = Object.keys(keranjang);
  teksKeranjangKosong.hidden = isiKeranjang.length > 0;

  isiKeranjang.forEach((id) => {
    const produk = semuaProduk.find((item) => item.id === Number(id));
    if (!produk) return;
    const jumlah = keranjang[id];

    const baris = document.createElement('tr');

    const selNama = document.createElement('td');
    selNama.textContent = produk.nama;
    baris.appendChild(selNama);

    const selHarga = document.createElement('td');
    selHarga.textContent = formatRupiah(produk.harga);
    baris.appendChild(selHarga);

    const selJumlah = document.createElement('td');
    const tombolKurang = document.createElement('button');
    tombolKurang.type = 'button';
    tombolKurang.textContent = '−';
    tombolKurang.className = 'tombol-kecil';
    tombolKurang.addEventListener('click', () => ubahJumlah(produk, -1));
    const teksJumlah = document.createElement('span');
    teksJumlah.textContent = ` ${jumlah} `;
    const tombolTambah = document.createElement('button');
    tombolTambah.type = 'button';
    tombolTambah.textContent = '+';
    tombolTambah.className = 'tombol-kecil';
    tombolTambah.addEventListener('click', () => ubahJumlah(produk, 1));
    selJumlah.append(tombolKurang, teksJumlah, tombolTambah);
    baris.appendChild(selJumlah);

    const selSubtotal = document.createElement('td');
    selSubtotal.textContent = formatRupiah(produk.harga * jumlah);
    baris.appendChild(selSubtotal);

    const selHapus = document.createElement('td');
    const tombolHapus = document.createElement('button');
    tombolHapus.type = 'button';
    tombolHapus.textContent = 'Hapus';
    tombolHapus.className = 'tombol-kecil tombol-hapus';
    tombolHapus.addEventListener('click', () => {
      delete keranjang[produk.id];
      gambarKeranjang();
      perbaruiKembalian();
    });
    selHapus.appendChild(tombolHapus);
    baris.appendChild(selHapus);

    tabelKeranjang.appendChild(baris);
  });
  perbaruiKembalian();
}

// Menambah atau mengurangi jumlah satu produk di keranjang.
// Jumlah tidak boleh melebihi stok, dan kalau jadi nol produk dikeluarkan.
function ubahJumlah(produk, perubahan) {
  const jumlahBaru = (keranjang[produk.id] || 0) + perubahan;
  if (jumlahBaru <= 0) {
    delete keranjang[produk.id];
  } else if (jumlahBaru > produk.stok) {
    tampilkanPesan(pesanBayar, `Stok ${produk.nama} hanya ${produk.stok}.`);
    return;
  } else {
    keranjang[produk.id] = jumlahBaru;
  }
  tampilkanPesan(pesanBayar, '');
  gambarKeranjang();
}

async function muatProduk() {
  try {
    const tanggapan = await fetch('/api/produk');
    if (!tanggapan.ok) throw new Error('gagal memuat');
    semuaProduk = await tanggapan.json();
    tampilkanPesan(pesanProduk, '');
    daftarPilihProduk.innerHTML = '';
    produkKosong.hidden = semuaProduk.length > 0;

    semuaProduk.forEach((produk) => {
      const baris = document.createElement('div');
      baris.className = 'baris-produk';
      const info = document.createElement('span');
      info.textContent = `${produk.nama} — ${formatRupiah(produk.harga)} (stok ${produk.stok})`;
      const tombol = document.createElement('button');
      tombol.type = 'button';
      tombol.textContent = 'Tambah';
      tombol.className = 'tombol-kecil';
      tombol.disabled = produk.stok === 0;
      tombol.addEventListener('click', () => ubahJumlah(produk, 1));
      baris.append(info, tombol);
      daftarPilihProduk.appendChild(baris);
    });
  } catch (kesalahan) {
    tampilkanPesan(pesanProduk, 'Daftar produk tidak bisa dimuat. Periksa server dan basis data.');
  }
}

inputBayar.addEventListener('input', perbaruiKembalian);

document.getElementById('tombol-kosongkan').addEventListener('click', () => {
  keranjang = {};
  inputBayar.value = '';
  tampilkanPesan(pesanBayar, '');
  tampilkanPesan(pesanBerhasil, '');
  gambarKeranjang();
});

document.getElementById('tombol-bayar').addEventListener('click', async () => {
  tampilkanPesan(pesanBerhasil, '');
  const total = hitungTotal();
  if (total === 0) {
    tampilkanPesan(pesanBayar, 'Keranjang masih kosong.');
    return;
  }
  const bayar = Number(inputBayar.value);
  if (!bayar || bayar < total) {
    tampilkanPesan(pesanBayar, `Uang bayar kurang, totalnya ${formatRupiah(total)}.`);
    return;
  }

  const barang = Object.keys(keranjang).map((id) => ({
    produk_id: Number(id),
    jumlah: keranjang[id],
  }));

  try {
    const tanggapan = await fetch('/api/transaksi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barang, bayar }),
    });
    const hasil = await tanggapan.json();
    if (!tanggapan.ok) {
      tampilkanPesan(pesanBayar, hasil.pesan || 'Transaksi gagal disimpan.');
      return;
    }
    tampilkanPesan(pesanBayar, '');
    tampilkanPesan(
      pesanBerhasil,
      `Transaksi #${hasil.id} berhasil. Total ${formatRupiah(hasil.total)}, kembalian ${formatRupiah(hasil.kembalian)}.`
    );
    keranjang = {};
    inputBayar.value = '';
    gambarKeranjang();
    await muatProduk();
  } catch (kesalahan) {
    tampilkanPesan(pesanBayar, 'Transaksi gagal disimpan. Periksa server dan basis data.');
  }
});

fetch('/api/sehat')
  .then((tanggapan) => tanggapan.json())
  .then((data) => {
    document.getElementById('status').textContent = data.pesan;
  })
  .catch(() => {
    document.getElementById('status').textContent = 'Server tidak bisa dihubungi.';
  });

muatProduk();
gambarKeranjang();
