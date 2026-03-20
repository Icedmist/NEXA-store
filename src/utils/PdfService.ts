import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateBrandedPdf = (
  title: string,
  headers: string[],
  data: any[][],
  filename: string,
  subtitle?: string
) => {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.width;

  console.log('Starting PDF generation for:', title);

  // Add Branding Header
  doc.setFillColor(15, 15, 20); // Deep dark
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Nexa Logo Text
  doc.setTextColor(99, 102, 241); // Primary Indigo (#6366f1)
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NX', 20, 25);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('Nexa Retail Hub', 35, 25);

  // Report Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(title.toUpperCase(), pageWidth - 20, 25, { align: 'right' });

  // Date
  doc.setFontSize(8);
  doc.text(new Date().toLocaleDateString(), pageWidth - 20, 32, { align: 'right' });

  // Add content
  if (subtitle) {
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(subtitle, 20, 55);
  }

  // Generate Table using standalone function for compatibility with v5+
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: subtitle ? 60 : 50,
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [50, 50, 50]
    },
    alternateRowStyles: {
      fillColor: [245, 247, 255]
    },
    margin: { top: 20 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} - Nexa Retail Hub Branded Report`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(`${filename}.pdf`);
};
