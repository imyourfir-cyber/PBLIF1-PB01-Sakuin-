/* profil.js : halaman profil (lihat, ubah data, ganti foto) */

const formProfil = $('#form-profil');
const FOTO_AWAL = '../assets/img/user_1.jpg';


/* ---------- 1. Tampilkan data ---------- */

function tampilkan() {
  const baris = [
    ['Nama', user.nama],
    ['Username', user.username],
    ['Email', user.email],
    ['NIM (opsional)', user.nim],
  ];

  $('#info-akun').innerHTML = baris.map(([label, isi]) => `
    <div class="d-flex justify-content-between py-2 border-bottom">
      <span class="text-body-secondary">${label}</span>
      <b>${amankan(isi || '-')}</b>
    </div>`).join('');
}

$('#foto-profil').src = user.foto || FOTO_AWAL;
tampilkan();


/* ---------- 2. Ubah profil ---------- */

function ubahProfil() {
  formProfil.nama.value = user.nama;
  formProfil.username.value = user.username;
  formProfil.email.value = user.email;
  formProfil.nim.value = user.nim;
  bukaModal('modal-profil');
}

formProfil.onsubmit = ev => {
  ev.preventDefault();

  user.nama = formProfil.nama.value.trim();
  user.email = formProfil.email.value.trim();
  user.nim = formProfil.nim.value.trim();
  simpanUser();

  $('#nama-user').textContent = user.nama;     // nama di topbar ikut berubah
  tampilkan();
  tutupModal('modal-profil');
  toast('Profil berhasil disimpan.');
};


/* ---------- 3. Ganti foto ---------- */

$('#input-foto').onchange = ev => {
  const file = ev.target.files[0];
  if (!file) return;

  // hanya JPEG, PNG, atau WebP dengan ukuran maksimal 2 MB
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return toast('Format foto harus JPEG, PNG, atau WebP.', true);
  }
  if (file.size > 2 * 1024 * 1024) return toast('Foto maksimal 2 MB.', true);

  // FileReader mengubah gambar menjadi teks (data URL) supaya bisa disimpan di localStorage
  const pembaca = new FileReader();

  pembaca.onload = () => {
    user.foto = pembaca.result;
    simpanUser();

    $('#foto-profil').src = user.foto;
    $('#foto-user').src = user.foto;            // foto di topbar ikut berubah
    toast('Foto profil berhasil diubah.');
  };

  pembaca.readAsDataURL(file);
};
