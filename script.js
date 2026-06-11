// =========================
// DATA DEFAULT EKSKUL
// =========================
// =========================
// RESET DATA SAAT REFRESH
// =========================

const navEntries = performance.getEntriesByType("navigation");

if (navEntries.length > 0 && navEntries[0].type === "reload") {
  sessionStorage.removeItem("nilaiEkskul");

  sessionStorage.removeItem("hasilSMART");
}
const DEFAULT_EKSKUL = ["Basket", "Volly", "Aikido", "Futsal"];

// =========================
// LOAD DATA EKSKUL
// =========================

function getEkskulList() {
  let ekskul = JSON.parse(localStorage.getItem("daftarEkskul"));

  if (!ekskul) {
    ekskul = DEFAULT_EKSKUL;

    localStorage.setItem("daftarEkskul", JSON.stringify(ekskul));
  }

  return ekskul;
}

// =========================
// SIMPAN DATA EKSKUL
// =========================

function saveEkskulList(data) {
  localStorage.setItem("daftarEkskul", JSON.stringify(data));
}

// =========================
// LOAD NILAI SEMENTARA
// =========================

function getNilaiData() {
  return JSON.parse(sessionStorage.getItem("nilaiEkskul")) || {};
}

// =========================
// SIMPAN NILAI SEMENTARA
// =========================

function saveNilaiData(data) {
  sessionStorage.setItem("nilaiEkskul", JSON.stringify(data));
}

// =========================
// RENDER TABEL INPUT
// =========================

function renderInputTable() {
  const tbody = document.getElementById("ekskul-body");

  if (!tbody) return;

  const ekskulList = getEkskulList();
  const nilaiData = getNilaiData();

  tbody.innerHTML = "";

  ekskulList.forEach((nama) => {
    const data = nilaiData[nama] || {
      minat: "",
      bakat: "",
      waktu: "",
      prestasi: "",
    };

    tbody.innerHTML += `
      <tr>

        <td>
          ${nama}
        </td>

        <td>
          <input
            type="number"
            min="1"
            max="5"
            value="${data.minat}"
            onchange="updateNilai('${nama}','minat',this.value)"
          >
        </td>

        <td>
          <input
            type="number"
            min="1"
            max="5"
            value="${data.bakat}"
            onchange="updateNilai('${nama}','bakat',this.value)"
          >
        </td>

        <td>
          <input
            type="number"
            min="1"
            max="5"
            value="${data.waktu}"
            onchange="updateNilai('${nama}','waktu',this.value)"
          >
        </td>

        <td>
          <input
            type="number"
            min="1"
            max="5"
            value="${data.prestasi}"
            onchange="updateNilai('${nama}','prestasi',this.value)"
          >
        </td>

        <td>
          <button
            type="button"
            onclick="hapusEkskul('${nama}')"
          >
            Hapus
          </button>
        </td>

      </tr>
    `;
  });
}

// =========================
// UPDATE NILAI
// =========================

function updateNilai(nama, field, value) {
  let nilai = Number(value);

  if (value === "") {
    nilai = "";
  } else {
    if (nilai < 1) {
      nilai = 1;
    }

    if (nilai > 5) {
      nilai = 5;
    }
  }

  const data = getNilaiData();

  if (!data[nama]) {
    data[nama] = {
      minat: "",
      bakat: "",
      waktu: "",
      prestasi: "",
    };
  }

  data[nama][field] = nilai;

  saveNilaiData(data);

  renderInputTable();
}

// =========================
// TAMBAH EKSKUL
// =========================

function tambahEkskul() {
  const nama = prompt("Masukkan nama ekstrakurikuler:");

  if (!nama) return;

  const ekskulList = getEkskulList();

  if (ekskulList.includes(nama)) {
    alert("Ekskul sudah ada!");

    return;
  }

  ekskulList.push(nama);

  saveEkskulList(ekskulList);

  renderInputTable();
}

// =========================
// HAPUS EKSKUL
// =========================

function hapusEkskul(nama) {
  if (!confirm(`Hapus ${nama}?`)) return;

  let ekskulList = getEkskulList();

  ekskulList = ekskulList.filter((item) => item !== nama);

  saveEkskulList(ekskulList);

  const nilaiData = getNilaiData();

  delete nilaiData[nama];

  saveNilaiData(nilaiData);

  renderInputTable();
}

