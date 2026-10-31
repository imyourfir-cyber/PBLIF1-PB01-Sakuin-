/* kategori.js : halaman kategori (tampil, cari, tambah, ubah, hapus) */

let jenisAktif = 'Pemasukan';     // tab yang sedang dipilih
const formKategori = $('#form-kategori');


/* ---------- 1. Tampilkan tabel ---------- */

function tampilkan() {
  const kata = $('#form-cari').kata.value.toLowerCase();

  const hasil = daftarKategori.filter(k => k.jenis === jenisAktif && k.nama.toLowerCase().includes(kata));

  $('#isi-tabel').innerHTML = hasil.map((k, i) => {
    // total semua transaksi pada kategori ini
    const total = totalNominal(daftarTransaksi.filter(t => t.kategoriId === k.id));

    return `
      <tr>
        <td>${i + 1}</td>
        <td>${amankan(k.nama)}</td>
        <td class="text-end">${rupiah(total)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary" onclick="editKategori(${k.id})">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="hapusKategori(${k.id})">Hapus</button>
        </td>
      </tr>`;
  }).join('') || '<tr><td colspan="4" class="text-center text-body-secondary">Data tidak ditemukan.</td></tr>';
}

// Klik tab Pemasukan / Pengeluaran
document.querySelectorAll('#tab-jenis button').forEach(tombol => {
  tombol.onclick = () => {
    jenisAktif = tombol.dataset.jenis;
    document.querySelectorAll('#tab-jenis button').forEach(t => t.classList.toggle('active', t === tombol));
    tampilkan();
  };
});

$('#form-cari').onsubmit = ev => {
  ev.preventDefault();
  tampilkan();
};

tampilkan();


/* ---------- 2. Tambah, ubah, hapus ---------- */

function tambahKategori() {
  formKategori.reset();
  formKategori.idKategori.value = '';
  formKategori.jenis.value = jenisAktif;          // jenis mengikuti tab yang aktif
  $('#judul-modal').textContent = 'Tambah Kategori';
  bukaModal('modal-kategori');
}

function editKategori(id) {
  const k = daftarKategori.find(x => x.id === id);

  formKategori.reset();
  formKategori.idKategori.value = k.id;
  formKategori.nama.value = k.nama;
  formKategori.jenis.value = k.jenis;
  $('#judul-modal').textContent = 'Ubah Kategori';
  bukaModal('modal-kategori');
}

function hapusKategori(id) {
  // kategori yang masih dipakai transaksi tidak boleh dihapus
  if (daftarTransaksi.some(t => t.kategoriId === id)) {
    return toast('Kategori masih dipakai transaksi, hapus transaksinya dulu.', true);
  }
  if (!konfirmasiHapus()) return;

  daftarKategori = daftarKategori.filter(k => k.id !== id);
  daftarAnggaran = daftarAnggaran.filter(a => a.kategoriId !== id);   // anggaran kategori ini ikut dihapus
  simpanData('kategori', daftarKategori);
  simpanData('anggaran', daftarAnggaran);
  tampilkan();
  toast('Data berhasil dihapus.');
}

formKategori.onsubmit = ev => {
  ev.preventDefault();
  const f = formKategori;
  const nama = f.nama.value.trim();
  const jenis = f.jenis.value;
  const id = Number(f.idKategori.value);       // 0 kalau kosong (tambah baru)

  // nama yang sama dalam satu jenis tidak boleh
  const kembar = daftarKategori.some(k => k.id !== id && k.jenis === jenis && k.nama.toLowerCase() === nama.toLowerCase());
  if (kembar) return toast('Kategori sudah ada.', true);

  if (id) {
    Object.assign(daftarKategori.find(k => k.id === id), { nama, jenis });
  } else {
    daftarKategori.push({ id: idBaru(daftarKategori), nama, jenis });
  }

  simpanData('kategori', daftarKategori);
  tutupModal('modal-kategori');
  tampilkan();
  toast('Kategori berhasil disimpan.');
};
