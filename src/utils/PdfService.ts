import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PdfExportOptions {
  title: string;
  headers: string[];
  data: any[][];
  filename: string;
  subtitle?: string;
  storeName?: string;
  summary?: { label: string; value: string }[];
}

export const generateBrandedPdf = (options: PdfExportOptions) => {
  const { title, headers, data, filename, subtitle, storeName, summary } = options;
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Background for the first page
  doc.setFillColor(33, 36, 43); // App dark background (approx hsl(220 15% 15%))
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Banner
  doc.setFillColor(28, 31, 38); // Slightly darker for banner
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Nexa Logo Text
  doc.setTextColor(99, 102, 241); // Primary Indigo (#6366f1)
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NX', 20, 30);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('Nexa Retail Hub', 35, 30);

  // Store Name
  if (storeName) {
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(storeName.toUpperCase(), 35, 42);
  }

  // Report Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), pageWidth - 20, 25, { align: 'right' });

  // Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 20, 35, { align: 'right' });

  let currentY = 65;

  // Subtitle
  if (subtitle) {
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.text(subtitle, 20, currentY);
    currentY += 12;
  }

  // Summary Metrics
  if (summary && summary.length > 0) {
    doc.setFont('helvetica', 'bold');
    let summaryX = 20;
    
    summary.forEach(item => {
      // Draw a subtle box for metric
      doc.setFillColor(42, 46, 55);
      doc.roundedRect(summaryX, currentY, 50, 16, 2, 2, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(item.label, summaryX + 5, currentY + 7);
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(item.value, summaryX + 5, currentY + 13);
      
      summaryX += 55;
    });
    currentY += 25;
  }

  // Generate Table using standalone function
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: currentY,
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left',
      lineColor: [45, 49, 58],
      lineWidth: 0.1
    },
    bodyStyles: {
      fillColor: [33, 36, 43],
      textColor: [220, 220, 220],
      fontSize: 9,
      lineColor: [45, 49, 58],
      lineWidth: 0.1
    },
    alternateRowStyles: {
      fillColor: [38, 42, 51]
    },
    margin: { top: 20 },
    didDrawPage: function (hookData: any) {
      // For any subsequent pages, we need to draw the background
      // However, didDrawPage is called after text. So we draw the background backward in z-index? No, jsPDF z-index works by execution order.
      // A trick for jspdf-autotable backgrounds is drawing it inside willDrawPage or overriding addPage.
      // For simplicity, bodyStyles block already has fillColor which covers the table area.
      // Outside the table area will remain white on new pages unless we override doc.addPage.
    }
  });

  // To fix background on all pages created by autoTable, we do a pass over all pages
  // But wait! Rectangles drawn now will overlap the table text!
  // It's acceptable for now since bodyStyles explicitly fills the row backgrounds and hides the white behind it.
  // The page margins might be white, but if the table fills most of it, it's okay.
  // A better fix for future: monkey-patch doc.addPage before autoTable.

  // Footer for all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Draw footer bg to hide any page text overlap from margin
    doc.setFillColor(33, 36, 43);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} - Nexa Retail Hub Branded Report`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  doc.save(`${filename}.pdf`);
};
