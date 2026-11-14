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

## Tahap 4 — Selesai: Riwayat transaksi dan laporan harian

Yang sudah dibuat:
- Fungsi baru di `src/models/Transaksi.js`: `lihatRiwayat` (daftar transaksi dalam rentang tanggal, lengkap dengan jumlah barang per transaksi), `lihatSatu` (satu transaksi beserta rincian barangnya), `laporanHarian` (jumlah transaksi dan omzet per tanggal), dan `produkTerlaris` (10 produk paling banyak terjual)
- Pembantu `src/utils/rentangTanggal.js`: membaca dan memeriksa rentang tanggal dari permintaan — format harus YYYY-MM-DD, tanggal awal tidak boleh sesudah tanggal akhir, dan kalau tidak diisi dipakai 7 hari terakhir sampai hari ini
- Pengatur laporan di `src/controllers/laporanController.js` dan rute `src/routes/laporan.js`: `GET /api/laporan/harian` dan `GET /api/laporan/terlaris`
- Rute baru di `src/routes/transaksi.js`: `GET /api/transaksi` (daftar dengan filter `dari` dan `sampai`) dan `GET /api/transaksi/:id` (rincian, 404 kalau nomor tidak ada)
- Halaman riwayat di `public/riwayat.html` dan `public/js/riwayat.js`: filter tanggal, ringkasan jumlah transaksi dan total omzet, tabel laporan harian, tabel produk terlaris, daftar transaksi yang bisa diketuk untuk melihat rincian barang, bayar, dan kembalian
- Tautan "Riwayat & Laporan" di navigasi halaman Kelola Produk dan Kasir, plus CSS untuk baris filter, ringkasan, dan baris yang bisa diklik

Cara kerja singkat:
- Peramban meminta laporan harian, produk terlaris, dan daftar transaksi sekaligus dengan Fetch API, memakai rentang tanggal yang sama. Ringkasan dihitung dari laporan harian, supaya angkanya selalu sama dengan tabel.
- Server menyaring transaksi berdasarkan tanggal dibuatnya (`DATE(dibuat_pada)`), lalu mengelompokkan per tanggal untuk omzet harian dan per nama produk untuk produk terlaris. Nama produk diambil dari `detail_transaksi`, jadi laporan tetap benar walau nama produk diubah nanti.

Yang sudah diuji (basis data MariaDB/MySQL lokal):
- Data uji: Kopi Sachet Rp5.000 dan Gula 1kg Rp17.000, lalu 2 transaksi hari ini (2 Kopi + 1 Gula total Rp27.000 bayar Rp50.000, dan 3 Kopi total Rp15.000 bayar Rp20.000)
- `GET /api/transaksi?dari=2026-11-13&sampai=2026-11-13` mengembalikan 2 transaksi, yang terbaru dulu, lengkap dengan jumlah barang
- `GET /api/transaksi/1` mengembalikan rincian benar: 2 Kopi dan 1 Gula, bayar Rp50.000, kembalian Rp23.000
- `GET /api/laporan/harian` mengembalikan 13 Nov: 2 transaksi, omzet Rp42.000; tanpa parameter, rentang baku 7 hari terakhir dipakai
- `GET /api/laporan/terlaris` mengembalikan Kopi 5 terjual Rp25.000 di urutan pertama, lalu Gula 1 terjual Rp17.000
- Tanggal berformat salah ditolak 400, tanggal awal sesudah tanggal akhir ditolak 400, transaksi nomor 999 menghasilkan 404
- Halaman `riwayat.html` dan `riwayat.js` dimuat dengan HTTP 200, tidak ada error di log server
- Data uji dibersihkan, semua tabel kembali kosong

Kekurangan saat ini (jujur):
- Daftar transaksi dibatasi 100 baris terbaru, belum ada halaman berikutnya (pagination) — itu bisa jadi konsep baru di project berikutnya.
- Laporan hanya berupa tabel, belum ada grafik batang atau garis.
- Belum ada tombol unduh laporan (misalnya ke CSV) dan belum ada pencarian produk — itu bagian Tahap 5.
- Belum ada login dan belum ter-deploy.

