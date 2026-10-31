$('#form-lupa').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  // akun harus cocok: username DAN email
  const username = f.username.value.trim().toLowerCase();
  const email = f.email.value.trim().toLowerCase();
  const akun = ambilUsers().find(u => u.username.toLowerCase() === username && (u.email || '').toLowerCase() === email);

  if (!akun) {
    $('#error').textContent = 'Username dan email tidak cocok dengan akun mana pun.';
    return;
  }

  // isi email untuk admin
  const isi = [
    'Halo Admin,',
    '',
    'Saya meminta reset password akun Sakuin.',
    '',
    'Nama: ' + akun.nama,
    'Username: ' + akun.username,
    'Email: ' + akun.email,
    'Waktu: ' + new Date().toLocaleString('id-ID'),
  ].join('\n');

  const linkEmail = 'mailto:' + EMAIL_ADMIN.join(',')
    + '?subject=' + encodeURIComponent('Permintaan Reset Password Sakuin')
    + '&body=' + encodeURIComponent(isi);

  // tampilkan pesan sukses, lalu buka aplikasi email
  f.hidden = true;
  $('#sukses').hidden = false;
  $('#tombol-email').href = linkEmail;
  location.href = linkEmail;
};
