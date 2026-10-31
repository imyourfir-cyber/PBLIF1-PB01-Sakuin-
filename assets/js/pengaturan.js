/* pengaturan.js : halaman pengaturan (notifikasi, tema, ubah password) */

const saklarNotif = $('#saklar-notif');


/* ---------- 1. Notifikasi ON / OFF ---------- */

saklarNotif.checked = localStorage.getItem('notif') !== 'off';

// tulisan ON / OFF di sebelah saklar
function tandaiNotif() {
  $('#label-notif').textContent = saklarNotif.checked ? 'ON' : 'OFF';
}

tandaiNotif();

saklarNotif.onchange = () => {
  tandaiNotif();
  if (saklarNotif.checked) {
    localStorage.setItem('notif', 'on');
    toast('Notifikasi dinyalakan.');
  } else {
    toast('Notifikasi dimatikan.');          // ditampilkan sebelum benar-benar dimatikan
    localStorage.setItem('notif', 'off');
  }
};


/* ---------- 2. Tema terang / gelap ---------- */

function tandaiTema() {
  const gelap = localStorage.getItem('tema') === 'dark';
  $('#tema-gelap').classList.toggle('active', gelap);
  $('#tema-terang').classList.toggle('active', !gelap);
}

$('#tema-terang').onclick = () => { setTema('light'); tandaiTema(); };
$('#tema-gelap').onclick = () => { setTema('dark'); tandaiTema(); };

tandaiTema();


/* ---------- 3. Ubah password ---------- */

$('#form-password').onsubmit = ev => {
  ev.preventDefault();
  const f = ev.target;

  if (f.lama.value !== user.password) return toast('Password lama salah.', true);
  if (f.baru.value !== f.konfirmasi.value) return toast('Konfirmasi password tidak sama.', true);

  user.password = f.baru.value;
  simpanUser();

  tutupModal('modal-password');
  f.reset();
  toast('Password berhasil diubah.');
};
