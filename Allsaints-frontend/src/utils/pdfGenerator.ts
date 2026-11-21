/**
 * All Saints Public School - Client-Side Pure PDF Generator
 * Generates official PDF 1.4 documents without third-party external dependencies.
 */

function escapePDFText(str: any): string {
  if (!str) return "";
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

/**
 * Trigger browser file download from Blob
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * 1. Download Single Complaint / Grievance Slip PDF
 */
export function downloadSingleComplaintPDF(c: {
  ticket_no?: string;
  ticketNo?: string;
  complainant_name?: string;
  name?: string;
  phone?: string;
  contactNo?: string;
  email?: string;
  category?: string;
  user_type?: string;
  subject?: string;
  description?: string;
  status?: string;
  created_at?: string;
  date?: string;
}) {
  const ticketNo = c.ticket_no || c.ticketNo || "GRV-ASPS";
  const name = c.complainant_name || c.name || "Anonymous Parent / Student";
  const phone = c.phone || c.contactNo || "N/A";
  const email = c.email || "N/A";
  const category = c.category || "General Concern";
  const userType = c.user_type || "Parent";
  const subject = c.subject || "General Inquiry / Grievance";
  const description = c.description || "No further details submitted.";
  const status = (c.status || "SUBMITTED").toUpperCase();
  const dateStr = c.created_at
    ? new Date(c.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : c.date || new Date().toLocaleDateString("en-IN");

  const objects: string[] = [];
  function addObj(s: string) {
    objects.push(s);
    return objects.length;
  }

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj("<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 6 0 R >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let s = "";
  // Navy Header Box (A4: 595.28 x 841.89)
  s += "q 0.035 0.184 0.471 rg 0 755 595.28 87 re f Q\n";
  s += "q 1 0.725 0 rg 0 750 595.28 5 re f Q\n";
  s += "BT 1 1 1 rg /F1 16 Tf 40 805 Td (ALL SAINTS PUBLIC SCHOOL, ADOOR) Tj ET\n";
  s += "BT 1 0.725 0 rg /F1 11 Tf 40 788 Td (GRIEVANCE & FEEDBACK REDRESSAL CELL) Tj ET\n";
  s += "BT 0.9 0.9 0.9 rg /F2 9 Tf 40 768 Td (CBSE Affiliated - Affiliation No: 930501 | Pannivizha, Adoor, PIN: 691523) Tj ET\n";

  // Title Box
  s += "q 0.92 0.95 0.98 rg 40 685 515 45 re f Q\n";
  s += "q 0.035 0.184 0.471 RG 1 w 40 685 515 45 re s Q\n";
  s += "BT 0.035 0.184 0.471 rg /F1 13 Tf 55 708 Td (OFFICIAL GRIEVANCE ACKNOWLEDGEMENT RECEIPT) Tj ET\n";
  s += "BT 0.3 0.3 0.3 rg /F2 9 Tf 55 693 Td (Official Record - All Saints Public School Grievance Cell) Tj ET\n";

  // Details Grid
  const rows = [
    ["Ticket Reference ID", ticketNo, "Status", status],
    ["Complainant Name", name, "Date Filed", dateStr],
    ["Phone Number", phone, "Category", category],
    ["Email Address", email, "User Type", userType],
  ];

  let y = 650;
  rows.forEach(([lbl1, val1, lbl2, val2]) => {
    s += `q 0.96 0.97 0.99 rg 40 ${y - 5} 515 24 re f Q\n`;
    s += `q 0.85 0.9 0.95 RG 0.5 w 40 ${y - 5} 515 24 re s Q\n`;
    s += `BT 0.3 0.3 0.3 rg /F1 8.5 Tf 50 ${y + 3} Td (${escapePDFText(lbl1)}:) Tj ET\n`;
    s += `BT 0.035 0.184 0.471 rg /F1 9 Tf 150 ${y + 3} Td (${escapePDFText(val1)}) Tj ET\n`;
    s += `BT 0.3 0.3 0.3 rg /F1 8.5 Tf 315 ${y + 3} Td (${escapePDFText(lbl2)}:) Tj ET\n`;
    s += `BT 0.1 0.5 0.1 rg /F1 9 Tf 395 ${y + 3} Td (${escapePDFText(val2)}) Tj ET\n`;
    y -= 28;
  });

  // Subject Section
  y -= 8;
  s += `BT 0.035 0.184 0.471 rg /F1 10 Tf 40 ${y} Td (SUBJECT / CONCERN SUMMARY:) Tj ET\n`;
  y -= 16;
  s += `q 0.98 0.98 0.98 rg 40 ${y - 12} 515 24 re f Q\n`;
  s += `q 0.85 0.85 0.85 RG 0.5 w 40 ${y - 12} 515 24 re s Q\n`;
  s += `BT 0.1 0.1 0.1 rg /F1 9 Tf 50 ${y - 4} Td (${escapePDFText(subject)}) Tj ET\n`;

  // Description Section
  y -= 35;
  s += `BT 0.035 0.184 0.471 rg /F1 10 Tf 40 ${y} Td (GRIEVANCE DETAILS & RECORDED DESCRIPTION:) Tj ET\n`;
  y -= 18;
  const safeDesc = escapePDFText(description);
  s += `q 0.98 0.98 0.98 rg 40 ${y - 120} 515 130 re f Q\n`;
  s += `q 0.85 0.85 0.85 RG 0.5 w 40 ${y - 120} 515 130 re s Q\n`;

  // Word-wrap description (approx 78 characters per line)
  const descLines: string[] = [];
  for (let i = 0; i < safeDesc.length; i += 75) {
    descLines.push(safeDesc.substring(i, i + 75));
  }
  let lineY = y - 6;
  descLines.slice(0, 7).forEach((line) => {
    s += `BT 0.15 0.15 0.15 rg /F2 9 Tf 50 ${lineY} Td (${line}) Tj ET\n`;
    lineY -= 15;
  });

  // Important Notice Box
  y = 280;
  s += `q 1 0.98 0.9 rg 40 ${y - 45} 515 50 re f Q\n`;
  s += `q 0.9 0.7 0.2 RG 0.8 w 40 ${y - 45} 515 50 re s Q\n`;
  s += `BT 0.6 0.35 0 rg /F1 9 Tf 50 ${y - 10} Td (OFFICIAL NOTE & PROCEDURE:) Tj ET\n`;
  s += `BT 0.3 0.25 0.1 rg /F2 8 Tf 50 ${y - 24} Td (1. Keep your Ticket Reference ID secure for verification and status follow-ups.) Tj ET\n`;
  s += `BT 0.3 0.25 0.1 rg /F2 8 Tf 50 ${y - 36} Td (2. The Grievance Redressal Cell takes prompt action in accordance with CBSE guidelines.) Tj ET\n`;

  // Signatures Area
  y = 150;
  s += `BT 0.2 0.2 0.2 rg /F1 8.5 Tf 80 ${y} Td (Complainant Signature) Tj ET\n`;
  s += `q 0.6 0.6 0.6 RG 0.5 w 60 ${y + 15} 150 0.5 re s Q\n`;

  s += `BT 0.035 0.184 0.471 rg /F1 8.5 Tf 380 ${y} Td (Grievance Officer / Principal) Tj ET\n`;
  s += `BT 0.4 0.4 0.4 rg /F2 7.5 Tf 375 ${y - 12} Td (All Saints Public School, Adoor) Tj ET\n`;
  s += `q 0.035 0.184 0.471 RG 0.5 w 360 ${y + 15} 160 0.5 re s Q\n`;

  // Footer bar
  s += "q 0.035 0.184 0.471 rg 0 0 595.28 45 re f Q\n";
  s += "BT 1 1 1 rg /F2 8 Tf 40 25 Td (All Saints Public School | Pannivizha P.O, Adoor, Pathanamthitta, Kerala 691523) Tj ET\n";
  s += "BT 1 0.725 0 rg /F1 8 Tf 40 12 Td (Phone: +91-7356804100, +91-6235522549 | Email: allsaintsschool501@gmail.com) Tj ET\n";

  // Stream length in bytes
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(s);
  objects.push(`<< /Length ${streamBytes.length} >>\nstream\n${s}endstream`);

  let pdfText = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [];

  objects.forEach((obj, i) => {
    offsets.push(encoder.encode(pdfText).length);
    pdfText += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const startXref = encoder.encode(pdfText).length;
  pdfText += `xref\n0 ${objects.length + 1}\n`;
  pdfText += "0000000000 65535 f \n";
  offsets.forEach((off) => {
    pdfText += `${String(off).padStart(10, "0")} 00000 n \n`;
  });
  pdfText += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdfText += `startxref\n${startXref}\n%%EOF`;

  const pdfBlob = new Blob([pdfText], { type: "application/pdf" });
  downloadBlob(pdfBlob, `ASPS_Complaint_${ticketNo}.pdf`);
}

/**
 * 2. Download Consolidated Filtered Complaints Report PDF
 */
export function downloadComplaintsReportPDF(
  complaints: any[],
  filterTitle: string = "All Complaints"
) {
  const objects: string[] = [];
  function addObj(s: string) {
    objects.push(s);
    return objects.length;
  }

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj("<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 6 0 R >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let s = "";
  // Header Navy Banner
  s += "q 0.035 0.184 0.471 rg 0 755 595.28 87 re f Q\n";
  s += "q 1 0.725 0 rg 0 750 595.28 5 re f Q\n";
  s += "BT 1 1 1 rg /F1 15 Tf 40 805 Td (ALL SAINTS PUBLIC SCHOOL, ADOOR) Tj ET\n";
  s += "BT 1 0.725 0 rg /F1 11 Tf 40 788 Td (GRIEVANCE REDRESSAL CELL - COMPLAINTS REGISTER REPORT) Tj ET\n";
  s += "BT 0.9 0.9 0.9 rg /F2 9 Tf 40 768 Td (Official Grievance Records Register | All Saints Public School) Tj ET\n";

  // Filter Info Strip
  s += "q 0.92 0.95 0.98 rg 40 700 515 38 re f Q\n";
  s += "q 0.035 0.184 0.471 RG 0.8 w 40 700 515 38 re s Q\n";
  s += `BT 0.035 0.184 0.471 rg /F1 10 Tf 50 722 Td (FILTER APPLIED: ${escapePDFText(filterTitle)}) Tj ET\n`;
  s += `BT 0.4 0.4 0.4 rg /F2 8.5 Tf 50 708 Td (Total Matched Records: ${complaints.length}  |  Generated On: ${new Date().toLocaleString("en-IN")}) Tj ET\n`;

  // Table Column Headers
  s += "q 0.035 0.184 0.471 rg 40 670 515 22 re f Q\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 45 677 Td (TICKET NO) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 135 677 Td (DATE) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 190 677 Td (NAME / PHONE) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 295 677 Td (CATEGORY) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 385 677 Td (SUBJECT / SUMMARY) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 495 677 Td (STATUS) Tj ET\n";

  let y = 645;
  const listToRender = complaints.slice(0, 14); // fit on page cleanly

  listToRender.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      s += `q 0.97 0.98 1 rg 40 ${y - 4} 515 24 re f Q\n`;
    }
    s += `q 0.88 0.92 0.96 RG 0.5 w 40 ${y - 4} 515 24 re s Q\n`;

    const ticket = escapePDFText(item.ticket_no || item.ticketNo || "N/A");
    const date = escapePDFText(
      item.created_at
        ? new Date(item.created_at).toLocaleDateString("en-IN")
        : item.date || "Recent"
    );
    const namePhone = escapePDFText(
      `${item.complainant_name || item.name || "N/A"} (${item.phone || item.contactNo || ""})`.substring(0, 20)
    );
    const category = escapePDFText((item.category || "General").substring(0, 16));
    const subject = escapePDFText((item.subject || item.description || "Grievance").substring(0, 24));
    const status = escapePDFText(item.status || "SUBMITTED");

    s += `BT 0.035 0.184 0.471 rg /F1 8 Tf 45 ${y + 4} Td (${ticket}) Tj ET\n`;
    s += `BT 0.3 0.3 0.3 rg /F2 8 Tf 135 ${y + 4} Td (${date}) Tj ET\n`;
    s += `BT 0.2 0.2 0.2 rg /F2 8 Tf 190 ${y + 4} Td (${namePhone}) Tj ET\n`;
    s += `BT 0.03 0.46 0.79 rg /F1 8 Tf 295 ${y + 4} Td (${category}) Tj ET\n`;
    s += `BT 0.2 0.2 0.2 rg /F2 8 Tf 385 ${y + 4} Td (${subject}) Tj ET\n`;
    s += `BT 0.1 0.5 0.1 rg /F1 8 Tf 495 ${y + 4} Td (${status}) Tj ET\n`;

    y -= 26;
  });

  if (complaints.length === 0) {
    s += `BT 0.5 0.5 0.5 rg /F2 9 Tf 200 ${y - 20} Td (No complaints matching the selected filter criteria.) Tj ET\n`;
  }

  // Footer
  s += "q 0.035 0.184 0.471 rg 0 0 595.28 45 re f Q\n";
  s += "BT 1 1 1 rg /F2 8 Tf 40 25 Td (All Saints Public School | Pannivizha P.O, Adoor, Pathanamthitta, Kerala 691523) Tj ET\n";
  s += "BT 1 0.725 0 rg /F1 8 Tf 40 12 Td (Official Grievance Redressal Records | Phone: +91-7356804100 | allsaintsschool501@gmail.com) Tj ET\n";

  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(s);
  objects.push(`<< /Length ${streamBytes.length} >>\nstream\n${s}endstream`);

  let pdfText = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [];

  objects.forEach((obj, i) => {
    offsets.push(encoder.encode(pdfText).length);
    pdfText += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const startXref = encoder.encode(pdfText).length;
  pdfText += `xref\n0 ${objects.length + 1}\n`;
  pdfText += "0000000000 65535 f \n";
  offsets.forEach((off) => {
    pdfText += `${String(off).padStart(10, "0")} 00000 n \n`;
  });
  pdfText += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdfText += `startxref\n${startXref}\n%%EOF`;

  const pdfBlob = new Blob([pdfText], { type: "application/pdf" });
  downloadBlob(pdfBlob, "ASPS_Complaints_Report.pdf");
}

/**
 * 3. Download Single Contact / Parent Inquiry Slip PDF
 */
export function downloadSingleContactEnquiryPDF(item: {
  id?: string | number;
  inquiry_type?: string;
  name?: string;
  email?: string;
  phone?: string;
  grade_interested?: string;
  subject?: string;
  message?: string;
  description?: string;
  status?: string;
  created_at?: string;
  date?: string;
}) {
  const refId = `ENQ-${item.id || Date.now().toString().slice(-6)}`;
  const name = item.name || "Anonymous Visitor / Parent";
  const phone = item.phone || "N/A";
  const email = item.email || "N/A";
  const inquiryType = item.inquiry_type || "General Inquiry";
  const subject = item.subject || "General Inquiry";
  const message = item.message || item.description || "No description provided.";
  const status = (item.status || "NEW").toUpperCase();
  const dateStr = item.created_at
    ? new Date(item.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : item.date || new Date().toLocaleDateString("en-IN");

  const objects: string[] = [];
  function addObj(s: string) {
    objects.push(s);
    return objects.length;
  }

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj("<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 6 0 R >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let s = "";
  // Navy Header Box (A4: 595.28 x 841.89)
  s += "q 0.035 0.184 0.471 rg 0 755 595.28 87 re f Q\n";
  s += "q 1 0.725 0 rg 0 750 595.28 5 re f Q\n";
  s += "BT 1 1 1 rg /F1 16 Tf 40 805 Td (ALL SAINTS PUBLIC SCHOOL, ADOOR) Tj ET\n";
  s += "BT 1 0.725 0 rg /F1 11 Tf 40 788 Td (PARENT & VISITOR INQUIRY ACKNOWLEDGEMENT) Tj ET\n";
  s += "BT 0.9 0.9 0.9 rg /F2 9 Tf 40 768 Td (CBSE Affiliated - Affiliation No: 930501 | Pannivizha, Adoor, PIN: 691523) Tj ET\n";

  // Title Box
  s += "q 0.92 0.95 0.98 rg 40 685 515 45 re f Q\n";
  s += "q 0.035 0.184 0.471 RG 1 w 40 685 515 45 re s Q\n";
  s += "BT 0.035 0.184 0.471 rg /F1 13 Tf 55 708 Td (OFFICIAL CONTACT QUERY RECORD SLIP) Tj ET\n";
  s += "BT 0.3 0.3 0.3 rg /F2 9 Tf 55 693 Td (Official Record - All Saints Public School Administrative Office) Tj ET\n";

  // Details Grid
  const rows = [
    ["Inquiry Reference ID", refId, "Current Status", status],
    ["Parent / Visitor Name", name, "Date Received", dateStr],
    ["Contact Number", phone, "Inquiry Type", inquiryType],
    ["Email Address", email, "Grade / Target", item.grade_interested || "General"],
  ];

  let y = 650;
  rows.forEach(([lbl1, val1, lbl2, val2]) => {
    s += `q 0.96 0.97 0.99 rg 40 ${y - 5} 515 24 re f Q\n`;
    s += `q 0.85 0.9 0.95 RG 0.5 w 40 ${y - 5} 515 24 re s Q\n`;
    s += `BT 0.3 0.3 0.3 rg /F1 8.5 Tf 50 ${y + 3} Td (${escapePDFText(lbl1)}:) Tj ET\n`;
    s += `BT 0.035 0.184 0.471 rg /F1 9 Tf 165 ${y + 3} Td (${escapePDFText(val1)}) Tj ET\n`;
    s += `BT 0.3 0.3 0.3 rg /F1 8.5 Tf 315 ${y + 3} Td (${escapePDFText(lbl2)}:) Tj ET\n`;
    s += `BT 0.1 0.5 0.1 rg /F1 9 Tf 405 ${y + 3} Td (${escapePDFText(val2)}) Tj ET\n`;
    y -= 28;
  });

  // Subject Section
  y -= 8;
  s += `BT 0.035 0.184 0.471 rg /F1 10 Tf 40 ${y} Td (SUBJECT / QUERY HEADLINE:) Tj ET\n`;
  y -= 16;
  s += `q 0.98 0.98 0.98 rg 40 ${y - 12} 515 24 re f Q\n`;
  s += `q 0.85 0.85 0.85 RG 0.5 w 40 ${y - 12} 515 24 re s Q\n`;
  s += `BT 0.1 0.1 0.1 rg /F1 9 Tf 50 ${y - 4} Td (${escapePDFText(subject)}) Tj ET\n`;

  // Description / Message Section
  y -= 35;
  s += `BT 0.035 0.184 0.471 rg /F1 10 Tf 40 ${y} Td (QUERY DESCRIPTION & RECORDED MESSAGE:) Tj ET\n`;
  y -= 18;
  const safeMsg = escapePDFText(message);
  s += `q 0.98 0.98 0.98 rg 40 ${y - 120} 515 130 re f Q\n`;
  s += `q 0.85 0.85 0.85 RG 0.5 w 40 ${y - 120} 515 130 re s Q\n`;

  const msgLines: string[] = [];
  for (let i = 0; i < safeMsg.length; i += 75) {
    msgLines.push(safeMsg.substring(i, i + 75));
  }
  let lineY = y - 6;
  msgLines.slice(0, 7).forEach((line) => {
    s += `BT 0.15 0.15 0.15 rg /F2 9 Tf 50 ${lineY} Td (${line}) Tj ET\n`;
    lineY -= 15;
  });

  // Note Box
  y = 280;
  s += `q 1 0.98 0.9 rg 40 ${y - 45} 515 50 re f Q\n`;
  s += `q 0.9 0.7 0.2 RG 0.8 w 40 ${y - 45} 515 50 re s Q\n`;
  s += `BT 0.6 0.35 0 rg /F1 9 Tf 50 ${y - 10} Td (OFFICE & FOLLOW-UP NOTICE:) Tj ET\n`;
  s += `BT 0.3 0.25 0.1 rg /F2 8 Tf 50 ${y - 24} Td (1. Your inquiry is recorded directly with the All Saints Public School Administrative Office.) Tj ET\n`;
  s += `BT 0.3 0.25 0.1 rg /F2 8 Tf 50 ${y - 36} Td (2. The front desk or relevant department will contact you using your registered phone/email.) Tj ET\n`;

  // Signatures Area
  y = 150;
  s += `BT 0.2 0.2 0.2 rg /F1 8.5 Tf 80 ${y} Td (Parent / Visitor Signature) Tj ET\n`;
  s += `q 0.6 0.6 0.6 RG 0.5 w 60 ${y + 15} 150 0.5 re s Q\n`;

  s += `BT 0.035 0.184 0.471 rg /F1 8.5 Tf 380 ${y} Td (Administrative Officer / Principal) Tj ET\n`;
  s += `BT 0.4 0.4 0.4 rg /F2 7.5 Tf 375 ${y - 12} Td (All Saints Public School, Adoor) Tj ET\n`;
  s += `q 0.035 0.184 0.471 RG 0.5 w 360 ${y + 15} 160 0.5 re s Q\n`;

  // Footer bar
  s += "q 0.035 0.184 0.471 rg 0 0 595.28 45 re f Q\n";
  s += "BT 1 1 1 rg /F2 8 Tf 40 25 Td (All Saints Public School | Pannivizha P.O, Adoor, Pathanamthitta, Kerala 691523) Tj ET\n";
  s += "BT 1 0.725 0 rg /F1 8 Tf 40 12 Td (Phone: +91-7356804100, +91-6235522549 | Email: allsaintsschool501@gmail.com) Tj ET\n";

  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(s);
  objects.push(`<< /Length ${streamBytes.length} >>\nstream\n${s}endstream`);

  let pdfText = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [];

  objects.forEach((obj, i) => {
    offsets.push(encoder.encode(pdfText).length);
    pdfText += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const startXref = encoder.encode(pdfText).length;
  pdfText += `xref\n0 ${objects.length + 1}\n`;
  pdfText += "0000000000 65535 f \n";
  offsets.forEach((off) => {
    pdfText += `${String(off).padStart(10, "0")} 00000 n \n`;
  });
  pdfText += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdfText += `startxref\n${startXref}\n%%EOF`;

  const pdfBlob = new Blob([pdfText], { type: "application/pdf" });
  downloadBlob(pdfBlob, `ASPS_Inquiry_${refId}.pdf`);
}

/**
 * 4. Download Consolidated Filtered Contact Enquiries Report PDF
 */
export function downloadContactEnquiriesReportPDF(
  enquiries: any[],
  filterTitle: string = "All Contact Inquiries"
) {
  const objects: string[] = [];
  function addObj(s: string) {
    objects.push(s);
    return objects.length;
  }

  addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj("<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 6 0 R >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let s = "";
  // Header Navy Banner
  s += "q 0.035 0.184 0.471 rg 0 755 595.28 87 re f Q\n";
  s += "q 1 0.725 0 rg 0 750 595.28 5 re f Q\n";
  s += "BT 1 1 1 rg /F1 15 Tf 40 805 Td (ALL SAINTS PUBLIC SCHOOL, ADOOR) Tj ET\n";
  s += "BT 1 0.725 0 rg /F1 11 Tf 40 788 Td (PARENT & VISITOR CONTACT INQUIRIES REGISTER) Tj ET\n";
  s += "BT 0.9 0.9 0.9 rg /F2 9 Tf 40 768 Td (Official Parent & Visitor Enquiries Register | All Saints Public School) Tj ET\n";

  // Filter Info Strip
  s += "q 0.92 0.95 0.98 rg 40 700 515 38 re f Q\n";
  s += "q 0.035 0.184 0.471 RG 0.8 w 40 700 515 38 re s Q\n";
  s += `BT 0.035 0.184 0.471 rg /F1 10 Tf 50 722 Td (FILTER APPLIED: ${escapePDFText(filterTitle)}) Tj ET\n`;
  s += `BT 0.4 0.4 0.4 rg /F2 8.5 Tf 50 708 Td (Total Matched Inquiries: ${enquiries.length}  |  Generated On: ${new Date().toLocaleString("en-IN")}) Tj ET\n`;

  // Table Column Headers
  s += "q 0.035 0.184 0.471 rg 40 670 515 22 re f Q\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 45 677 Td (ID) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 80 677 Td (DATE) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 145 677 Td (NAME / CONTACT) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 270 677 Td (TYPE) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 355 677 Td (SUBJECT / MESSAGE) Tj ET\n";
  s += "BT 1 1 1 rg /F1 8.5 Tf 495 677 Td (STATUS) Tj ET\n";

  let y = 645;
  const listToRender = enquiries.slice(0, 14);

  listToRender.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      s += `q 0.97 0.98 1 rg 40 ${y - 4} 515 24 re f Q\n`;
    }
    s += `q 0.88 0.92 0.96 RG 0.5 w 40 ${y - 4} 515 24 re s Q\n`;

    const idStr = escapePDFText(String(item.id || index + 1));
    const date = escapePDFText(
      item.created_at
        ? new Date(item.created_at).toLocaleDateString("en-IN")
        : item.date || "Recent"
    );
    const nameContact = escapePDFText(
      `${item.name || "N/A"} (${item.phone || item.email || ""})`.substring(0, 22)
    );
    const type = escapePDFText((item.inquiry_type || "General").substring(0, 14));
    const subject = escapePDFText((item.subject || item.message || item.description || "Inquiry").substring(0, 26));
    const status = escapePDFText(item.status || "NEW");

    s += `BT 0.035 0.184 0.471 rg /F1 8 Tf 45 ${y + 4} Td (#${idStr}) Tj ET\n`;
    s += `BT 0.3 0.3 0.3 rg /F2 8 Tf 80 ${y + 4} Td (${date}) Tj ET\n`;
    s += `BT 0.2 0.2 0.2 rg /F2 8 Tf 145 ${y + 4} Td (${nameContact}) Tj ET\n`;
    s += `BT 0.03 0.46 0.79 rg /F1 8 Tf 270 ${y + 4} Td (${type}) Tj ET\n`;
    s += `BT 0.2 0.2 0.2 rg /F2 8 Tf 355 ${y + 4} Td (${subject}) Tj ET\n`;
    s += `BT 0.1 0.5 0.1 rg /F1 8 Tf 495 ${y + 4} Td (${status}) Tj ET\n`;

    y -= 26;
  });

  if (enquiries.length === 0) {
    s += `BT 0.5 0.5 0.5 rg /F2 9 Tf 200 ${y - 20} Td (No inquiries matching the selected filter criteria.) Tj ET\n`;
  }

  // Footer
  s += "q 0.035 0.184 0.471 rg 0 0 595.28 45 re f Q\n";
  s += "BT 1 1 1 rg /F2 8 Tf 40 25 Td (All Saints Public School | Pannivizha P.O, Adoor, Pathanamthitta, Kerala 691523) Tj ET\n";
  s += "BT 1 0.725 0 rg /F1 8 Tf 40 12 Td (Official Contact Inquiries Register | Phone: +91-7356804100 | allsaintsschool501@gmail.com) Tj ET\n";

  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(s);
  objects.push(`<< /Length ${streamBytes.length} >>\nstream\n${s}endstream`);

  let pdfText = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [];

  objects.forEach((obj, i) => {
    offsets.push(encoder.encode(pdfText).length);
    pdfText += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const startXref = encoder.encode(pdfText).length;
  pdfText += `xref\n0 ${objects.length + 1}\n`;
  pdfText += "0000000000 65535 f \n";
  offsets.forEach((off) => {
    pdfText += `${String(off).padStart(10, "0")} 00000 n \n`;
  });
  pdfText += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdfText += `startxref\n${startXref}\n%%EOF`;

  const pdfBlob = new Blob([pdfText], { type: "application/pdf" });
  downloadBlob(pdfBlob, "ASPS_Contact_Inquiries_Report.pdf");
}