// =========================
// INIT INPUT PAGE
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const tambahBtn = document.getElementById("tambah-ekskul");

  if (tambahBtn) {
    renderInputTable();

    tambahBtn.addEventListener("click", tambahEkskul);

    const prosesBtn = document.getElementById("proses-btn");

    if (prosesBtn) {
      prosesBtn.addEventListener("click", prosesSMART);
    }
  }
  tampilkanHasilSMART();
  tampilkanRekomendasi();
  tampilkanGrafik();
  tampilkanRankingCard();
});

// =========================
// BOBOT SMART
// =========================

const BOBOT = {
  minat: 0.3,
  bakat: 0.3,
  waktu: 0.2,
  prestasi: 0.2,
};

// =========================
// PROSES SMART
// =========================

function prosesSMART() {
  const nilaiData = getNilaiData();

  const ekskulList = getEkskulList();

  if (ekskulList.length === 0) {
    alert("Belum ada ekstrakurikuler!");

    return;
  }

  // =========================
  // VALIDASI INPUT
  // =========================

  const dataBelumLengkap = [];

  for (const nama of ekskulList) {
    if (
      !nilaiData[nama] ||
      nilaiData[nama].minat === "" ||
      nilaiData[nama].bakat === "" ||
      nilaiData[nama].waktu === "" ||
      nilaiData[nama].prestasi === ""
    ) {
      dataBelumLengkap.push(nama);
    }
  }
  if (dataBelumLengkap.length > 0) {
    alert(
      "Data berikut belum lengkap:\n\n" +
        dataBelumLengkap.join("\n") +
        "\n\nSilakan lengkapi terlebih dahulu.",
    );

    return;

    const d = nilaiData[nama];

    const daftarNilai = [
      Number(d.minat),
      Number(d.bakat),
      Number(d.waktu),
      Number(d.prestasi),
    ];

    for (const nilai of daftarNilai) {
      if (nilai < 1 || nilai > 5) {
        alert(`Semua nilai harus berada pada rentang 1 sampai 5.`);

        return;
      }
    }
  }

  // Cari nilai maksimum

  let maxMinat = 0;
  let maxBakat = 0;
  let maxWaktu = 0;
  let maxPrestasi = 0;

  ekskulList.forEach((nama) => {
    const d = nilaiData[nama];

    maxMinat = Math.max(maxMinat, Number(d.minat));

    maxBakat = Math.max(maxBakat, Number(d.bakat));

    maxWaktu = Math.max(maxWaktu, Number(d.waktu));

    maxPrestasi = Math.max(maxPrestasi, Number(d.prestasi));
  });

  const hasil = [];

  ekskulList.forEach((nama) => {
    const d = nilaiData[nama];

    const minat = Number(d.minat) / maxMinat;

    const bakat = Number(d.bakat) / maxBakat;

    const waktu = Number(d.waktu) / maxWaktu;

    const prestasi = Number(d.prestasi) / maxPrestasi;

    const utility =
      minat * BOBOT.minat +
      bakat * BOBOT.bakat +
      waktu * BOBOT.waktu +
      prestasi * BOBOT.prestasi;

    hasil.push({
      nama,

      minat: minat.toFixed(2),

      bakat: bakat.toFixed(2),

      waktu: waktu.toFixed(2),

      prestasi: prestasi.toFixed(2),

      utility: utility.toFixed(2),
    });
  });

  hasil.sort((a, b) => b.utility - a.utility);

  sessionStorage.setItem("hasilSMART", JSON.stringify(hasil));

  window.location.href = "perhitungan.html";
}

// =========================
// TAMPILKAN HASIL SMART
// =========================

