import html2pdf from "html2pdf.js";

export const downloadPDF = (elementId, filename) => {
    const element = document.querySelector(elementId);
    
    if (!element) {
        console.error("Elemento no encontrado:", elementId);
        return;
    }

    const options = {
        margin: 10, // Márgenes superior, izquierdo, inferior, derecho
        filename: filename,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
            scale: 3, // Escala más alta para mejor calidad y capturar el ancho
            useCORS: true,
        },
        jsPDF: {
            unit: "mm",
            format: "a4", // Cambiar a 'a3' o 'letter' si es necesario
            orientation: "portrait", // Cambiar a 'portrait' si necesitas vertical
        },
    };

    html2pdf().set(options).from(element).save();
};
