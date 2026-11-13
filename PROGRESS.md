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

## Tahap berikutnya

Tahap 2: Kelola produk — tambah, ubah, hapus produk, harga, kategori, dan stok, lengkap dengan tampilannya.
