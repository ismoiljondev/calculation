import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function replaceUnsupportedColors(node: HTMLElement) {
  const elements = node.querySelectorAll<HTMLElement>("*");
  elements.forEach((el) => {
    const computed = window.getComputedStyle(el);
    const bg = computed.backgroundColor;
    if (bg.includes("oklch")) {
      el.style.backgroundColor = "#ffffff";
    }
    const color = computed.color;
    if (color.includes("oklch")) {
      el.style.color = "#000000";
    }
  });
}

export const usePdfDownload = () => {
  const downloadPdf = async (
    elementId: string,
    fileName = "document.pdf",
    setLoading?: (val: boolean) => void
  ) => {
    const input = document.getElementById(elementId);
    if (!input) return;

    replaceUnsupportedColors(input);
    setLoading?.(true);
    try {
      document.body.style.overflow = "hidden";
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(input, {
        scrollY: -window.scrollY,
        scale: 1.2,
        useCORS: true,
        height: input.scrollHeight,
        foreignObjectRendering: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
        if (heightLeft > 0) {
          pdf.addPage();
          position = -(imgHeight - heightLeft);
        }
      }

      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setLoading?.(false);
      document.body.style.overflow = "auto";
    }
  };

  return { downloadPdf };
};
