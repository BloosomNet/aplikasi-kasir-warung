-- Skema basis data kasir warung.
-- Jalankan berkas ini di MySQL untuk membuat semua tabel yang dibutuhkan.
CREATE DATABASE IF NOT EXISTS kasir_warung;
USE kasir_warung;

CREATE TABLE IF NOT EXISTS produk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  harga INT NOT NULL,
  stok INT NOT NULL DEFAULT 0,
  kategori VARCHAR(50),
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Satu baris transaksi untuk satu kali pembayaran di kasir.
CREATE TABLE IF NOT EXISTS transaksi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total INT NOT NULL,
  bayar INT NOT NULL,
  kembalian INT NOT NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rincian barang yang dibeli dalam satu transaksi.
-- Nama dan harga disalin ke sini, supaya riwayat tetap benar
-- walaupun nama atau harga produk diubah di kemudian hari.
CREATE TABLE IF NOT EXISTS detail_transaksi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaksi_id INT NOT NULL,
  produk_id INT NOT NULL,
  nama_produk VARCHAR(100) NOT NULL,
  harga INT NOT NULL,
  jumlah INT NOT NULL,
  subtotal INT NOT NULL,
  FOREIGN KEY (transaksi_id) REFERENCES transaksi(id),
  FOREIGN KEY (produk_id) REFERENCES produk(id)
);
