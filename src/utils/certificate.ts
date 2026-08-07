import jsPDF from 'jspdf';
import { TypingStats } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

export interface CertificateData {
  stats: TypingStats;
  mode: string;
  user: FirebaseUser | null;
}

export const generateCertificatePDF = ({ stats, mode, user }: CertificateData) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm

  // Generate Unique Certificate ID
  const certId = `TMP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const userName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Typing Master Typist');
  const userEmail = user?.email || 'N/A (Guest User)';

  // --- BACKGROUND & BORDERS ---
  // Outer Canvas Background
  doc.setFillColor(250, 250, 250);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative Outer Teal Border
  doc.setDrawColor(13, 148, 136); // Teal-600 #0d9488
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');

  // Decorative Inner Gold Border
  doc.setDrawColor(217, 119, 6); // Amber-600 #d97706
  doc.setLineWidth(0.6);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26, 'S');

  // Corner Flourish Accents
  const drawCornerFlourish = (x: number, y: number, mx: number, my: number) => {
    doc.setDrawColor(13, 148, 136);
    doc.setLineWidth(0.8);
    doc.line(x, y, x + (10 * mx), y);
    doc.line(x, y, x, y + (10 * my));
  };
  drawCornerFlourish(16, 16, 1, 1);
  drawCornerFlourish(pageWidth - 16, 16, -1, 1);
  drawCornerFlourish(16, pageHeight - 16, 1, -1);
  drawCornerFlourish(pageWidth - 16, pageHeight - 16, -1, -1);

  // --- HEADER SECTION ---
  // Website Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('TYPING MASTER PRO', pageWidth / 2, 34, { align: 'center' });

  // Subtitle / Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(13, 148, 136); // Teal-600
  doc.text('CERTIFICATE OF TYPING PROFICIENCY', pageWidth / 2, 43, { align: 'center' });

  // Gold Divider Line
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, 48, pageWidth / 2 + 40, 48);

  // --- CERTIFICATE BODY ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('This official certificate is proudly awarded to', pageWidth / 2, 60, { align: 'center' });

  // User Name (Highlighted)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(userName.toUpperCase(), pageWidth / 2, 72, { align: 'center' });

  // User Name Underline Accent
  const nameWidth = Math.min(doc.getTextWidth(userName.toUpperCase()) + 12, 140);
  doc.setDrawColor(45, 212, 191); // Teal-400
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - (nameWidth / 2), 75, pageWidth / 2 + (nameWidth / 2), 75);

  // User Email
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Registered Email: ${userEmail}`, pageWidth / 2, 82, { align: 'center' });

  // Achievement Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85); // Slate-700
  const descText = `For successfully completing the official typing speed test assessment in "${mode}" mode with verified performance metrics:`;
  doc.text(descText, pageWidth / 2, 93, { align: 'center' });

  // --- METRICS DISPLAY TABLE BOX ---
  const boxX = pageWidth / 2 - 100;
  const boxY = 102;
  const boxW = 200;
  const boxH = 40;

  // Stats Box Background
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.4);
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, 'FD');

  // Stats Columns
  const colWidth = boxW / 4;
  const statsList = [
    { label: 'SPEED', value: `${stats.wpm} WPM`, color: [13, 148, 136] },
    { label: 'ACCURACY', value: `${stats.accuracy}%`, color: [13, 148, 136] },
    { label: 'MISTAKES', value: `${stats.incorrectChars}`, color: [225, 29, 72] },
    { label: 'TEST DURATION', value: `${stats.timeSpentSeconds}s`, color: [217, 119, 6] }
  ];

  statsList.forEach((st, i) => {
    const colX = boxX + (i * colWidth) + (colWidth / 2);
    
    // Divider line between columns
    if (i > 0) {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(boxX + (i * colWidth), boxY + 6, boxX + (i * colWidth), boxY + boxH - 6);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(st.label, colX, boxY + 14, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(st.color[0], st.color[1], st.color[2]);
    doc.text(st.value, colX, boxY + 28, { align: 'center' });
  });

  // --- FOOTER & VERIFICATION DETAILS ---
  // Official Seal Circle Drawing
  const sealX = pageWidth / 2;
  const sealY = 160;
  doc.setFillColor(240, 253, 250); // Teal-50
  doc.setDrawColor(13, 148, 136); // Teal-600
  doc.setLineWidth(0.6);
  doc.circle(sealX, sealY, 12, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(13, 148, 136);
  doc.text('OFFICIAL', sealX, sealY - 2, { align: 'center' });
  doc.text('PASSED', sealX, sealY + 2, { align: 'center' });
  doc.text('VERIFIED', sealX, sealY + 6, { align: 'center' });

  // Date and Certificate ID
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  // Left Footer: Date
  doc.text(`Issue Date: ${currentDate}`, 25, pageHeight - 24);

  // Right Footer: Certificate ID
  doc.text(`Certificate ID: ${certId}`, pageWidth - 25, pageHeight - 24, { align: 'right' });

  // Center Footer: Verification note
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Issued by Typing Master Pro Platform • Verified Authenticated Test Result', pageWidth / 2, pageHeight - 18, { align: 'center' });

  // Save the PDF file
  doc.save(`Typing_Master_Certificate_${stats.wpm}WPM_${certId}.pdf`);
};
