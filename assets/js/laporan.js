/* laporan.js : halaman laporan (rekap pemasukan, pengeluaran, tabungan) */

// Jenis laporan awal bisa dari alamat, contoh: laporan.html?jenis=Tabungan
let jenisAktif = new URLSearchParams(location.search).get('jenis');
if (!['Pemasukan', 'Pengeluaran', 'Tabungan'].includes(jenisAktif)) jenisAktif = 'Pemasukan';

const form = $('#form-laporan');
const tombolTab = document.querySelectorAll('#tab-jenis button');


/* ---------- Bagian kecil yang dipakai berulang ---------- */

// Apakah tanggal ada di antara "dari" dan "sampai"? Kalau kosong, anggap tanpa batas.
function dalamRentang(tanggal, dari, sampai) {
  return (!dari || tanggal >= dari) && (!sampai || tanggal <= sampai);
}

// Satu kartu angka
function kartu(label, nilai, kelasWarna = '') {
  return `
    <div class="col-md-4">
      <div class="card h-100"><div class="card-body">
        <small class="text-body-secondary">${label}</small>
        <h4 class="mb-0 ${kelasWarna}">${rupiah(nilai)}</h4>
      </div></div>
    </div>`;
}

// Satu kotak berisi tabel
function kotakTabel(judul, kepala, baris, kolom) {
  return `
    <div class="card mb-3"><div class="card-body">
      <h5>${judul}</h5>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead><tr>${kepala}</tr></thead>
          <tbody>${baris || `<tr><td colspan="${kolom}" class="text-center text-body-secondary">Data tidak ditemukan.</td></tr>`}</tbody>
        </table>
      </div>
    </div></div>`;
}


/* ---------- Pilihan kategori / target ---------- */

function isiPilihan() {
  const dipilih = form.pilihan.value;

  if (jenisAktif === 'Tabungan') {
    $('#pilihan').innerHTML = '<option value="">Semua Target</option>' +
      daftarTarget.map(t => `<option value="${t.id}">${amankan(t.nama)}</option>`).join('');
  } else {
    $('#pilihan').innerHTML = '<option value="">Semua Kategori</option>' +
      daftarKategori.filter(k => k.jenis === jenisAktif)
        .map(k => `<option value="${k.id}">${amankan(k.nama)}</option>`).join('');
  }

  form.pilihan.value = dipilih;   // kembalikan pilihan lama kalau masih ada
}


/* ---------- Laporan pemasukan / pengeluaran ---------- */

function laporanTransaksi(dari, sampai, kategoriId) {
  const dalamPeriode = daftarTransaksi.filter(t => dalamRentang(t.tanggal, dari, sampai));
  const masuk = totalNominal(transaksiJenis('Pemasukan', dalamPeriode));
  const keluar = totalNominal(transaksiJenis('Pengeluaran', dalamPeriode));

  const hasil = transaksiJenis(jenisAktif, dalamPeriode)
    .filter(t => !kategoriId || t.kategoriId === kategoriId)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.id - b.id);

  const baris = hasil.map((t, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${formatTanggal(t.tanggal)}</td>
      <td>${amankan(cariKategori(t.kategoriId).nama)}</td>
      <td>${amankan(t.keterangan || '-')}</td>
      <td class="text-end">${rupiah(t.nominal)}</td>
    </tr>`).join('');

  $('#hasil').innerHTML =
    `<div class="row g-3 mb-3">
      ${kartu('Total Pemasukan', masuk, 'text-success')}
      ${kartu('Total Pengeluaran', keluar, 'text-danger')}
      ${kartu('Saldo', masuk - keluar)}
    </div>` +
    kotakTabel(
      'Rekap ' + jenisAktif,
      '<th>No</th><th>Tanggal</th><th>Kategori</th><th>Keterangan</th><th class="text-end">Nominal</th>',
      baris, 5
    ) +
    `<p class="text-end fw-bold">Total: ${rupiah(totalNominal(hasil))}</p>`;
}


/* ---------- Laporan tabungan ---------- */

function laporanTabungan(dari, sampai, targetId) {
  const hasil = daftarSetoran
    .filter(s => dalamRentang(s.tanggal, dari, sampai) && (!targetId || s.targetId === targetId))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  const { saldo, tabungan } = hitungSaldo();

  const barisProgres = daftarTarget.map((t, i) => {
    const kumpul = terkumpul(t.id);
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${amankan(t.nama)}</td>
        <td class="text-end">${rupiah(kumpul)}</td>
        <td class="text-end">${rupiah(t.target)}</td>
        <td class="text-end">${Math.min(100, Math.round(kumpul / t.target * 100))}%</td>
      </tr>`;
  }).join('');

  const barisRekap = hasil.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${formatTanggal(s.tanggal)}</td>
      <td>${amankan(daftarTarget.find(t => t.id === s.targetId).nama)}</td>
      <td class="text-end">${rupiah(s.nominal)}</td>
    </tr>`).join('');

  $('#hasil').innerHTML =
    `<div class="row g-3 mb-3">
      ${kartu('Total Disetor (periode ini)', totalNominal(hasil), 'text-success')}
      ${kartu('Total Tabungan (keseluruhan)', tabungan)}
      ${kartu('Saldo Tersedia', saldo)}
    </div>` +
    kotakTabel(
      'Progres per Target',
      '<th>No</th><th>Target</th><th class="text-end">Terkumpul</th><th class="text-end">Target</th><th class="text-end">Progres</th>',
      barisProgres, 5
    ) +
    kotakTabel(
      'Rekap Tabungan',
      '<th>No</th><th>Tanggal</th><th>Target</th><th class="text-end">Nominal</th>',
      barisRekap, 4
    ) +
    `<p class="text-end fw-bold">Total: ${rupiah(totalNominal(hasil))}</p>`;
}


/* ---------- Tampilkan laporan ---------- */

function tampilkan() {
  tombolTab.forEach(t => t.classList.toggle('active', t.dataset.jenis === jenisAktif));
  isiPilihan();

  const dari = form.dari.value;
  const sampai = form.sampai.value;
  const pilihan = Number(form.pilihan.value);     // 0 kalau "Semua"

  if (jenisAktif === 'Tabungan') laporanTabungan(dari, sampai, pilihan);
  else laporanTransaksi(dari, sampai, pilihan);
}

// Klik tab jenis laporan
tombolTab.forEach(tombol => {
  tombol.onclick = () => {
    jenisAktif = tombol.dataset.jenis;
    form.pilihan.value = '';        // ganti jenis -> pilihan kategori direset
    tampilkan();
  };
});

form.onsubmit = ev => {
  ev.preventDefault();
  tampilkan();
};

tampilkan();
