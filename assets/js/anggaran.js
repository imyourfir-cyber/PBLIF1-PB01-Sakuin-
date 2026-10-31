/* anggaran.js : halaman anggaran (batas pengeluaran) */

const formAnggaran = $('#form-anggaran');

$('#judul-bulan').textContent = 'Batas Pengeluaran – ' + NAMA_BULAN[sekarang.getMonth()] + ' ' + tahun;

// Pilihan "Berlaku untuk": total bulanan + semua kategori pengeluaran
$('#pilih-kategori').innerHTML =
  '<option value="">Semua pengeluaran (total bulanan)</option>' +
  daftarKategori
    .filter(k => k.jenis === 'Pengeluaran')
    .map(k => `<option value="${k.id}">${amankan(k.nama)}</option>`)
    .join('');


/* ---------- 1. Tampilkan kartu anggaran ---------- */

function tampilkan() {
  $('#daftar-anggaran').innerHTML = hitungAnggaran().map(a => {
    const persen = a.terpakai / a.batas * 100;
    const lewat = persen > 100;

    // warna bar: merah kalau lewat, kuning kalau >= 80%, hijau kalau aman
    const warna = lewat ? 'bg-danger' : persen >= 80 ? 'bg-warning' : 'bg-success';

    return `
      <div class="col-md-6">
        <div class="card h-100 ${lewat ? 'border-danger' : ''}"><div class="card-body">
          <div class="d-flex justify-content-between">
            <b>${amankan(a.nama)}</b>
            <small>${Math.round(persen)}%</small>
          </div>

          <div class="progress my-2">
            <div class="progress-bar ${warna}" style="width: ${Math.min(100, persen)}%"></div>
          </div>

          <div class="d-flex justify-content-between">
            <span>${rupiah(a.terpakai)} <small class="text-body-secondary">dari ${rupiah(a.batas)}</small></span>
            ${lewat
              ? `<b class="text-danger">Lewat ${rupiah(a.terpakai - a.batas)}</b>`
              : `<small class="text-body-secondary">Sisa ${rupiah(a.batas - a.terpakai)}</small>`}
          </div>

          <div class="text-end mt-3">
            <button class="btn btn-sm btn-outline-secondary" onclick="editAnggaran(${a.id})">Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="hapusAnggaran(${a.id})">Hapus</button>
          </div>
        </div></div>
      </div>`;
  }).join('') || `
    <div class="col-12"><div class="card"><div class="card-body text-body-secondary">
      Belum ada batas. Klik "+ Atur Batas" untuk membuat batas total bulanan atau per kategori.
    </div></div></div>`;
}

tampilkan();


/* ---------- 2. Atur, ubah, hapus ---------- */

function aturBatas() {
  formAnggaran.reset();
  bukaModal('modal-anggaran');
}

function editAnggaran(id) {
  const a = daftarAnggaran.find(x => x.id === id);

  formAnggaran.reset();
  formAnggaran.kategori.value = a.kategoriId ?? '';
  formAnggaran.batas.value = a.batas;
  bukaModal('modal-anggaran');
}

function hapusAnggaran(id) {
  if (!konfirmasiHapus()) return;

  daftarAnggaran = daftarAnggaran.filter(a => a.id !== id);
  simpanData('anggaran', daftarAnggaran);
  tampilkan();
  toast('Data berhasil dihapus.');
}

formAnggaran.onsubmit = ev => {
  ev.preventDefault();
  const f = formAnggaran;
  const kategoriId = f.kategori.value ? Number(f.kategori.value) : null;   // null = total bulanan
  const batas = Number(f.batas.value);

  // satu batas untuk satu kategori: kalau sudah ada, cukup ubah nilainya
  const sudahAda = daftarAnggaran.find(a => a.kategoriId === kategoriId);

  if (sudahAda) {
    sudahAda.batas = batas;
  } else {
    daftarAnggaran.push({ id: idBaru(daftarAnggaran), kategoriId, batas });
  }

  simpanData('anggaran', daftarAnggaran);
  tutupModal('modal-anggaran');
  tampilkan();
  toast('Batas pengeluaran disimpan.');
};
