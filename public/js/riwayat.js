// Halaman riwayat dan laporan: filter tanggal, ringkasan,
// laporan harian, produk terlaris, dan daftar transaksi.
const statusEl = document.getElementById('status');
const dariEl = document.getElementById('dari');
const sampaiEl = document.getElementById('sampai');
const pesanFilterEl = document.getElementById('pesan-filter');
const jumlahTransaksiEl = document.getElementById('jumlah-transaksi');
const totalOmzetEl = document.getElementById('total-omzet');
const laporanHarianEl = document.getElementById('laporan-harian');
const harianKosongEl = document.getElementById('harian-kosong');
const produkTerlarisEl = document.getElementById('produk-terlaris');
const terlarisKosongEl = document.getElementById('terlaris-kosong');
const daftarTransaksiEl = document.getElementById('daftar-transaksi');
const riwayatKosongEl = document.getElementById('riwayat-kosong');
const pesanRiwayatEl = document.getElementById('pesan-riwayat');
const rincianEl = document.getElementById('rincian');
const judulRincianEl = document.getElementById('judul-rincian');
const daftarRincianEl = document.getElementById('daftar-rincian');
const rincianBayarEl = document.getElementById('rincian-bayar');
const rincianKembalianEl = document.getElementById('rincian-kembalian');

// Mengubah angka menjadi format rupiah, contoh: 27000 menjadi Rp27.000
function keRupiah(angka) {
  return `Rp${Number(angka).toLocaleString('id-ID')}`;
}

// Mengubah tanggal menjadi teks YYYY-MM-DD memakai waktu setempat.
function keTeksTanggal(tanggal) {
  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, '0');
  const hari = String(tanggal.getDate()).padStart(2, '0');
  return `${tahun}-${bulan}-${hari}`;
}

// Mengubah waktu dari server menjadi teks yang mudah dibaca.
function keTeksWaktu(teksWaktu) {
  return new Date(teksWaktu).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Menampilkan pesan galat pada bagian filter.
function tampilkanPesanFilter(pesan) {
  pesanFilterEl.textContent = pesan;
  pesanFilterEl.hidden = !pesan;
}

// Mengambil data dari server dan mengembalikan isi JSON-nya.
// Kalau server menjawab galat, pesannya dilempar sebagai Error.
async function ambilJson(alamat) {
  const jawaban = await fetch(alamat);
  const data = await jawaban.json();
  if (!jawaban.ok) {
    throw new Error(data.pesan || 'Gagal mengambil data dari server');
  }
  return data;
}

// Memuat laporan harian, produk terlaris, dan daftar transaksi sekaligus.
async function muatLaporan() {
  const dari = dariEl.value;
  const sampai = sampaiEl.value;
  if (!dari || !sampai) {
    tampilkanPesanFilter('Pilih tanggal awal dan tanggal akhir dulu');
    return;
  }
  if (dari > sampai) {
    tampilkanPesanFilter('Tanggal awal tidak boleh sesudah tanggal akhir');
    return;
  }
  tampilkanPesanFilter('');
  rincianEl.hidden = true;

  try {
    const [harian, terlaris, riwayat] = await Promise.all([
      ambilJson(`/api/laporan/harian?dari=${dari}&sampai=${sampai}`),
      ambilJson(`/api/laporan/terlaris?dari=${dari}&sampai=${sampai}`),
      ambilJson(`/api/transaksi?dari=${dari}&sampai=${sampai}`),
    ]);
    tampilkanRingkasan(harian.harian);
    tampilkanLaporanHarian(harian.harian);
    tampilkanProdukTerlaris(terlaris.terlaris);
    tampilkanDaftarTransaksi(riwayat.transaksi);
    statusEl.textContent = `Menampilkan ${dari} sampai ${sampai}.`;
  } catch (kesalahan) {
    pesanRiwayatEl.textContent = kesalahan.message;
    pesanRiwayatEl.hidden = false;
  }
}

// Ringkasan dihitung dari laporan harian, supaya angkanya
// selalu sama dengan tabel di bawahnya.
function tampilkanRingkasan(harian) {
  const jumlah = harian.reduce((total, baris) => total + Number(baris.jumlah_transaksi), 0);
  const omzet = harian.reduce((total, baris) => total + Number(baris.omzet), 0);
  jumlahTransaksiEl.textContent = `${jumlah} transaksi`;
  totalOmzetEl.textContent = keRupiah(omzet);
}

function tampilkanLaporanHarian(harian) {
  laporanHarianEl.innerHTML = '';
  harianKosongEl.hidden = harian.length > 0;
  for (const baris of harian) {
    const tr = document.createElement('tr');
    const tanggal = new Date(baris.tanggal).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    tr.innerHTML = `<td>${tanggal}</td><td>${baris.jumlah_transaksi}</td><td>${keRupiah(baris.omzet)}</td>`;
    laporanHarianEl.appendChild(tr);
  }
}

function tampilkanProdukTerlaris(terlaris) {
  produkTerlarisEl.innerHTML = '';
  terlarisKosongEl.hidden = terlaris.length > 0;
  for (const baris of terlaris) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${baris.nama_produk}</td><td>${baris.terjual}</td><td>${keRupiah(baris.pendapatan)}</td>`;
    produkTerlarisEl.appendChild(tr);
  }
}

function tampilkanDaftarTransaksi(daftar) {
  daftarTransaksiEl.innerHTML = '';
  riwayatKosongEl.hidden = daftar.length > 0;
  pesanRiwayatEl.hidden = true;
  for (const transaksi of daftar) {
    const tr = document.createElement('tr');
    tr.className = 'baris-bisa-diklik';
    tr.innerHTML = `<td>#${transaksi.id}</td><td>${keTeksWaktu(transaksi.dibuat_pada)}</td><td>${transaksi.jumlah_item} barang</td><td>${keRupiah(transaksi.total)}</td>`;
    // Ketuk baris untuk melihat rincian barang transaksi itu.
    tr.addEventListener('click', () => muatRincian(transaksi.id));
    daftarTransaksiEl.appendChild(tr);
  }
}

