let riwayatSesi = [];
let storagePermanen = JSON.parse(localStorage.getItem("kalkulator_data")) || [];

// --- LOADING SCREEN HANDLER ---
window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");
    setTimeout(() => {
        loader.classList.add("loader-hidden");
    }, 2000); 
});

// 1. Fungsi Notifikasi
function tampilkanNotif(pesan, tipe = "success") {
    const notif = document.getElementById("custom-notification");
    notif.innerText = pesan;
    notif.className = `notif-show ${tipe === 'success' ? 'notif-success' : 'notif-error'}`;
    setTimeout(() => notif.classList.remove("notif-show"), 3000);
}

// 2. Kontrol Modal Custom
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

confirmBtn.onclick = function() {
    storagePermanen = [];
    localStorage.removeItem("kalkulator_data");
    renderStorage();
    closeModal();
    tampilkanNotif("Storage telah dikosongkan!", "success");
}

// 3. Fungsi Hitung Utama
function hitung(operasi) {
    const a = parseFloat(document.getElementById("angka1").value);
    const b = parseFloat(document.getElementById("angka2").value);
    const display = document.getElementById("displayHasil");
    const opSymbol = document.getElementById("opSymbol");
    
    const audio = document.getElementById("clickSound");
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }

    if (isNaN(a) || isNaN(b)) {
        efekError();
        tampilkanNotif("Masukkan angka dulu!", "error");
        return;
    }

    let total = 0, simbol = "";
    switch(operasi) {
        case 'tambah': total = a + b; simbol = "+"; break;
        case 'kurang': total = a - b; simbol = "-"; break;
        case 'kali': total = a * b; simbol = "×"; break;
        case 'bagi': 
            if (b === 0) { efekError(); tampilkanNotif("Tidak bisa dibagi nol!", "error"); return; }
            total = a / b; simbol = "÷"; break;
    }

    opSymbol.innerText = simbol;
    const hasilFormat = Number.isInteger(total) ? total : total.toFixed(2);
    display.innerText = hasilFormat;
    display.classList.remove("error-flash");

    riwayatSesi.push(`${a} ${simbol} ${b} = ${hasilFormat}`);
    updateUI();
}

function efekError() {
    const card = document.querySelector('.kalkulator-card');
    const display = document.getElementById("displayHasil");
    display.classList.add("error-flash");
    card.style.animation = "none";
    card.offsetHeight; 
    card.style.animation = "shake 0.5s, floating 6s ease-in-out infinite";
}

function updateUI() {
    const daftar = document.getElementById("daftarRiwayat");
    daftar.innerHTML = riwayatSesi.map(item => `<li>${item} <i class="fa-solid fa-check" style="color:var(--accent)"></i></li>`).reverse().join('');
}

function simpanKeStorage() {
    if (riwayatSesi.length === 0) { tampilkanNotif("Belum ada riwayat baru!", "error"); return; }
    storagePermanen = [...storagePermanen, ...riwayatSesi];
    localStorage.setItem("kalkulator_data", JSON.stringify(storagePermanen));
    riwayatSesi = [];
    updateUI();
    renderStorage();
    tampilkanNotif("Berhasil disimpan ke storage!");
}

function toggleSavedPanel() {
    document.getElementById("savedPanel").classList.toggle("active");
    renderStorage();
}

function renderStorage() {
    const daftar = document.getElementById("daftarSaved");
    if (storagePermanen.length === 0) {
        daftar.innerHTML = "<li style='opacity:0.5; border:none;'>Storage Kosong</li>";
        return;
    }
    daftar.innerHTML = storagePermanen.map(item => `<li>${item}</li>`).reverse().join('');
}

function resetKalkulator() {
    document.getElementById("angka1").value = "";
    document.getElementById("angka2").value = "";
    document.getElementById("displayHasil").innerText = "0";
    document.getElementById("opSymbol").innerText = "?";
}

function hapusRiwayat() {
    riwayatSesi = [];
    updateUI();
}

renderStorage();