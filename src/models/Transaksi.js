// Model Transaksi: menyimpan satu kali pembayaran di kasir.
// Semua langkah di bawah ini dijalankan dalam satu transaksi basis data:
// kalau ada satu langkah yang gagal, semua perubahan dibatalkan,
// supaya tidak ada transaksi yang tersimpan setengah-setengah.
const pool = require('../config/database');

// Membuat transaksi baru dari keranjang.
// barang: [{ produk_id, jumlah }], bayar: jumlah uang yang diterima.
// Total dihitung ulang dari harga di basis data, bukan dari kiriman peramban.
async function buatTransaksi(barang, bayar) {
  const koneksi = await pool.getConnection();
  try {
    await koneksi.beginTransaction();

    let total = 0;
    const rincian = [];

    for (const item of barang) {
      // Baris produk dikunci selama transaksi, supaya dua kasir
      // tidak menjual stok terakhir yang sama di saat bersamaan.
      const [baris] = await koneksi.query(
        'SELECT * FROM produk WHERE id = ? FOR UPDATE',
        [item.produk_id]
      );
      const produk = baris[0];
      if (!produk) {
        throw new Error(`Produk dengan id ${item.produk_id} tidak ditemukan`);
      }
      if (item.jumlah > produk.stok) {
        throw new Error(`Stok ${produk.nama} tidak cukup, sisa ${produk.stok}`);
      }
      const subtotal = produk.harga * item.jumlah;
      total += subtotal;
      rincian.push({
        produk_id: produk.id,
        nama_produk: produk.nama,
        harga: produk.harga,
        jumlah: item.jumlah,
        subtotal,
      });
    }

    if (bayar < total) {
      throw new Error(`Uang bayar kurang Rp${(total - bayar).toLocaleString('id-ID')}`);
    }
    const kembalian = bayar - total;

    const [hasil] = await koneksi.query(
      'INSERT INTO transaksi (total, bayar, kembalian) VALUES (?, ?, ?)',
      [total, bayar, kembalian]
    );
    const transaksiId = hasil.insertId;

    for (const rincianItem of rincian) {
      await koneksi.query(
        'INSERT INTO detail_transaksi (transaksi_id, produk_id, nama_produk, harga, jumlah, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [transaksiId, rincianItem.produk_id, rincianItem.nama_produk, rincianItem.harga, rincianItem.jumlah, rincianItem.subtotal]
      );
      // Stok berkurang sebanyak jumlah yang dibeli.
      await koneksi.query(
        'UPDATE produk SET stok = stok - ? WHERE id = ?',
        [rincianItem.jumlah, rincianItem.produk_id]
      );
    }

    await koneksi.commit();
    return { id: transaksiId, total, bayar, kembalian, barang: rincian };
  } catch (kesalahan) {
    await koneksi.rollback();
    throw kesalahan;
  } finally {
    koneksi.release();
  }
}

// Melihat daftar transaksi dalam rentang tanggal.
// Setiap baris berisi jumlah barang yang dibeli, supaya daftar tetap ringkas.
// dari dan sampai memakai format YYYY-MM-DD.
async function lihatRiwayat(dari, sampai) {
  const [baris] = await pool.query(
    `SELECT t.id, t.total, t.bayar, t.kembalian, t.dibuat_pada,
            COUNT(d.id) AS jumlah_item
       FROM transaksi t
       LEFT JOIN detail_transaksi d ON d.transaksi_id = t.id
      WHERE DATE(t.dibuat_pada) BETWEEN ? AND ?
      GROUP BY t.id
      ORDER BY t.dibuat_pada DESC, t.id DESC
      LIMIT 100`,
    [dari, sampai]
  );
  return baris;
}

// Melihat satu transaksi beserta rincian barangnya.
// Mengembalikan null kalau nomor transaksi tidak ada.
async function lihatSatu(id) {
  const [baris] = await pool.query(
    'SELECT id, total, bayar, kembalian, dibuat_pada FROM transaksi WHERE id = ?',
    [id]
  );
  const transaksi = baris[0];
  if (!transaksi) {
    return null;
  }
  const [rincian] = await pool.query(
    `SELECT nama_produk, harga, jumlah, subtotal
       FROM detail_transaksi
      WHERE transaksi_id = ?
      ORDER BY id ASC`,
    [id]
  );
  transaksi.barang = rincian;
  return transaksi;
}

// Laporan harian: untuk tiap tanggal, berapa transaksi dan berapa omzetnya.
async function laporanHarian(dari, sampai) {
  const [baris] = await pool.query(
    `SELECT DATE(dibuat_pada) AS tanggal,
            COUNT(*) AS jumlah_transaksi,
            SUM(total) AS omzet
       FROM transaksi
      WHERE DATE(dibuat_pada) BETWEEN ? AND ?
      GROUP BY DATE(dibuat_pada)
      ORDER BY tanggal DESC`,
    [dari, sampai]
  );
  return baris;
}

// Produk terlaris dalam rentang tanggal, diurutkan dari yang paling banyak terjual.
async function produkTerlaris(dari, sampai) {
  const [baris] = await pool.query(
    `SELECT d.nama_produk,
            SUM(d.jumlah) AS terjual,
            SUM(d.subtotal) AS pendapatan
       FROM detail_transaksi d
       JOIN transaksi t ON t.id = d.transaksi_id
      WHERE DATE(t.dibuat_pada) BETWEEN ? AND ?
      GROUP BY d.nama_produk
      ORDER BY terjual DESC, pendapatan DESC
      LIMIT 10`,
    [dari, sampai]
  );
  return baris;
}

module.exports = { buatTransaksi, lihatRiwayat, lihatSatu, laporanHarian, produkTerlaris };