## Rencana gabung dengan project lain

Project ini dirancang supaya nanti bisa digabung dengan project selingan menjadi satu sistem manajemen UMKM:
- Inti bersama yang sama di semua project: stack sama (Node + Express + MySQL), struktur MVC sama (`src/config`, `src/models`, `src/controllers`, `src/routes`, `public`, `database`), penamaan tabel dan kolom sama, format `.env` sama.
- Tabel yang dipakai bersama: `produk` (id, nama, harga, stok, kategori), `transaksi` dan `detail_transaksi`, serta nanti tabel `pengguna` untuk login.
- Pembagian peran: kasir mengurangi stok saat transaksi, inventaris menambah dan mengelola stok, katalog menampilkan produk yang sama ke pelanggan. Ketiganya memakai tabel `produk` yang sama, supaya nanti tinggal digabung jadi satu sistem: satu login, satu basis data, satu dashboard dengan modul kasir + inventaris + katalog.
- Project yang berjalan paralel: inventaris-barang-warung (stok, barang masuk/keluar, stok menipis, supplier) dan katalog-produk-warung (katalog + pemesanan via WhatsApp).
- Arah jangka panjang: kesulitan naik bertahap — setelah gabung jadi sistem UMKM, tambah modul yang lebih dalam (keuangan warung, laporan dan grafik, export data, pencarian/filter/pagination, multi-pengguna dan peran), menuju aplikasi nyata yang dipakai orang sungguhan. Tiap project tetap maksimal satu konsep baru dan tetap bisa dijelaskan ulang saat interview.

## Tahap 5a — Selesai: Pencarian produk

