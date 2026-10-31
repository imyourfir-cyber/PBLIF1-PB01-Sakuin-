/* ========== 1. TEMA (terang / gelap) ========== */
// Bootstrap mengatur warna lewat atribut data-bs-theme di tag <html>.

function setTema(tema) {
  document.documentElement.setAttribute('data-bs-theme', tema);
  localStorage.setItem('tema', tema);
}

setTema(localStorage.getItem('tema') || 'light');


/* ========== 2. NOTIFIKASI ========== */

function toast(pesan, error = false) {
  // notifikasi bisa dimatikan di Pengaturan (pesan error tetap tampil)
  if (localStorage.getItem('notif') === 'off' && !error) return;

  const kotak = document.createElement('div');
  kotak.className = 'alert shadow position-fixed bottom-0 end-0 m-3 ' + (error ? 'alert-danger' : 'alert-success');
  kotak.style.zIndex = 2000;
  kotak.textContent = pesan;
  document.body.appendChild(kotak);

  setTimeout(() => kotak.remove(), 3000);
}

// Pesan untuk ditampilkan di halaman berikutnya (contoh: setelah daftar, pindah ke login)
function pesanNanti(pesan) {
  sessionStorage.setItem('pesan', pesan);
}

if (sessionStorage.getItem('pesan')) {
  toast(sessionStorage.getItem('pesan'));
  sessionStorage.removeItem('pesan');
}


/* ========== 3. PENJAGA LOGIN (khusus halaman aplikasi) ========== */
// Halaman aplikasi punya atribut data-halaman di <body>. Halaman login tidak punya.

if (document.body.dataset.halaman) {
  if (!user) {
    location.replace('../auth/login.html');          // belum login
  } else if (user.wajibGanti) {
    location.replace('../auth/ganti-password.html'); // password habis direset admin
  } else {
    // isi nama dan foto di pojok kanan atas
    $('#nama-user').textContent = user.nama;
    $('#foto-user').src = user.foto || '../assets/img/user_1.jpg';

    // isi bagian atas menu pengguna (nama dan @username)
    $('#menu-nama').textContent = user.nama;
    $('#menu-username').textContent = '@' + user.username;
  }
}


/* ========== 4. MODAL (jendela form) ========== */

function bukaModal(id) {
  bootstrap.Modal.getOrCreateInstance($('#' + id)).show();
}

function tutupModal(id) {
  bootstrap.Modal.getOrCreateInstance($('#' + id)).hide();
}


/* ========== 5. KONFIRMASI HAPUS ========== */

function konfirmasiHapus() {
  return confirm('Hapus data ini? Data yang sudah dihapus tidak bisa dikembalikan.');
}
