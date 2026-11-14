# Aplikasi Kasir Warung

Aplikasi kasir sederhana untuk pemilik warung dan UMKM kecil. Membantu mencatat penjualan, mengelola produk dan stok, serta melihat laporan harian — tanpa harus mencatat di buku lagi.

## Siapa penggunanya

Pemilik warung atau toko kecil yang ingin mencatat penjualan harian dengan rapi, tahu stok barang yang menipis, dan tahu produk apa yang paling laris.

## Fitur

- [x] Tahap 1: Kerangka aplikasi, server, dan koneksi basis data
- [x] Tahap 2: Kelola produk (tambah, ubah, hapus, stok, harga)
- [x] Tahap 3: Kasir — keranjang belanja, total, kembalian, dan stok berkurang otomatis
- [x] Tahap 4: Riwayat transaksi dan laporan harian
- [ ] Tahap 5: Tampilan rapi di HP dan pencarian produk
  - [x] Tahap 5a: Pencarian produk di halaman Kelola Produk dan Kasir
  - [x] Tahap 5b: Tampilan rapi di HP
- [ ] Tahap 6: Login pemilik warung
  - [x] Tahap 6a: Login di server — tabel pengguna, kata sandi di-hash, sesi pakai cookie, rute tulis dikunci
  - [x] Tahap 6b: Halaman masuk, nama pengguna + tombol keluar di navigasi
  - [x] Tahap 6c: Ganti kata sandi pemilik dari aplikasi
- [x] Tahap 7: Deploy online
- [x] Tahap 8: Tampilan lebih nyaman dipakai — navigasi lengket, kartu lembut, total dan omzet langsung kelihatan, stok menipis berwarna

## Teknologi yang dipakai

- Node.js dan Express.js — server dan REST API
- MySQL — basis data produk dan transaksi
- HTML5, CSS3, dan JavaScript — tampilan dan interaksi di peramban
- Fetch API — mengambil data dari server

## Cara menjalankan

1. Salin berkas `.env.example` menjadi `.env`, lalu isi pengaturannya:

   ```bash
   cp .env.example .env
   ```

2. Buat basis data dari berkas `database/schema.sql` di MySQL.
3. Pasang paket yang dibutuhkan:

   ```bash
   npm install
   ```

4. Jalankan server:

   ```bash
   npm start
   ```

5. Buka di peramban: http://localhost:3000

## Demo

Tersedia online: https://aplikasi-kasir-warung-production.up.railway.app

Di-deploy ke Railway (Node.js + MySQL). Basis data kosong waktu pertama kali dibuka, jadi daftar produk masih kosong — tambah produk dulu lewat halaman kelola produk.

## Kemajuan

Lihat `PROGRESS.md` untuk catatan tiap tahap: apa yang sudah selesai, apa yang belum, dan apa tahap berikutnya.
