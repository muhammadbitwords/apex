import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface InvoiceData {
  invoiceNumber: string;
  transactionId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carName: string;
  carYear: number;
  carMake: string;
  carModel: string;
  amount: number;
  paymentMethod: string;
  paymentType: 'purchase' | 'deposit' | 'installment';
}

export async function generateInvoice(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('TrustAuto', 50, 50)
      .fontSize(10)
      .font('Helvetica')
      .text("Pakistan's Trusted Car Marketplace", 50, 80)
      .text('Email: support@trustauto.pk', 50, 95)
      .text('Phone: +92-XXX-XXXXXXX', 50, 110);

    // Invoice title
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('INVOICE', 400, 50, { align: 'right' });

    // Invoice details
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Invoice #: ${data.invoiceNumber}`, 400, 80, { align: 'right' })
      .text(`Date: ${data.date}`, 400, 95, { align: 'right' })
      .text(`Transaction ID: ${data.transactionId}`, 400, 110, { align: 'right' });

    // Line separator
    doc
      .moveTo(50, 140)
      .lineTo(550, 140)
      .stroke();

    // Customer information
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('BILL TO:', 50, 160)
      .fontSize(10)
      .font('Helvetica')
      .text(data.customerName, 50, 180)
      .text(data.customerEmail, 50, 195)
      .text(data.customerPhone, 50, 210);

    // Vehicle information
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('VEHICLE DETAILS:', 50, 250)
      .fontSize(10)
      .font('Helvetica')
      .text(`${data.carYear} ${data.carMake} ${data.carModel}`, 50, 270)
      .text(data.carName, 50, 285);

    // Payment details table
    const tableTop = 330;
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('PAYMENT DETAILS:', 50, tableTop);

    // Table header
    const itemY = tableTop + 30;
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Description', 50, itemY)
      .text('Payment Type', 250, itemY)
      .text('Amount', 450, itemY, { align: 'right' });

    // Line under header
    doc
      .moveTo(50, itemY + 15)
      .lineTo(550, itemY + 15)
      .stroke();

    // Table content
    const contentY = itemY + 25;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(data.carName, 50, contentY)
      .text(data.paymentType.charAt(0).toUpperCase() + data.paymentType.slice(1), 250, contentY)
      .text(`₨${(data.amount / 1000000).toFixed(2)}M`, 450, contentY, { align: 'right' });

    // Line before total
    doc
      .moveTo(50, contentY + 20)
      .lineTo(550, contentY + 20)
      .stroke();

    // Total
    const totalY = contentY + 35;
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('TOTAL AMOUNT:', 350, totalY)
      .text(`₨${(data.amount / 1000000).toFixed(2)}M`, 450, totalY, { align: 'right' });

    // Payment method
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Payment Method: ${data.paymentMethod}`, 50, totalY + 30);

    // Footer
    const footerY = 700;
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Terms & Conditions:', 50, footerY)
      .fontSize(8)
      .font('Helvetica')
      .text('1. All sales are final and non-refundable unless vehicle inspection reveals undisclosed issues.', 50, footerY + 15)
      .text('2. Vehicle delivery will be arranged within 7 business days of payment confirmation.', 50, footerY + 28)
      .text('3. All documents will be transferred to buyer name within 30 days.', 50, footerY + 41)
      .text('4. For any queries, please contact our support team.', 50, footerY + 54);

    // Thank you message
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Thank you for choosing TrustAuto!', 50, footerY + 80, { align: 'center' });

    doc.end();
  });
}

export function getInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TA-${year}${month}-${random}`;
}
