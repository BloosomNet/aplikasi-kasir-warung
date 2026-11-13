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
- [ ] Tahap 6: Login pemilik warung
- [ ] Tahap 7: Deploy online

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

Belum ter-deploy. Tautan demo akan ditulis di sini setelah tahap deploy selesai.

## Kemajuan

Lihat `PROGRESS.md` untuk catatan tiap tahap: apa yang sudah selesai, apa yang belum, dan apa tahap berikutnya.
