// =============================================
//  KALKULATOR PINTAR - script.js
//  Rico, Khosyi, Andy - Sistem Informasi
// =============================================

let riwayatSesi = [];
let storagePermanen = JSON.parse(localStorage.getItem("kalkulator_data")) || [];
let isLightMode = false;

// =============================================
//  LOADING SCREEN
// =============================================
window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  setTimeout(() => {
    loader.classList.add("loader-hidden");
  }, 2000);
});

// =============================================
//  THEME TOGGLE
// =============================================
function toggleTheme() {
  isLightMode = !isLightMode;
  const body = document.body;
  const icon = document.getElementById("themeIcon");
  if (isLightMode) {
    body.classList.add("light-mode");
    icon.className = "fa-solid fa-moon";
  } else {
    body.classList.remove("light-mode");
    icon.className = "fa-solid fa-sun";
  }
  localStorage.setItem("theme", isLightMode ? "light" : "dark");
}

// Restore tema dari localStorage
(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    isLightMode = true;
    document.body.classList.add("light-mode");
    window.addEventListener("DOMContentLoaded", () => {
      const icon = document.getElementById("themeIcon");
      if (icon) icon.className = "fa-solid fa-moon";
    });
  }
})();

// =============================================
//  NOTIFIKASI
// =============================================
function tampilkanNotif(pesan, tipe = "success") {
  const notif = document.getElementById("custom-notification");
  notif.innerText = pesan;
  notif.className = `notif-show ${tipe === "success" ? "notif-success" : "notif-error"}`;
  setTimeout(() => {
    notif.classList.remove("notif-show");
  }, 3000);
}

// =============================================
//  MODAL
// =============================================
const modal = document.getElementById("customModal");
const confirmBtn = document.getElementById("confirmDeleteBtn");

function openModal() {
  if (storagePermanen.length === 0) {
    tampilkanNotif("Storage memang sudah kosong!", "error");
    return;
  }
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
}

confirmBtn.onclick = function () {
  storagePermanen = [];
  localStorage.removeItem("kalkulator_data");
  renderStorage();
  closeModal();
  tampilkanNotif("Storage telah dikosongkan!", "success");
};

// =============================================
//  FUNGSI HITUNG
// =============================================
function hitung(operasi) {
  const a = parseFloat(document.getElementById("angka1").value);
  const b = parseFloat(document.getElementById("angka2").value);
  const display = document.getElementById("displayHasil");
  const opSymbol = document.getElementById("opSymbol");

  // Efek suara
  const audio = document.getElementById("clickSound");
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  // Validasi input
  if (isNaN(a) || isNaN(b)) {
    efekError();
    tampilkanNotif("Masukkan angka dulu!", "error");
    return;
  }

  let total = 0;
  let simbol = "";

  switch (operasi) {
    case "tambah":
      total = a + b;
      simbol = "+";
      break;
    case "kurang":
      total = a - b;
      simbol = "-";
      break;
    case "kali":
      total = a * b;
      simbol = "×";
      break;
    case "bagi":
      if (b === 0) {
        efekError();
        tampilkanNotif("Tidak bisa dibagi nol!", "error");
        return;
      }
      total = a / b;
      simbol = "÷";
      break;
  }

  opSymbol.innerText = simbol;

  // Format hasil: integer atau max 4 desimal
  const hasilFormat = Number.isInteger(total) ? total : parseFloat(total.toFixed(4));
  display.innerText = hasilFormat;
  display.classList.remove("error-flash");

  // Simpan ke riwayat sesi
  riwayatSesi.push(`${a} ${simbol} ${b} = ${hasilFormat}`);
  updateUI();
}

// =============================================
//  EFEK ERROR
// =============================================
function efekError() {
  const card = document.querySelector(".kalkulator-card");
  const display = document.getElementById("displayHasil");
  display.classList.add("error-flash");
  card.style.animation = "none";
  card.offsetHeight; // reflow trigger
  card.style.animation = "shake 0.5s ease, floating 6s ease-in-out 0.5s infinite";
}

// =============================================
//  UPDATE UI RIWAYAT SESI
// =============================================
function updateUI() {
  const daftar = document.getElementById("daftarRiwayat");
  daftar.innerHTML = riwayatSesi
    .map((item) => `<li>${item} <i class="fa-solid fa-check"></i></li>`)
    .reverse()
    .join("");
}

// =============================================
//  SIMPAN KE STORAGE
// =============================================
function simpanKeStorage() {
  if (riwayatSesi.length === 0) {
    tampilkanNotif("Belum ada riwayat baru!", "error");
    return;
  }
  storagePermanen = [...storagePermanen, ...riwayatSesi];
  localStorage.setItem("kalkulator_data", JSON.stringify(storagePermanen));
  riwayatSesi = [];
  updateUI();
  renderStorage();
  tampilkanNotif("Berhasil disimpan ke storage!");
}

// =============================================
//  PANEL STORAGE (BUKA / TUTUP)
// =============================================
function toggleSavedPanel() {
  document.getElementById("savedPanel").classList.toggle("active");
  renderStorage();
}

// =============================================
//  RENDER STORAGE
// =============================================
function renderStorage() {
  const daftar = document.getElementById("daftarSaved");
  if (storagePermanen.length === 0) {
    daftar.innerHTML = "<li style='opacity:0.5; border:none;'>Storage Kosong</li>";
    return;
  }
  daftar.innerHTML = storagePermanen
    .map((item) => `<li>${item}</li>`)
    .reverse()
    .join("");
}

// =============================================
//  RESET KALKULATOR
// =============================================
function resetKalkulator() {
  document.getElementById("angka1").value = "";
  document.getElementById("angka2").value = "";
  document.getElementById("displayHasil").innerText = "0";
  document.getElementById("opSymbol").innerText = "?";
}

// =============================================
//  HAPUS RIWAYAT SESI
// =============================================
function hapusRiwayat() {
  riwayatSesi = [];
  updateUI();
  tampilkanNotif("Riwayat sesi dihapus!", "success");
}

// =============================================
//  INISIALISASI
// =============================================
renderStorage();