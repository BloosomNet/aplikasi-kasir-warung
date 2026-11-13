-- Skema basis data kasir warung.
-- Tahap 1 baru menyiapkan tabel produk; tabel transaksi dibuat di tahap kasir.
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
