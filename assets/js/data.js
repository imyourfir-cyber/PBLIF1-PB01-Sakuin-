// $('#id') = singkatan dari document.querySelector('#id')
const $ = selector => document.querySelector(selector);


/* ========== 1. TANGGAL ========== */
// Data contoh selalu jatuh di bulan ini, supaya dashboard tidak kosong.

const sekarang = new Date();
const tahun = sekarang.getFullYear();
const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');

// tanggalBulanIni(5) -> "2026-10-05"
function tanggalBulanIni(hari) {
  return `${tahun}-${bulan}-${String(hari).padStart(2, '0')}`;
}

const hariIni = tanggalBulanIni(sekarang.getDate());


/* ========== 2. AKUN PENGGUNA ========== */

const USER_AWAL = [
  { nama: 'Andi Pratama', username: 'andi', email: 'andi@email.com', nim: '2301234', password: '123456' },
];

function ambilUsers() {
  const tersimpan = localStorage.getItem('sk_users');
  return tersimpan ? JSON.parse(tersimpan) : USER_AWAL;
}

function simpanUsers(users) {
  localStorage.setItem('sk_users', JSON.stringify(users));
}

// Akun yang sedang login (dicari dari username yang disimpan saat login)
const user = ambilUsers().find(u => u.username === localStorage.getItem('sk_session'));

// Simpan perubahan profil akun yang sedang login
function simpanUser() {
  const users = ambilUsers();
  const urutan = users.findIndex(u => u.username === user.username);
  users[urutan] = user;
  simpanUsers(users);
}

// Email admin: tujuan permintaan reset password
const EMAIL_ADMIN = ['imyourfir@gmail.com', 'ghizellarahmaazzahra@gmail.com'];


/* ========== 3. PENYIMPANAN DATA KEUANGAN ========== */
// Setiap akun punya data sendiri, kuncinya diawali nama akun, contoh: sk_andi_transaksi

function kunci(nama) {
  return `sk_${localStorage.getItem('sk_session')}_${nama}`;
}

// Ambil data dari localStorage. Kalau belum ada, pakai data awal.
function ambilData(nama, dataAwal) {
  const tersimpan = localStorage.getItem(kunci(nama));
  return tersimpan ? JSON.parse(tersimpan) : dataAwal;
}

function simpanData(nama, data) {
  localStorage.setItem(kunci(nama), JSON.stringify(data));
}

// id baru = id terbesar + 1
function idBaru(daftar) {
  return Math.max(0, ...daftar.map(item => item.id)) + 1;
}


/* ========== 4. DATA KEUANGAN (data awal berupa contoh) ========== */

let daftarKategori = ambilData('kategori', [
  { id: 1, nama: 'Uang Saku',    jenis: 'Pemasukan' },
  { id: 2, nama: 'Beasiswa',     jenis: 'Pemasukan' },
  { id: 3, nama: 'Makan',        jenis: 'Pengeluaran' },
  { id: 4, nama: 'Transportasi', jenis: 'Pengeluaran' },
  { id: 5, nama: 'Hiburan',      jenis: 'Pengeluaran' },
]);

// kategoriId menunjuk ke id di daftarKategori
let daftarTransaksi = ambilData('transaksi', [
  { id: 1, tanggal: tanggalBulanIni(1),  kategoriId: 1, nominal: 1500000, keterangan: 'Kiriman bulanan' },
  { id: 2, tanggal: tanggalBulanIni(3),  kategoriId: 2, nominal: 2000000, keterangan: 'Beasiswa semester ganjil' },
  { id: 3, tanggal: tanggalBulanIni(2),  kategoriId: 3, nominal: 45000,   keterangan: 'Makan siang kantin' },
  { id: 4, tanggal: tanggalBulanIni(4),  kategoriId: 4, nominal: 30000,   keterangan: 'Ojek online ke kampus' },
  { id: 5, tanggal: tanggalBulanIni(6),  kategoriId: 3, nominal: 120000,  keterangan: 'Makan bareng teman' },
  { id: 6, tanggal: tanggalBulanIni(7),  kategoriId: 5, nominal: 75000,   keterangan: 'Nonton bioskop' },
  { id: 7, tanggal: tanggalBulanIni(9),  kategoriId: 3, nominal: 85000,   keterangan: 'Belanja bahan makanan' },
  { id: 8, tanggal: tanggalBulanIni(10), kategoriId: 4, nominal: 50000,   keterangan: 'Isi bensin' },
  { id: 9, tanggal: tanggalBulanIni(12), kategoriId: 3, nominal: 90000,   keterangan: 'Makan malam' },
]);