// Mengambil rincian satu transaksi dan menampilkannya di bawah daftar.
async function muatRincian(id) {
  try {
    const transaksi = await ambilJson(`/api/transaksi/${id}`);
    judulRincianEl.textContent = `Rincian transaksi #${transaksi.id} — ${keTeksWaktu(transaksi.dibuat_pada)}`;
    daftarRincianEl.innerHTML = '';
    for (const barang of transaksi.barang) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${barang.nama_produk}</td><td>${keRupiah(barang.harga)}</td><td>${barang.jumlah}</td><td>${keRupiah(barang.subtotal)}</td>`;
      daftarRincianEl.appendChild(tr);
    }
    rincianBayarEl.textContent = keRupiah(transaksi.bayar);
    rincianKembalianEl.textContent = keRupiah(transaksi.kembalian);
    rincianEl.hidden = false;
    rincianEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (kesalahan) {
    pesanRiwayatEl.textContent = kesalahan.message;
    pesanRiwayatEl.hidden = false;
  }
}

async function mulai() {
  try {
    const jawaban = await fetch('/api/sehat');
    if (!jawaban.ok) {
      throw new Error('Server tidak menjawab');
    }
    statusEl.textContent = 'Server terhubung.';
  } catch (kesalahan) {
    statusEl.textContent = 'Server tidak bisa dihubungi. Pastikan server sudah dijalankan.';
    return;
  }

  // Isi awal filter: 7 hari terakhir sampai hari ini.
  const hariIni = new Date();
  const tujuhHariLalu = new Date(hariIni);
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);
  dariEl.value = keTeksTanggal(tujuhHariLalu);
  sampaiEl.value = keTeksTanggal(hariIni);

  document.getElementById('form-filter').addEventListener('submit', (acara) => {
    acara.preventDefault();
    muatLaporan();
  });

  muatLaporan();
}

mulai();
