/* landing.js : halaman utama (index.html) */

/* ---------- 1. Tema terang / gelap ---------- */

const tombolTema = document.querySelector('#tombol-tema');

function setTema(tema) {
  document.documentElement.setAttribute('data-bs-theme', tema);
  localStorage.setItem('tema', tema);
  tombolTema.textContent = tema === 'dark' ? '☀️' : '🌙';     // ikon menunjukkan tema tujuan
}

setTema(localStorage.getItem('tema') || 'light');

tombolTema.onclick = () => {
  const sekarang = document.documentElement.getAttribute('data-bs-theme');
  setTema(sekarang === 'dark' ? 'light' : 'dark');
};


/* ---------- 2. Form kontak ---------- */
// Tanpa backend, jadi pesan dikirim lewat aplikasi email (mailto).

const EMAIL_TUJUAN = ['imyourfir@gmail.com', 'ghizellarahmaazzahra@gmail.com'];
const formKontak = document.querySelector('#form-kontak');

formKontak.onsubmit = ev => {
  ev.preventDefault();
  formKontak.classList.add('was-validated');        // tampilkan pesan error Bootstrap

  if (!formKontak.checkValidity()) return;          // ada isian yang belum benar

  const isi = `Nama: ${formKontak.nama.value}\nEmail: ${formKontak.email.value}\n\n${formKontak.pesan.value}`;

  location.href = 'mailto:' + EMAIL_TUJUAN.join(',')
    + '?subject=' + encodeURIComponent('Pesan dari web Sakuin')
    + '&body=' + encodeURIComponent(isi);

  document.querySelector('#info-kirim').textContent = 'Aplikasi email dibuka. Tekan Kirim di sana untuk mengirim pesanmu.';
  formKontak.reset();
  formKontak.classList.remove('was-validated');
};