// kategoriId = null artinya batas total pengeluaran sebulan
let daftarAnggaran = ambilData('anggaran', [
  { id: 1, kategoriId: null, batas: 2000000 },
  { id: 2, kategoriId: 3,    batas: 300000 },
  { id: 3, kategoriId: 5,    batas: 150000 },
]);

let daftarTarget = ambilData('target', [
  { id: 1, nama: 'Laptop baru',  target: 8000000 },
  { id: 2, nama: 'Dana darurat', target: 2000000 },
]);

// targetId menunjuk ke id di daftarTarget
let daftarSetoran = ambilData('setoran', [
  { id: 1, tanggal: tanggalBulanIni(5),  targetId: 1, nominal: 500000 },
  { id: 2, tanggal: tanggalBulanIni(8),  targetId: 1, nominal: 300000 },
  { id: 3, tanggal: tanggalBulanIni(11), targetId: 2, nominal: 200000 },
]);


/* ========== 5. FUNGSI BANTU: TAMPILAN ========== */

const NAMA_BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// 1500000 -> "Rp 1.500.000"
function rupiah(angka) {
  return 'Rp ' + Math.round(angka).toLocaleString('id-ID');
}

// "2026-10-05" -> "5 Okt 2026"
function formatTanggal(teks) {
  const [thn, bln, hari] = teks.split('-');
  return Number(hari) + ' ' + NAMA_BULAN[bln - 1].slice(0, 3) + ' ' + thn;
}

// Mengubah karakter < > & " ' supaya teks buatan pengguna aman dimasukkan ke HTML
function amankan(teks) {
  return String(teks ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}


/* ========== 6. FUNGSI BANTU: HITUNGAN ========== */

function cariKategori(id) {
  return daftarKategori.find(k => k.id === id);
}

// Jumlah semua nominal dalam sebuah daftar
function totalNominal(daftar) {
  return daftar.reduce((jumlah, item) => jumlah + item.nominal, 0);
}

// Ambil transaksi yang jenisnya 'Pemasukan' atau 'Pengeluaran'
function transaksiJenis(jenis, daftar = daftarTransaksi) {
  return daftar.filter(t => cariKategori(t.kategoriId).jenis === jenis);
}

function transaksiBulanIni() {
  return daftarTransaksi.filter(t => t.tanggal.startsWith(`${tahun}-${bulan}`));
}

// Total yang sudah ditabung untuk satu target
function terkumpul(targetId) {
  return totalNominal(daftarSetoran.filter(s => s.targetId === targetId));
}

// Saldo = pemasukan - pengeluaran - tabungan
function hitungSaldo() {
  const masuk = totalNominal(transaksiJenis('Pemasukan'));
  const keluar = totalNominal(transaksiJenis('Pengeluaran'));
  const tabungan = totalNominal(daftarSetoran);
  return { saldo: masuk - keluar - tabungan, tabungan: tabungan };
}

// Setiap anggaran + berapa yang sudah terpakai bulan ini
function hitungAnggaran() {
  return daftarAnggaran.map(a => {
    const pengeluaran = transaksiJenis('Pengeluaran', transaksiBulanIni())
      .filter(t => a.kategoriId === null || t.kategoriId === a.kategoriId);

    return {
      ...a,
      nama: a.kategoriId === null ? 'Total pengeluaran bulanan' : cariKategori(a.kategoriId).nama,
      terpakai: totalNominal(pengeluaran),
    };
  });
}
