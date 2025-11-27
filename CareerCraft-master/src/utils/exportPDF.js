import html2pdf from "html2pdf.js";

export function exportResumePDF(elementId, fileName = "CareerCraft_Resume.pdf") {
  const element = document.getElementById(elementId);
  if (!element) return console.error("❌ Resume element not found");

  const opt = {
    margin: 0.3,
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf().from(element).set(opt).save();
}
