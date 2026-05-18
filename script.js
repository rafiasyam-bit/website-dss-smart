// =====================================================
// RESET SAAT REFRESH
// =====================================================

if (performance.navigation.type === 1) {
  sessionStorage.clear();
}
// =====================================================
// FILE : script.js
// DSS SMART SYSTEM
// =====================================================

// =====================================================
// INPUT PAGE
// =====================================================

const inputPage = document.getElementById("input-page");

if (inputPage) {
  // =========================
  // AMBIL SEMUA INPUT
  // =========================

  const inputs = document.querySelectorAll("input");

  // =====================================================
  // AMBIL DATA SESSION
  // =====================================================

  const savedData = JSON.parse(sessionStorage.getItem("nilaiEkskul"));

  // =====================================================
  // TAMPILKAN DATA JIKA ADA
  // =====================================================

  if (savedData) {
    // BASKET
    inputs[0].value = savedData.basket.minat;
    inputs[1].value = savedData.basket.bakat;
    inputs[2].value = savedData.basket.waktu;
    inputs[3].value = savedData.basket.prestasi;

    // VOLLY
    inputs[4].value = savedData.volly.minat;
    inputs[5].value = savedData.volly.bakat;
    inputs[6].value = savedData.volly.waktu;
    inputs[7].value = savedData.volly.prestasi;

    // AIKIDO
    inputs[8].value = savedData.aikido.minat;
    inputs[9].value = savedData.aikido.bakat;
    inputs[10].value = savedData.aikido.waktu;
    inputs[11].value = savedData.aikido.prestasi;

    // FUTSAL
    inputs[12].value = savedData.futsal.minat;
    inputs[13].value = savedData.futsal.bakat;
    inputs[14].value = savedData.futsal.waktu;
    inputs[15].value = savedData.futsal.prestasi;
  }

  // =====================================================
  // AUTO SAVE INPUT
  // =====================================================

  document.addEventListener("input", function () {
    const autoSaveData = {
      basket: {
        minat: parseFloat(inputs[0].value) || 0,
        bakat: parseFloat(inputs[1].value) || 0,
        waktu: parseFloat(inputs[2].value) || 0,
        prestasi: parseFloat(inputs[3].value) || 0,
      },

      volly: {
        minat: parseFloat(inputs[4].value) || 0,
        bakat: parseFloat(inputs[5].value) || 0,
        waktu: parseFloat(inputs[6].value) || 0,
        prestasi: parseFloat(inputs[7].value) || 0,
      },

      aikido: {
        minat: parseFloat(inputs[8].value) || 0,
        bakat: parseFloat(inputs[9].value) || 0,
        waktu: parseFloat(inputs[10].value) || 0,
        prestasi: parseFloat(inputs[11].value) || 0,
      },

      futsal: {
        minat: parseFloat(inputs[12].value) || 0,
        bakat: parseFloat(inputs[13].value) || 0,
        waktu: parseFloat(inputs[14].value) || 0,
        prestasi: parseFloat(inputs[15].value) || 0,
      },
    };

    // SIMPAN INPUT SEMENTARA
    sessionStorage.setItem("nilaiEkskul", JSON.stringify(autoSaveData));
  });

  // =====================================================
  // BUTTON PROSES
  // =====================================================

  const prosesButton = document.getElementById("proses-btn");

  prosesButton.addEventListener("click", function () {
    // =========================
    // AMBIL DATA INPUT
    // =========================

    const data = {
      basket: {
        minat: parseFloat(inputs[0].value) || 0,
        bakat: parseFloat(inputs[1].value) || 0,
        waktu: parseFloat(inputs[2].value) || 0,
        prestasi: parseFloat(inputs[3].value) || 0,
      },

      volly: {
        minat: parseFloat(inputs[4].value) || 0,
        bakat: parseFloat(inputs[5].value) || 0,
        waktu: parseFloat(inputs[6].value) || 0,
        prestasi: parseFloat(inputs[7].value) || 0,
      },

      aikido: {
        minat: parseFloat(inputs[8].value) || 0,
        bakat: parseFloat(inputs[9].value) || 0,
        waktu: parseFloat(inputs[10].value) || 0,
        prestasi: parseFloat(inputs[11].value) || 0,
      },

      futsal: {
        minat: parseFloat(inputs[12].value) || 0,
        bakat: parseFloat(inputs[13].value) || 0,
        waktu: parseFloat(inputs[14].value) || 0,
        prestasi: parseFloat(inputs[15].value) || 0,
      },
    };

    // =====================================================
    // PROSES SMART
    // =====================================================

    const alternatif = [
      {
        nama: "Basket",
        ...data.basket,
      },

      {
        nama: "Volly",
        ...data.volly,
      },

      {
        nama: "Aikido",
        ...data.aikido,
      },

      {
        nama: "Futsal",
        ...data.futsal,
      },
    ];

    // =====================================================
    // TOTAL KRITERIA
    // =====================================================

    let totalMinat = 0;
    let totalBakat = 0;
    let totalWaktu = 0;
    let totalPrestasi = 0;

    alternatif.forEach((item) => {
      totalMinat += item.minat;
      totalBakat += item.bakat;
      totalWaktu += item.waktu;
      totalPrestasi += item.prestasi;
    });

    // =====================================================
    // NORMALISASI + UTILITY
    // =====================================================

    const hasilSMART = alternatif.map((item) => {
      const nMinat = totalMinat === 0 ? 0 : item.minat / totalMinat;

      const nBakat = totalBakat === 0 ? 0 : item.bakat / totalBakat;

      const nWaktu = totalWaktu === 0 ? 0 : item.waktu / totalWaktu;

      const nPrestasi = totalPrestasi === 0 ? 0 : item.prestasi / totalPrestasi;

      // =========================
      // UTILITY
      // =========================

      const utility = nMinat + nBakat + nWaktu + nPrestasi;

      return {
        nama: item.nama,

        minat: nMinat.toFixed(2),

        bakat: nBakat.toFixed(2),

        waktu: nWaktu.toFixed(2),

        prestasi: nPrestasi.toFixed(2),

        utility: utility.toFixed(2),
      };
    });

    // =====================================================
    // SORTING RANKING
    // =====================================================

    hasilSMART.sort((a, b) => {
      return b.utility - a.utility;
    });

    // =====================================================
    // SIMPAN HASIL
    // =====================================================

    sessionStorage.setItem("hasilSMART", JSON.stringify(hasilSMART));

    // =====================================================
    // PINDAH HALAMAN
    // =====================================================

    window.location.href = "perhitungan.html";
  });
}

