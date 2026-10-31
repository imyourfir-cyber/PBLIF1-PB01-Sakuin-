/* register.js : halaman daftar akun */

// Periksa isi form. Kembalikan pesan error pertama, atau '' kalau semuanya benar.
function periksaForm(f, users) {
  const username = f.username.value.trim();
  const email = f.email.value.trim().toLowerCase();

  if (!/^[A-Za-z0-9_.]{3,50}$/.test(username)) {
    return 'Username 3-50 karakter: huruf, angka, titik, atau garis bawah.';
  }
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return 'Username sudah dipakai.';
  }
  if (users.some(u => (u.email || '').toLowerCase() === email)) {
    return 'Email sudah terdaftar.';
  }
  if (f.password.value.length < 6) {
    return 'Password minimal 6 karakter.';
  }
  if (f.password.value !== f.konfirmasi.value) {
    return 'Konfirmasi password tidak sama.';
  }
  return '';
}

$('#form-daftar').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;
  const users = ambilUsers();

  const error = periksaForm(f, users);
  if (error) {
    $('#error').textContent = error;
    return;
  }

  // tambah akun baru, lalu pindah ke halaman login
  users.push({
    nama: f.nama.value.trim(),
    username: f.username.value.trim(),
    email: f.email.value.trim(),
    nim: '',
    password: f.password.value,
  });
  simpanUsers(users);

  pesanNanti('Akun berhasil dibuat. Silakan masuk.');
  location.href = 'login.html';
};
