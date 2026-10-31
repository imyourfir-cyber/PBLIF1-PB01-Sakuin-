/* tabungan.js : halaman tabungan (target tabungan dan setoran) */

const formTarget = $('#form-target');
const formSetor = $('#form-setor');


/* ---------- 1. Ringkasan dan kartu target ---------- */

function tampilkan() {
  // [...daftarTarget].reverse() = salinan daftar dengan urutan dibalik (target terbaru di atas)
  $('#daftar-target').innerHTML = [...daftarTarget].reverse().map(t => {
    const kumpul = terkumpul(t.id);
    const persen = Math.min(100, kumpul / t.target * 100);
    const tercapai = persen >= 100;

    return `
      <div class="col-md-6">
        <div class="card h-100"><div class="card-body">
          <div class="d-flex justify-content-between">
            <b>${amankan(t.nama)}</b>
            <small>${Math.round(persen)}%${tercapai ? ' · Tercapai' : ''}</small>
          </div>

          <div class="progress my-2">
            <div class="progress-bar ${tercapai ? 'bg-warning' : 'bg-success'}" style="width: ${persen}%"></div>
          </div>

          <div class="d-flex justify-content-between">
            <span>${rupiah(kumpul)} <small class="text-body-secondary">dari ${rupiah(t.target)}</small></span>
            <small class="text-body-secondary">Kurang ${rupiah(Math.max(0, t.target - kumpul))}</small>
          </div>

          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-sm btn-success" onclick="nabung(${t.id})">Nabung</button>
            <span>
              <button class="btn btn-sm btn-outline-secondary" onclick="editTarget(${t.id})">Edit</button>
              <button class="btn btn-sm btn-outline-danger" onclick="hapusTarget(${t.id})">Hapus</button>
            </span>
          </div>
        </div></div>
      </div>`;
  }).join('') || `
    <div class="col-12"><div class="card"><div class="card-body text-body-secondary">
      Belum ada target tabungan. Buat satu, misalnya "Laptop baru" atau "Dana darurat".
    </div></div></div>`;

  // kartu ringkasan di atas
  const { saldo, tabungan } = hitungSaldo();
  $('#total-tabungan').textContent = rupiah(tabungan);
  $('#saldo-tersedia').textContent = rupiah(saldo);
}

tampilkan();


/* ---------- 2. Target: tambah, ubah, hapus ---------- */

function tambahTarget() {
  formTarget.reset();
  formTarget.idTarget.value = '';
  $('#judul-modal').textContent = 'Target Tabungan Baru';
  bukaModal('modal-target');
}

function editTarget(id) {
  const t = daftarTarget.find(x => x.id === id);

  formTarget.reset();
  formTarget.idTarget.value = t.id;
  formTarget.nama.value = t.nama;
  formTarget.jumlah.value = t.target;
  $('#judul-modal').textContent = 'Ubah Target Tabungan';
  bukaModal('modal-target');
}

function hapusTarget(id) {
  if (!konfirmasiHapus()) return;

  daftarTarget = daftarTarget.filter(t => t.id !== id);
  daftarSetoran = daftarSetoran.filter(s => s.targetId !== id);    // setoran target ini ikut dihapus
  simpanData('target', daftarTarget);
  simpanData('setoran', daftarSetoran);
  tampilkan();
  toast('Data berhasil dihapus.');
}

formTarget.onsubmit = ev => {
  ev.preventDefault();
  const f = formTarget;
  const data = { nama: f.nama.value.trim(), target: Number(f.jumlah.value) };

  if (f.idTarget.value) {
    Object.assign(daftarTarget.find(t => t.id === Number(f.idTarget.value)), data);
  } else {
    daftarTarget.push({ id: idBaru(daftarTarget), ...data });
  }

  simpanData('target', daftarTarget);
  tutupModal('modal-target');
  tampilkan();
  toast('Target tabungan disimpan.');
};


/* ---------- 3. Nabung (setoran) ---------- */

function nabung(id) {
  const t = daftarTarget.find(x => x.id === id);

  formSetor.reset();
  formSetor.idTarget.value = t.id;
  formSetor.nama.value = t.nama;
  formSetor.tanggal.value = hariIni;
  bukaModal('modal-setor');
}

formSetor.onsubmit = ev => {
  ev.preventDefault();
  const f = formSetor;

  daftarSetoran.push({
    id: idBaru(daftarSetoran),
    tanggal: f.tanggal.value,
    targetId: Number(f.idTarget.value),
    nominal: Number(f.nominal.value),
  });

  simpanData('setoran', daftarSetoran);
  tutupModal('modal-setor');
  tampilkan();
  toast('Setoran berhasil. Makin dekat ke targetmu!');
};