// =====================================================
// PAGE HASIL PERHITUNGAN
// =====================================================

const hasilPage = document.getElementById("hasil-page");

if (hasilPage) {
  // =========================
  // AMBIL HASIL
  // =========================

  const hasil = JSON.parse(sessionStorage.getItem("hasilSMART"));

  const tbody = document.getElementById("hasil-body");

  // =====================================================
  // JIKA ADA HASIL
  // =====================================================

  if (hasil && hasil.length > 0) {
    tbody.innerHTML = "";

    hasil.forEach((item) => {
      tbody.innerHTML += `

        <tr>

          <td>${item.nama}</td>

          <td>${item.minat}</td>

          <td>${item.bakat}</td>

          <td>${item.waktu}</td>

          <td>${item.prestasi}</td>

          <td class="utility-value">
            ${item.utility}
          </td>

        </tr>

      `;
    });
  }
}

// =====================================================
// PAGE REKOMENDASI
// =====================================================

const rekomendasiPage = document.getElementById("rekomendasi-page");

if (rekomendasiPage) {
  // =========================
  // AMBIL HASIL
  // =========================

  const hasil = JSON.parse(sessionStorage.getItem("hasilSMART"));

  // =====================================================
  // JIKA ADA HASIL
  // =====================================================

  if (hasil && hasil.length > 0) {
    // =========================
    // NAMA REKOMENDASI
    // =========================

    document.getElementById("nama-rekomendasi").innerText = hasil[0].nama;

    // =========================
    // NILAI UTILITY
    // =========================

    document.getElementById("nilai-utility").innerText = hasil[0].utility;

    // =========================
    // DESKRIPSI
    // =========================

    document.getElementById("deskripsi-rekomendasi").innerText =
      `Berdasarkan hasil perhitungan metode SMART, 
      ${hasil[0].nama} menjadi rekomendasi terbaik 
      karena memiliki nilai utility tertinggi 
      dibandingkan alternatif lainnya.`;
  }
}