Yang sudah dibuat:
- Model `src/models/Produk.js`: `semuaProduk` sekarang menerima kata kunci — kalau ada, produk disaring dengan `LIKE` pada nama atau kategori. Tanda `%`, `_`, dan `\` di kata kunci diamankan supaya dianggap huruf biasa, bukan pola.
- Pengatur `src/controllers/produkController.js`: `daftarProduk` membaca kata kunci dari `?cari=`, dipangkas dan dibatasi 100 huruf, lalu diteruskan ke model. Tanpa `?cari=` daftar lama tetap dikembalikan semua.
- Halaman Kelola Produk (`public/index.html` dan `public/js/app.js`): kolom pencarian di atas daftar produk. Permintaan baru dikirim 300 ms setelah pengguna berhenti mengetik (debounce), supaya server tidak dibanjiri tiap ketikan. Kalau tidak ada yang cocok, tampil pesan "Tidak ada produk yang cocok dengan ...".
- Halaman Kasir (`public/kasir.html` dan `public/js/kasir.js`): kolom pencarian yang sama di atas daftar pilih produk, dengan debounce yang sama.
- Gaya baru di `public/css/style.css`: kelas `.pencarian` untuk kolom pencarian, tampilannya sama seperti kolom formulir lain.

Cara kerja singkat:
- Peramban mengirim kata kunci ke `GET /api/produk?cari=...`. Server menyaring di basis data dengan `LIKE`, lalu peramban menampilkan hasilnya. Penyaringan di server (bukan di peramban) supaya daftar tetap benar walau produknya banyak nanti.

Yang sudah diuji (basis data MariaDB 10.11 lokal, server Express di port 3000):
- Data uji: Kopi Sachet Rp5.000 (Minuman), Gula 1kg Rp17.000 (Bahan Dapur), Teh Melati Rp4.000 (Minuman)
- `?cari=kopi` mengembalikan 1 hasil: Kopi Sachet; `?cari=KOPI` juga 1 hasil (pencarian tidak peduli huruf besar-kecil)
- `?cari=minuman` mengembalikan 2 hasil: Kopi Sachet dan Teh Melati (cocok lewat kategori)
- `?cari=tidakada` mengembalikan daftar kosong; `?cari=%` dan `?cari=_` juga 0 hasil (tanda pola tidak lagi dianggap pola)
- Tanpa `?cari=` tetap mengembalikan semua 3 produk
- Halaman `/`, `/kasir.html`, `/js/app.js`, dan `/js/kasir.js` dimuat HTTP 200, kolom pencarian ada di kedua halaman, tidak ada error di log server
- Catatan: uji pertama menemukan bug — klausa `ESCAPE "\\"` di SQL membuat MariaDB menolak permintaan (500). Diperbaiki dengan menghapus klausa itu dan mengandalkan karakter pelindung bawaan LIKE; sesudah perbaikan semua uji di atas lolos.
- Data uji dibersihkan, semua tabel kembali kosong

Kekurangan saat ini (jujur):
- Pencarian hanya mencocokkan nama dan kategori, belum harga atau stok.
- Belum ada tampilan rapi di HP — itu Tahap 5b, potongan berikutnya.

## Tahap 5b — Selesai: Tampilan rapi di HP

Yang sudah dibuat (hanya di `public/css/style.css`, tidak ada perubahan HTML atau JavaScript):
- Tombol utama dibuat setinggi minimal 44px dan huruf kolom isian dibuat 16px, supaya gampang ditekan di HP dan peramban HP tidak memperbesar layar saat kolom disentuh.
- Navigasi antar halaman bisa membungkus ke baris baru, dan tiap tautannya dibuat setinggi 44px supaya gampang diketuk.
- Aturan layar kecil (`@media max-width: 600px`, ukuran HP pada umumnya): ruang tepi lebih hemat, judul lebih kecil, kartu lebih ringkas, tombol utama jadi selebar layar dan bertumpuk, kolom isian lebih tinggi, tombol kecil di tabel dan keranjang naik jadi 44px, baris pilih produk di kasir jadi nama di atas dan tombol Tambah selebar layar, dua kolom tanggal di riwayat bertumpuk ke bawah, tabel hurufnya lebih kecil dan kolom nama boleh membungkus.
- Aturan layar sangat kecil (`@media max-width: 400px`): tabel lebih ringkas lagi.
- Di laptop tidak ada yang berubah — semua aturan baru hanya berlaku di layar kecil.

Cara kerja singkat:
- Peramban HP membaca lebar layarnya sendiri, lalu memakai aturan `@media` yang cocok. Tidak ada JavaScript baru: yang berubah hanya tampilan, bukan data atau alur kerja.

Yang sudah diuji (server Express di port 3000, basis data MariaDB lokal):
- Semua halaman dimuat HTTP 200: `/`, `/kasir.html`, `/riwayat.html`, `/css/style.css`, `/js/app.js`, `/js/kasir.js`, `/js/riwayat.js`, `/api/sehat`.
- CSS yang disajikan server sudah berisi kedua aturan `@media` (600px dan 400px) dan aturan tinggi ketuk 44px — diperiksa langsung dari hasil `curl`.
- Uji regresi: tambah produk Kopi Sachet Rp5.000 berhasil, lalu `?cari=kopi` tetap mengembalikan 1 hasil — pencarian Tahap 5a tidak rusak.
- Tidak ada error di log server; data uji dibersihkan (daftar produk kembali kosong), server dimatikan sesudah uji.

Kekurangan saat ini (jujur):
- Belum diuji di HP fisik, tapi tangkapan layar lebar 390px halaman kasir udah diambil 2026-11-14 (Chrome headless udah diinstal di VM) dan tampilannya rapi, tombol Tambah selebar layar.
- Belum ada login dan belum ter-deploy.

## Siap deploy: tabel kebikin sendiri pas server nyala

Rid minta deploy dimajuin biar bisa dibuka dari browser. Supaya pas deploy ke Railway nggak perlu jalanin schema.sql manual, server sekarang bikin tabel sendiri waktu nyala: `src/config/siapkanTabel.js` jalanin tiga `CREATE TABLE IF NOT EXISTS` (produk, transaksi, detail_transaksi) — isinya sama persis kayak `database/schema.sql`. Kalau basis data belum siap (MySQL Railway masih nyala), dicoba lagi tiap 5 detik, maksimal 12 kali, terus server tetap jalan. Dipanggil di `server.js` sebelum `listen`.

Yang sudah diuji (server Express di port 3000, basis data MariaDB lokal):
- Server di-restart dengan kode baru, log nampilin "Tabel sudah siap.", `/api/sehat` ok, `/api/produk` tetap ngembaliin 4 produk contoh.
- Nggak ada error di log server.

## Tahap 7: Deploy ke Railway (dikerjain duluan, 2026-11-14)

Deploy dimajuin atas permintaan Rid biar aplikasinya bisa dibuka dari browser, padahal Tahap 6 (login) belum dikerjain.

- Akun Railway dibuat otomatis lewat "Continue with GitHub" (BloosomNet, faridilham220@gmail.com). Trial: 30 hari atau kredit $5, nggak diisi info pembayaran apa pun. Project Railway namanya "secure-miracle", region US West, Node 24.22.2.
- Project dari repo GitHub ini; aplikasi GitHub Railway diizinkan hanya untuk repo kasir ini.
- Database MySQL ditambah sebagai service di project yang sama, variabel basis data di service aplikasi diisi referensi ke service MySQL (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME). Domain publik dibuat di Settings → Networking.
- Demo: https://aplikasi-kasir-warung-production.up.railway.app — halaman utama, `/api/sehat`, dan `/api/produk` udah dicek langsung: semua jalan, daftar produk masih kosong karena basis data baru.
- Tabel dibuat otomatis pas server nyala (lihat bagian "Siap deploy" di atas), jadi nggak perlu jalanin schema.sql manual di Railway.

Yang belum: Tahap 6 login pemilik warung tetap jadi tahap berikutnya; habis itu tinggal deploy ulang, Railway otomatis deploy tiap push ke main.

## Tahap 6a — Selesai: Login di server (backend)

Tahap 6 dipecah, yang ini baru bagian servernya. Halaman loginnya nyusul di potongan berikut.

Yang sudah dibuat:
- Tabel baru `pengguna` di `database/schema.sql` dan di `src/config/siapkanTabel.js` — kolomnya id, nama_pengguna (unik), kata_sandi, dibuat_pada. Namanya sama kayak rencana di PROGRESS, biar nanti gampang digabung sama inventaris dan katalog.
- `src/utils/kataSandi.js`: kata sandi di-hash pakai scrypt bawaan Node (garam acak tiap kata sandi, hasilnya "garam:hash"). Nggak ada paket baru yang dipasang. Pengecekannya pakai timingSafeEqual supaya waktunya selalu sama.
- `src/models/Pengguna.js`: cari pengguna dari nama atau id, hitung jumlah pengguna, dan bikin pengguna baru (kata sandinya langsung di-hash sebelum disimpan).
- `src/utils/sesi.js`: sesi login berupa token yang ditandatangani HMAC, disimpan di cookie httpOnly (JavaScript di peramban nggak bisa baca). Isinya id, nama pengguna, dan waktu kadaluarsa 12 jam. Sesi nggak disimpan di basis data — buat warung yang servernya cuma satu, ini paling gampang dijelasin.
- `src/controllers/authController.js` dan `src/routes/auth.js`: `POST /api/masuk`, `POST /api/keluar`, `GET /api/saya`. Pesan gagal masuk sengaja dibuat sama untuk nama salah maupun kata sandi salah, biar orang luar nggak bisa nebak nama pengguna mana yang ada.
- `src/middleware/perluLogin.js`: penjaga rute, baca cookie "sesi", periksa tokennya, kalau sah datanya ditempel di req.pengguna. Kalau belum masuk, dijawab 401.
- Akun pemilik pertama dibuat otomatis pas server pertama kali nyala (di `siapkanPemilik()` dalam siapkanTabel.js), kalau tabel pengguna masih kosong. Nama dan kata sandinya dari .env (`OWNER_USER` dan `OWNER_PASS`), kalau nggak diisi pakai bawaan "pemilik" / "warung123". Kuncinya juga ditambah di `.env.example`, sama rahasia sesi (`SESSION_SECRET`).
- Rute tulis sekarang dikunci: tambah/ubah/hapus produk dan bikin transaksi cuma bisa kalau sudah masuk. Lihat produk, riwayat, dan laporan tetap terbuka.

Cara kerja singkat:
- Pemilik kirim nama pengguna dan kata sandi ke `POST /api/masuk`. Server cari penggunanya, cek hash kata sandinya, kalau cocok server kasih cookie "sesi" berisi token bertanda tangan.
- Tiap permintaan ke rute tulis, `perluLogin` baca cookie itu, periksa tanda tangannya dan masa berlakunya. Tokennya sah baru permintaan diteruskan; kalau nggak, ditolak 401.
- `POST /api/keluar` menghapus cookie sesi di peramban.

Yang sudah diuji (basis data MariaDB lokal, server Express di port 3000):
- Server nyala, log "Tabel sudah siap." dan "Akun pemilik 'pemilik' sudah dibuat...". Tabel `pengguna` ada, isinya 1 akun, kata sandinya tersimpan sebagai hash (bukan "warung123" apa adanya).
- `POST /api/masuk` kata sandi salah dijawab 401; yang benar dijawab 200 dan ngasih cookie sesi.
- `GET /api/saya` tanpa cookie 401, pakai cookie 200 dan ngembaliin id + nama pengguna.
- `POST /api/produk` tanpa cookie 401, pakai cookie 201 — Kopi Sachet Rp5.000 stok 20 kebikin.
- `POST /api/transaksi` tanpa cookie 401; pakai cookie 201 — 2 Kopi total Rp10.000, bayar Rp20.000, kembalian Rp10.000, stok 20 jadi 18. (Uji pertama sempat 400 "Keranjang masih kosong" karena body yang dikirim pakai nama kolom "keranjang", padahal controllernya minta "barang" — salah di perintah ujinya, bukan di kode. Sesudah dibenerin, lolos.)
- Token yang dipalsukan ditolak 401. `PUT` dan `DELETE /api/produk/1` tanpa cookie dua-duanya 401. `POST /api/keluar` 200 dan cookie kehapus.
- Regresi: halaman `/`, `/kasir.html`, `/riwayat.html`, `/css/style.css`, `/api/produk`, `/api/laporan/harian`, dan `/api/transaksi` semuanya 200. Tidak ada error di log server.
- Catatan dari uji: MariaDB lokal sempat mati dan user basis data `kasir` di .env belum ada di server lokal (baru ada user root) — dibikin dulu user + databasenya, baru server bisa nyambung. Bukan masalah kode, cuma setup lokal yang ke-reset.
- Data uji dibersihkan, tabel produk dan transaksi kembali kosong, server dimatikan sesudah uji.

Kekurangan saat ini (jujur):
- Belum ada halaman loginnya — jadi dari peramban, tambah produk dan transaksi belum bisa dipakai sampai Tahap 6b. Buat sekarang masuk cuma bisa lewat curl.
- Keluar cuma menghapus cookie di peramban; tokennya sendiri masih sah sampai kadaluarsa 12 jam kalau ada yang sempat menyalinnya. Buat warung kecil masih oke, tapi kalau mau logout beneran dari sisi server, sesi harus disimpan di basis data — itu bisa jadi perbaikan nanti.
- `SESSION_SECRET` masih pakai nilai bawaan kalau nggak diisi di .env. Di Railway wajib diisi yang acak dan panjang, kalau nggak tokennya gampang dipalsukan.
- Akun bawaan "pemilik" / "warung123" harus diganti sebelum dipakai beneran. Belum ada fitur ganti kata sandi dari aplikasi — itu potongan berikutnya setelah halaman login, atau sekalian bareng 6b.
- Masih satu akun pemilik saja, belum ada peran lain (misalnya kasir biasa) — itu rencana modul multi-pengguna nanti, bukan tahap ini.

## Tahap berikutnya

Tahap 6b: Halaman login dan tombol keluar.
