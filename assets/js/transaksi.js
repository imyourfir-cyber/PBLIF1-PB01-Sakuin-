/* transaksi.js : halaman transaksi (tampil, filter, tambah, ubah, hapus) */

const formFilter = $('#form-filter');
const formTransaksi = $('#form-transaksi');


/* ---------- 1. Isi pilihan kategori ---------- */

// Pilihan kategori pada filter (semua kategori)
$('#filter-kategori').innerHTML =
  '<option value="">Semua Kategori</option>' +
  daftarKategori.map(k => `<option value="${k.id}">${amankan(k.nama)}</option>`).join('');

// Pilihan kategori pada form: hanya kategori yang jenisnya sama dengan jenis yang dipilih
function isiKategoriForm(jenis, dipilih) {
  $('#form-kategori').innerHTML = daftarKategori
    .filter(k => k.jenis === jenis)
    .map(k => `<option value="${k.id}">${amankan(k.nama)}</option>`)
    .join('');

  if (dipilih) $('#form-kategori').value = dipilih;
}

// ganti jenis -> daftar kategori ikut berganti
$('#form-jenis').onchange = () => isiKategoriForm($('#form-jenis').value);


/* ---------- 2. Tampilkan tabel ---------- */

// Apakah transaksi t cocok dengan filter yang diisi?
function cocokFilter(t) {
  const f = formFilter;
  const kategori = cariKategori(t.kategoriId);
  const kata = f.kata.value.toLowerCase();

  return (!kata || (t.keterangan + ' ' + kategori.nama).toLowerCase().includes(kata))
    && (!f.jenis.value || kategori.jenis === f.jenis.value)
    && (!f.kategori.value || t.kategoriId === Number(f.kategori.value))
    && (!f.dari.value || t.tanggal >= f.dari.value)
    && (!f.sampai.value || t.tanggal <= f.sampai.value);
}

function tampilkan() {
  const hasil = daftarTransaksi
    .filter(cocokFilter)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);   // terbaru dulu

  $('#isi-tabel').innerHTML = hasil.map((t, i) => {
    const kategori = cariKategori(t.kategoriId);
    const masuk = kategori.jenis === 'Pemasukan';

    return `
      <tr>
        <td>${i + 1}</td>
        <td>${formatTanggal(t.tanggal)}</td>
        <td><span class="badge ${masuk ? 'text-bg-success' : 'text-bg-danger'}">${kategori.jenis}</span></td>
        <td>${amankan(kategori.nama)}</td>
        <td class="text-end">${rupiah(t.nominal)}</td>
        <td>${amankan(t.keterangan || '-')}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary" onclick="editTransaksi(${t.id})">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="hapusTransaksi(${t.id})">Hapus</button>
        </td>
      </tr>`;
  }).join('') || '<tr><td colspan="7" class="text-center text-body-secondary">Data tidak ditemukan.</td></tr>';
}

formFilter.onsubmit = ev => {
  ev.preventDefault();
  tampilkan();
};

tampilkan();


/* ---------- 3. Tambah, ubah, hapus ---------- */

function tambahTransaksi() {
  formTransaksi.reset();
  formTransaksi.idTransaksi.value = '';
  formTransaksi.tanggal.value = hariIni;
  isiKategoriForm('Pemasukan');
  $('#judul-modal').textContent = 'Tambah Transaksi';
  bukaModal('modal-transaksi');
}

function editTransaksi(id) {
  const t = daftarTransaksi.find(x => x.id === id);
  const kategori = cariKategori(t.kategoriId);

  formTransaksi.reset();
  formTransaksi.idTransaksi.value = t.id;
  formTransaksi.tanggal.value = t.tanggal;
  formTransaksi.jenis.value = kategori.jenis;
  isiKategoriForm(kategori.jenis, t.kategoriId);
  formTransaksi.nominal.value = t.nominal;
  formTransaksi.keterangan.value = t.keterangan;
  $('#judul-modal').textContent = 'Ubah Transaksi';
  bukaModal('modal-transaksi');
}

function hapusTransaksi(id) {
  if (!konfirmasiHapus()) return;

  daftarTransaksi = daftarTransaksi.filter(t => t.id !== id);
  simpanData('transaksi', daftarTransaksi);
  tampilkan();
  toast('Data berhasil dihapus.');
}

// Tombol Simpan: kalau idTransaksi terisi berarti ubah, kalau kosong berarti tambah baru
formTransaksi.onsubmit = ev => {
  ev.preventDefault();
  const f = formTransaksi;

  const data = {
    tanggal: f.tanggal.value,
    kategoriId: Number(f.kategori.value),
    nominal: Number(f.nominal.value),
    keterangan: f.keterangan.value.trim(),
  };

  if (!data.kategoriId) return toast('Pilih kategori dulu.', true);

  if (f.idTransaksi.value) {
    Object.assign(daftarTransaksi.find(t => t.id === Number(f.idTransaksi.value)), data);
  } else {
    daftarTransaksi.push({ id: idBaru(daftarTransaksi), ...data });
  }

  simpanData('transaksi', daftarTransaksi);
  tutupModal('modal-transaksi');
  tampilkan();
  toast('Transaksi berhasil disimpan.');
};
