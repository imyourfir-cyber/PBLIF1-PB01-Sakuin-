/* dashboard.js : halaman dashboard */

const transaksiBulan = transaksiBulanIni();
const { saldo, tabungan } = hitungSaldo();


/* ---------- 1. Sapaan dan kartu ringkasan ---------- */

$('#sapaan').textContent = 'Selamat datang, ' + user.nama.split(' ')[0];
$('#total-masuk').textContent = rupiah(totalNominal(transaksiJenis('Pemasukan', transaksiBulan)));
$('#total-keluar').textContent = rupiah(totalNominal(transaksiJenis('Pengeluaran', transaksiBulan)));
$('#saldo').textContent = rupiah(saldo);
$('#info-tabungan').textContent = 'Sudah dikurangi tabungan ' + rupiah(tabungan);


/* ---------- 2. Peringatan anggaran ---------- */
// Tampil kalau pengeluaran sudah melewati batas

$('#peringatan').innerHTML = hitungAnggaran()
  .filter(a => a.terpakai > a.batas)
  .map(a => `
    <div class="alert alert-warning">
      <b>Hey, udah dong!</b>
      ${amankan(a.nama)} sudah lewat batas ${rupiah(a.batas)}
      (kelebihan ${rupiah(a.terpakai - a.batas)}).
      <a href="anggaran.html" class="alert-link">Lihat anggaran</a>
    </div>`)
  .join('');


/* ---------- 3. Grafik garis (memakai Chart.js) ---------- */

// daftar tanggal yang ada transaksinya, urut dari yang paling awal
const daftarTanggal = [...new Set(transaksiBulan.map(t => t.tanggal))].sort();

// total per tanggal untuk satu jenis, contoh: [0, 50000, 120000]
function totalPerTanggal(jenis) {
  return daftarTanggal.map(tanggal => {
    const transaksiHariItu = transaksiJenis(jenis, transaksiBulan).filter(t => t.tanggal === tanggal);
    return totalNominal(transaksiHariItu);
  });
}

if (daftarTanggal.length === 0) {
  $('#area-grafik').innerHTML = '<p class="text-body-secondary">Belum ada transaksi bulan ini.</p>';
} else {
  Chart.defaults.color = getComputedStyle(document.body).color; // warna tulisan ikut tema

  new Chart($('#grafik'), {
    type: 'line',
    data: {
      labels: daftarTanggal.map(formatTanggal),
      datasets: [
        { label: 'Pemasukan',   data: totalPerTanggal('Pemasukan'),   borderColor: '#198754' },
        { label: 'Pengeluaran', data: totalPerTanggal('Pengeluaran'), borderColor: '#dc3545' },
      ],
    },
  });
}


/* ---------- 4. Transaksi terbaru (5 data) ---------- */

const terbaru = [...daftarTransaksi]
  .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id)   // tanggal terbaru dulu
  .slice(0, 5);

$('#terbaru').innerHTML = terbaru.map(t => {
  const kategori = cariKategori(t.kategoriId);
  const masuk = kategori.jenis === 'Pemasukan';

  return `
    <div class="d-flex justify-content-between border-bottom py-2">
      <div>${amankan(kategori.nama)}<br><small class="text-body-secondary">${amankan(t.keterangan || '-')}</small></div>
      <b class="${masuk ? 'text-success' : 'text-danger'}">${masuk ? '+' : '-'} ${rupiah(t.nominal)}</b>
    </div>`;
}).join('') || '<p class="text-body-secondary">Belum ada transaksi.</p>';
