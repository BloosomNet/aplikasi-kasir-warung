# Kemajuan — Aplikasi Kasir Warung

## Tahap 1 — Selesai: Kerangka aplikasi

Yang sudah dibuat:
- Struktur folder pola MVC: `src/config`, `src/models`, `src/controllers`, `src/routes`, `public`, dan `database`
- Server Express di `server.js` yang melayani halaman utama dan rute pemeriksaan `/api/sehat`
- Koneksi MySQL di `src/config/database.js` memakai `mysql2` dan pengaturan dari `.env`
- Kerangka model, pengatur, dan rute produk (baru ada daftar produk, isi lengkapnya di Tahap 2)
- Skema awal tabel `produk` di `database/schema.sql`
- Halaman utama sederhana dengan CSS yang rapi di HP
- Berkas `.env.example` dan `.gitignore` (berkas `.env` asli tidak diunggah)

Cara kerja singkat:
- Peramban membuka halaman utama, lalu JavaScript memanggil `/api/sehat` untuk memastikan server berjalan.
- Nanti, halaman produk akan memanggil `/api/produk` untuk mengambil daftar produk dari basis data MySQL lewat model `Produk`.

Kekurangan saat ini (jujur):
- Belum ada fitur kelola produk yang bisa dipakai — tombol dan halaman produk belum dibuat.
- Belum ada fitur kasir, riwayat transaksi, laporan, login, dan belum ter-deploy.
- Rute `/api/produk` akan gagal kalau tabel `produk` belum dibuat di MySQL.

## Tahap 2 — Selesai: Kelola produk

Yang sudah dibuat:
- Model produk lengkap di `src/models/Produk.js`: lihat semua, cari satu, tambah, ubah, dan hapus
- Pengatur produk di `src/controllers/produkController.js` dengan pemeriksaan isi: nama wajib diisi, harga bilangan bulat di atas nol, stok bilangan bulat nol atau lebih
- Rute lengkap di `src/routes/produk.js`: `GET /api/produk`, `GET /api/produk/:id`, `POST /api/produk`, `PUT /api/produk/:id`, `DELETE /api/produk/:id`
- Halaman kelola produk di `public/index.html`: formulir tambah dan ubah, tabel daftar produk dengan harga format rupiah, tombol Ubah dan Hapus
- JavaScript di `public/js/app.js` memakai Fetch API untuk semua operasi produk, termasuk konfirmasi sebelum hapus
- CSS tambahan untuk formulir, tombol, dan tabel yang bisa digeser di layar HP

Cara kerja singkat:
- Formulir mengirim data produk sebagai JSON ke server. Server memeriksa isinya, lalu model menyimpan ke tabel `produk` di MySQL.
- Daftar produk diambil dari `GET /api/produk`, lalu ditampilkan sebagai baris tabel. Tombol Ubah mengisi formulir dengan data lama dan mengirim `PUT`, tombol Hapus mengirim `DELETE` setelah konfirmasi.

Yang sudah diuji (basis data MariaDB/MySQL lokal):
- Tambah Kopi Sachet Rp5.000 stok 20 dan Gula 1kg Rp17.000 stok 10 — keduanya tersimpan
- Tambah dengan harga 0 ditolak dengan pesan dan kode 400
- Ubah Kopi Sachet menjadi harga Rp6.000 stok 18 — berhasil
- Hapus Gula 1kg — berhasil, dan mengambilnya lagi menghasilkan 404
- Daftar akhir hanya berisi Kopi Sachet yang sudah diubah, lalu data uji dibersihkan

Kekurangan saat ini (jujur):
- Belum ada fitur kasir, riwayat transaksi, laporan, login, dan belum ter-deploy.
- Belum ada pencarian produk — itu bagian Tahap 5.

## Tahap 3 — Selesai: Kasir

Yang sudah dibuat:
- Tabel baru di `database/schema.sql`: `transaksi` (total, bayar, kembalian) dan `detail_transaksi` (nama dan harga disalin saat transaksi, supaya riwayat tetap benar walau produk diubah nanti)
- Model transaksi di `src/models/Transaksi.js`: menyimpan transaksi dalam satu transaksi basis data — simpan transaksi, simpan rincian, kurangi stok. Kalau ada langkah yang gagal, semua dibatalkan. Total dihitung ulang dari harga di basis data, dan baris produk dikunci selama transaksi supaya stok terakhir tidak terjual dua kali
- Pengatur dan rute di `src/controllers/transaksiController.js` dan `src/routes/transaksi.js`: `POST /api/transaksi` dengan pemeriksaan keranjang kosong, jumlah tidak sah, dan bayar tidak sah
- Halaman kasir di `public/kasir.html` dan `public/js/kasir.js`: pilih produk, keranjang dengan tombol tambah dan kurang jumlah, total otomatis, kolom bayar, kembalian otomatis, dan pesan berhasil berisi nomor transaksi, total, dan kembalian. Ada tautan bolak-balik antara halaman Kelola Produk dan Kasir

Cara kerja singkat:
- Peramban mengambil daftar produk, pengguna menambah produk ke keranjang yang disimpan di peramban. Total dihitung dari harga produk dikali jumlah.
- Saat tombol Selesaikan Transaksi ditekan, peramban mengirim isi keranjang dan uang bayar ke `POST /api/transaksi`. Server menghitung ulang total dari basis data, memeriksa stok dan uang bayar, lalu menyimpan transaksi dan mengurangi stok dalam satu transaksi basis data.

Yang sudah diuji (basis data MariaDB/MySQL lokal):
- Transaksi berhasil: 2 Kopi Sachet + 1 Gula 1kg, total Rp27.000, bayar Rp50.000, kembalian Rp23.000, transaksi #1 tersimpan dengan 2 rincian
- Stok sesudah transaksi: Kopi 20 menjadi 18, Gula 10 menjadi 9
- Transaksi 100 Kopi ditolak 400 karena stok tidak cukup, dan stok tidak berubah
- Transaksi 1 Kopi dengan bayar Rp1.000 ditolak 400 karena uang kurang
- Keranjang kosong ditolak 400
- Data uji dibersihkan, semua tabel kembali kosong

Kekurangan saat ini (jujur):
- Belum ada halaman riwayat transaksi dan laporan harian — itu Tahap 4.
- Belum ada pencarian produk — itu Tahap 5.
- Belum ada login dan belum ter-deploy.

## Tahap berikutnya

Tahap 4: Riwayat transaksi dan laporan harian — daftar transaksi, omzet harian, produk terlaris, dan filter tanggal.
