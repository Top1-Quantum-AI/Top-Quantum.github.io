import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ReportSection {
  title: string;
  data: Record<string, string | number>;
}

export interface ReportOptions {
  title?: string;
  subtitle?: string;
  sections?: ReportSection[];
  includeTimestamp?: boolean;
}

// Capture a DOM element as PDF
export async function exportElementToPDF(
  element: HTMLElement,
  filename = 'quantum-report.pdf'
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#0f172a',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10;

  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}

// Generate a structured data report as PDF
export function exportDataReport(options: ReportOptions): void {
  const {
    title = 'Quantum AI System Report',
    subtitle = 'Advanced Analytics & Performance Summary',
    sections = [],
    includeTimestamp = true,
  } = options;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  let y = 20;

  // Header
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, 45, 'F');

  pdf.setTextColor(96, 165, 250);
  pdf.setFontSize(22);
  pdf.text(title, pageWidth / 2, 20, { align: 'center' });

  pdf.setTextColor(148, 163, 184);
  pdf.setFontSize(11);
  pdf.text(subtitle, pageWidth / 2, 30, { align: 'center' });

  if (includeTimestamp) {
    pdf.setFontSize(9);
    pdf.text(
      `Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`,
      pageWidth / 2,
      38,
      { align: 'center' }
    );
  }

  y = 55;

  // Sections
  for (const section of sections) {
    if (y > 260) {
      pdf.addPage();
      y = 20;
    }

    pdf.setTextColor(96, 165, 250);
    pdf.setFontSize(14);
    pdf.text(section.title, 15, y);
    y += 3;

    pdf.setDrawColor(96, 165, 250);
    pdf.setLineWidth(0.5);
    pdf.line(15, y, pageWidth - 15, y);
    y += 8;

    pdf.setFontSize(10);
    for (const [key, value] of Object.entries(section.data)) {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      pdf.setTextColor(148, 163, 184);
      pdf.text(key, 20, y);

      pdf.setTextColor(226, 232, 240);
      pdf.text(String(value), pageWidth - 20, y, { align: 'right' });

      y += 7;
    }

    y += 5;
  }

  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      `Quantum AI System | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pdf.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  pdf.save(`quantum-report-${timestamp}.pdf`);
}

// Quick export: capture current dashboard view
export async function exportDashboardSnapshot(): Promise<void> {
  const dashboard = document.querySelector('[data-dashboard]');
  if (dashboard == null) {
    const {body} = document;
    await exportElementToPDF(body, 'quantum-dashboard-snapshot.pdf');
    return;
  }
  await exportElementToPDF(dashboard, 'quantum-dashboard-snapshot.pdf');
}
