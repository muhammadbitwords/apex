import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"TrustAuto" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

// Payment confirmation email template
export function getPaymentConfirmationEmail(data: {
  userName: string;
  carName: string;
  amount: number;
  transactionId: string;
  date: string;
}) {
  return {
    subject: '✅ Payment Confirmation - TrustAuto',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .amount { font-size: 24px; color: #16a34a; font-weight: bold; }
          .button { background: #1a1a1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 TrustAuto</h1>
            <p>Pakistan's Trusted Car Marketplace</p>
          </div>
          
          <div class="content">
            <h2>✅ Payment Successful!</h2>
            <p>Dear ${data.userName},</p>
            <p>Your payment has been successfully processed. Thank you for your purchase!</p>
            
            <div class="details">
              <div class="detail-row">
                <span><strong>Vehicle:</strong></span>
                <span>${data.carName}</span>
              </div>
              <div class="detail-row">
                <span><strong>Amount Paid:</strong></span>
                <span class="amount">₨${(data.amount / 1000000).toFixed(2)}M</span>
              </div>
              <div class="detail-row">
                <span><strong>Transaction ID:</strong></span>
                <span>${data.transactionId}</span>
              </div>
              <div class="detail-row">
                <span><strong>Date:</strong></span>
                <span>${data.date}</span>
              </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Our team will contact you within 24 hours</li>
              <li>Vehicle inspection report will be shared</li>
              <li>Delivery arrangements will be made</li>
              <li>All documents will be prepared</li>
            </ul>
            
            <center>
              <a href="https://car-marketplace-2.lindy.site/dashboard" class="button">View Dashboard</a>
            </center>
          </div>
          
          <div class="footer">
            <p>TrustAuto - Pakistan's Trusted Car Marketplace</p>
            <p>📧 support@trustauto.pk | 📱 +92-XXX-XXXXXXX</p>
            <p>© 2025 TrustAuto. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Payment Confirmation - TrustAuto\n\nDear ${data.userName},\n\nYour payment has been successfully processed!\n\nVehicle: ${data.carName}\nAmount: ₨${(data.amount / 1000000).toFixed(2)}M\nTransaction ID: ${data.transactionId}\nDate: ${data.date}\n\nThank you for choosing TrustAuto!`,
  };
}

// Refund confirmation email
export function getRefundConfirmationEmail(data: {
  userName: string;
  carName: string;
  amount: number;
  refundId: string;
  date: string;
}) {
  return {
    subject: '💰 Refund Processed - TrustAuto',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .amount { font-size: 24px; color: #2563eb; font-weight: bold; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 TrustAuto</h1>
          </div>
          
          <div class="content">
            <h2>💰 Refund Processed</h2>
            <p>Dear ${data.userName},</p>
            <p>Your refund has been successfully processed and will appear in your account within 5-7 business days.</p>
            
            <div class="details">
              <div class="detail-row">
                <span><strong>Vehicle:</strong></span>
                <span>${data.carName}</span>
              </div>
              <div class="detail-row">
                <span><strong>Refund Amount:</strong></span>
                <span class="amount">₨${(data.amount / 1000000).toFixed(2)}M</span>
              </div>
              <div class="detail-row">
                <span><strong>Refund ID:</strong></span>
                <span>${data.refundId}</span>
              </div>
              <div class="detail-row">
                <span><strong>Date:</strong></span>
                <span>${data.date}</span>
              </div>
            </div>
            
            <p>If you have any questions, please contact our support team.</p>
          </div>
          
          <div class="footer">
            <p>TrustAuto - Pakistan's Trusted Car Marketplace</p>
            <p>📧 support@trustauto.pk | 📱 +92-XXX-XXXXXXX</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Refund Processed - TrustAuto\n\nDear ${data.userName},\n\nYour refund has been processed!\n\nVehicle: ${data.carName}\nAmount: ₨${(data.amount / 1000000).toFixed(2)}M\nRefund ID: ${data.refundId}\nDate: ${data.date}`,
  };
}