function tampilkanHasilSMART() {
  const tbody = document.getElementById("hasil-body");

  if (!tbody) return;

  const hasil = JSON.parse(sessionStorage.getItem("hasilSMART"));

  if (!hasil || hasil.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          Belum ada data perhitungan
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML = "";

  hasil.forEach((item) => {
    tbody.innerHTML += `
      <tr>

        <td>${item.nama}</td>

        <td>${item.minat}</td>

        <td>${item.bakat}</td>

        <td>${item.waktu}</td>

        <td>${item.prestasi}</td>

        <td>${item.utility}</td>

      </tr>
    `;
  });
}

// =========================
// HALAMAN REKOMENDASI
// =========================

function tampilkanRekomendasi() {
  const namaEl = document.getElementById("nama-rekomendasi");

  const utilityEl = document.getElementById("nilai-utility");

  const deskripsiEl = document.getElementById("deskripsi-rekomendasi");

  if (!namaEl || !utilityEl || !deskripsiEl) {
    return;
  }

  const hasil = JSON.parse(sessionStorage.getItem("hasilSMART"));

  if (!hasil || hasil.length === 0) {
    namaEl.textContent = "Belum Ada Hasil";

    utilityEl.textContent = "0.00";

    deskripsiEl.textContent =
      "Silakan lakukan proses perhitungan terlebih dahulu untuk mendapatkan rekomendasi ekstrakurikuler terbaik.";

    return;
  }

  const terbaik = hasil[0];

  namaEl.textContent = terbaik.nama;

  utilityEl.textContent = terbaik.utility;

  deskripsiEl.textContent = `${terbaik.nama} memiliki nilai utility tertinggi sehingga direkomendasikan sebagai pilihan terbaik berdasarkan metode SMART.`;
}

// =========================
// GRAFIK UTILITY
// =========================

// =========================
// GRAFIK RANKING UTILITY
// =========================

let utilityChart = null;

function tampilkanGrafik() {
  const canvas = document.getElementById("utilityChart");

  if (!canvas) return;

  const hasil = JSON.parse(sessionStorage.getItem("hasilSMART"));

  if (!hasil || hasil.length === 0) {
    canvas.parentElement.innerHTML = `
      <h2>Grafik Ranking Utility</h2>

      <p class="chart-empty">
        Belum ada data grafik
      </p>
    `;

    return;
  }

  const labels = hasil.map((item, index) => {
    let rank = `${index + 1}`;

    if (index === 0) rank = "🥇";
    if (index === 1) rank = "🥈";
    if (index === 2) rank = "🥉";

    return `${rank} ${item.nama}`;
  });

  const utilities = hasil.map((item) => parseFloat(item.utility));

  const warna = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
    "#f97316",
    "#14b8a6",
  ];

  if (utilityChart) {
    utilityChart.destroy();
  }

  utilityChart = new Chart(canvas, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Nilai Utility",

          data: utilities,

          backgroundColor: utilities.map(
            (_, index) => warna[index % warna.length],
          ),

          borderRadius: 12,

          borderSkipped: false,
        },
      ],
    },

    options: {
      indexAxis: "y",

      responsive: true,

      maintainAspectRatio: false,

      animation: {
        duration: 1500,
      },

      plugins: {
        legend: {
          display: false,
        },

        title: {
          display: true,

          text: "Ranking Utility Ekstrakurikuler",

          font: {
            size: 18,
          },
        },
      },

      scales: {
        x: {
          beginAtZero: true,

          max: 1,
        },
      },
    },
  });
}

// =========================
// CARD RANKING
// =========================

function tampilkanRankingCard() {
  const container = document.getElementById("ranking-card");

  if (!container) return;

  const hasil = JSON.parse(sessionStorage.getItem("hasilSMART"));

  if (!hasil) return;

  container.innerHTML = "";

  hasil.slice(0, 3).forEach((item, index) => {
    const medal = ["🥇", "🥈", "🥉"];

    container.innerHTML += `
        <div class="rank-card">

          <div class="rank-medal">
            ${medal[index]}
          </div>

          <div>

            <h3>${item.nama}</h3>

            <p>
              Utility :
              ${item.utility}
            </p>

          </div>

        </div>
      `;
  });
}

// =========================
// HAMBURGER MENU
// =========================

const menuToggle = document.getElementById("menu-toggle");
const navbarMenu = document.getElementById("navbar-menu");

if (menuToggle && navbarMenu) {
  menuToggle.addEventListener("click", () => {
    navbarMenu.classList.toggle("active");

    if (navbarMenu.classList.contains("active")) {
      menuToggle.innerHTML = "✕";
    } else {
      menuToggle.innerHTML = "☰";
    }
  });
}
