/* ganti.js : halaman buat password baru (setelah password direset admin) */

// Penjaga halaman
if (!user) {
  location.replace('login.html');                     // belum login
} else if (!user.wajibGanti) {
  location.replace('../pages/dashboard.html');        // tidak sedang diwajibkan ganti
}

$('#form-ganti').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  if (f.baru.value.length < 6) {
    $('#error').textContent = 'Password baru minimal 6 karakter.';
    return;
  }
  if (f.baru.value === user.password) {
    $('#error').textContent = 'Password baru tidak boleh sama dengan password sementara.';
    return;
  }
  if (f.baru.value !== f.konfirmasi.value) {
    $('#error').textContent = 'Konfirmasi password tidak sama.';
    return;
  }

  // simpan password baru, hapus tanda "wajib ganti"
  user.password = f.baru.value;
  delete user.wajibGanti;
  simpanUser();

  pesanNanti('Password baru berhasil disimpan.');
  location.href = '../pages/dashboard.html';
};
