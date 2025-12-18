// Set tahun di footer otomatis
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

function hitungCC(bore, stroke, cylinders) {
  const volumePerCylinder = (Math.PI / 4) * bore * bore * stroke;
  const totalVolumeMm3 = volumePerCylinder * cylinders;
  return totalVolumeMm3 / 1000;
}

function tentukanTipeMesin(bore, stroke) {
  const tolerance = 0.5;
  if (bore - stroke > tolerance) {
    return { type: "Overbore (Short Stroke)", detail: "Bore > stroke — karakter putaran atas (RPM tinggi)." };
  } else if (stroke - bore > tolerance) {
    return { type: "Overstroke (Long Stroke)", detail: "Stroke > bore — torsi bawah/menengah kuat." };
  } else {
    return { type: "Square", detail: "Bore ≈ stroke — karakter seimbang." };
  }
}

/* Kalkulator (hanya aktif jika elemen ada di halaman) */
const form = document.getElementById("ccForm");
const resultBox = document.getElementById("result");
const ccValueSpan = document.getElementById("ccValue");
const engineTypeSpan = document.getElementById("engineType");
const detailText = document.getElementById("detailText");
const videoLinkEl = document.getElementById("videoLink");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const bore = parseFloat(document.getElementById("bore").value);
    const stroke = parseFloat(document.getElementById("stroke").value);
    const cylinders = parseInt(document.getElementById("cylinders").value, 10);

    if (isNaN(bore) || isNaN(stroke) || isNaN(cylinders) || cylinders <= 0) {
      alert("Mohon isi semua data dengan benar.");
      return;
    }

    const cc = hitungCC(bore, stroke, cylinders);
    const ccRounded = cc.toFixed(1);
    const info = tentukanTipeMesin(bore, stroke);

    if (ccValueSpan) ccValueSpan.textContent = ccRounded;
    if (engineTypeSpan) engineTypeSpan.textContent = info.type;
    if (detailText) detailText.textContent = info.detail;

    // Tampilkan link YouTube sesuai tipe (ganti link jika ingin video spesifik)
    let url = "";
    if (info.type.includes("Overbore")) url = "https://www.youtube.com/results?search_query=overbore+engine";
    else if (info.type.includes("Overstroke")) url = "https://www.youtube.com/results?search_query=overstroke+engine";
    else url = "https://www.youtube.com/results?search_query=square+engine";

    if (videoLinkEl) {
      videoLinkEl.innerHTML = `<strong>Video terkait:</strong> <a href="${url}" target="_blank" rel="noopener noreferrer">Buka di YouTube</a>`;
    }

    if (resultBox) resultBox.classList.remove("hidden");
  });
}

/* Simulasi */
const simForm = document.getElementById("simForm");
const simResultBox = document.getElementById("simResult");
const simCcOriginalSpan = document.getElementById("simCcOriginal");
const simTypeOriginalSpan = document.getElementById("simTypeOriginal");
const simCcNewSpan = document.getElementById("simCcNew");
const simTypeNewSpan = document.getElementById("simTypeNew");
const simDetailText = document.getElementById("simDetailText");

if (simForm) {
  simForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const baseBore = parseFloat(document.getElementById("baseBore").value);
    const baseStroke = parseFloat(document.getElementById("baseStroke").value);
    const simCylinders = parseInt(document.getElementById("simCylinders").value, 10);
    const deltaBore = parseFloat(document.getElementById("deltaBore").value);
    const deltaStroke = parseFloat(document.getElementById("deltaStroke").value);
    const simName = document.getElementById("simName").value.trim();

    if (isNaN(baseBore) || isNaN(baseStroke) || isNaN(simCylinders) || isNaN(deltaBore) || isNaN(deltaStroke) || simCylinders <= 0) {
      alert("Mohon isi data simulasi dengan benar.");
      return;
    }

    const newBore = baseBore + deltaBore;
    const newStroke = baseStroke + deltaStroke;

    if (newBore <= 0 || newStroke <= 0) { alert("Hasil bore/stroke tidak boleh <= 0"); return; }

    const ccOriginal = hitungCC(baseBore, baseStroke, simCylinders);
    const ccNew = hitungCC(newBore, newStroke, simCylinders);

    const infoOriginal = tentukanTipeMesin(baseBore, baseStroke);
    const infoNew = tentukanTipeMesin(newBore, newStroke);

    if (simCcOriginalSpan) simCcOriginalSpan.textContent = ccOriginal.toFixed(1);
    if (simTypeOriginalSpan) simTypeOriginalSpan.textContent = infoOriginal.type;
    if (simCcNewSpan) simCcNewSpan.textContent = ccNew.toFixed(1);
    if (simTypeNewSpan) simTypeNewSpan.textContent = infoNew.type;

    if (simDetailText) {
      const deltaCc = (ccNew - ccOriginal).toFixed(1);
      const naikTurun = ccNew >= ccOriginal ? "naik" : "turun";
      simDetailText.textContent = `Perubahan menghasilkan ${naikTurun} sekitar ${Math.abs(deltaCc)} cc. Tipe mesin: ${infoOriginal.type} → ${infoNew.type}. ${simName ? "Nama: "+simName : ""}`;
    }

    if (simResultBox) simResultBox.classList.remove("hidden");
  });
}

