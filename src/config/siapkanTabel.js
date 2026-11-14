// Bikin tabel sendiri pas server nyala, biar pas deploy ke Railway
// nggak perlu jalanin schema.sql manual. Kalau tabel udah ada, dilewatin.
const pool = require('./database');

const buatTabel = [
  `CREATE TABLE IF NOT EXISTS produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    harga INT NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    kategori VARCHAR(50),
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total INT NOT NULL,
    bayar INT NOT NULL,
    kembalian INT NOT NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS detail_transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaksi_id INT NOT NULL,
    produk_id INT NOT NULL,
    nama_produk VARCHAR(100) NOT NULL,
    harga INT NOT NULL,
    jumlah INT NOT NULL,
    subtotal INT NOT NULL,
    FOREIGN KEY (transaksi_id) REFERENCES transaksi(id),
    FOREIGN KEY (produk_id) REFERENCES produk(id)
  )`,
];

// Coba bikin tabel, kalau basis data belum siap (misal MySQL Railway
// masih nyala), tunggu bentar terus coba lagi. Maksimal 12 kali.
async function siapkanTabel() {
  for (let percobaan = 1; percobaan <= 12; percobaan++) {
    try {
      for (const sql of buatTabel) {
        await pool.query(sql);
      }
      console.log('Tabel sudah siap.');
      return;
    } catch (err) {
      console.log(`Basis data belum siap (percobaan ${percobaan}/12), coba lagi 5 detik lagi...`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  console.log('Tabel belum kebikin setelah 12 kali coba, cek pengaturan basis data.');
}

module.exports = siapkanTabel;
