/* login.js : halaman login */

// Alamat login.html?logout=1 berarti pengguna menekan Logout
const logout = new URLSearchParams(location.search).get('logout');

if (logout) {
  localStorage.removeItem('sk_session');              // hapus tanda sudah login
} else if (user) {
  location.replace('../pages/dashboard.html');        // sudah login -> langsung ke dashboard
}

$('#form-login').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  // cari akun dengan username yang diketik
  const username = f.username.value.trim().toLowerCase();
  const akun = ambilUsers().find(u => u.username.toLowerCase() === username);

  if (!akun || akun.password !== f.password.value) {
    $('#error').textContent = 'Username atau password salah.';
    return;
  }

  // simpan tanda login, lalu pindah halaman
  localStorage.setItem('sk_session', akun.username);
  location.href = akun.wajibGanti ? 'ganti-password.html' : '../pages/dashboard.html';
};
