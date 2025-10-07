import twilio from 'twilio';

// Twilio configuration for Pakistan
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client: any = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export interface SMSOptions {
  to: string; // Pakistani phone number format: +92XXXXXXXXXX
  message: string;
}

export async function sendSMS(options: SMSOptions) {
  if (!client) {
    console.log('SMS service not configured. Message:', options.message);
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    // Ensure Pakistani phone number format
    let phoneNumber = options.to;
    if (!phoneNumber.startsWith('+92')) {
      // Convert local format to international
      phoneNumber = phoneNumber.replace(/^0/, '+92');
    }

    const message = await client.messages.create({
      body: options.message,
      from: fromNumber,
      to: phoneNumber,
    });

    console.log('SMS sent:', message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('SMS error:', error);
    return { success: false, error };
  }
}

// Payment confirmation SMS
export function getPaymentConfirmationSMS(data: {
  userName: string;
  carName: string;
  amount: number;
  transactionId: string;
}) {
  return `TrustAuto: Payment Successful! ${data.carName} - Rs${(data.amount / 1000000).toFixed(2)}M. Transaction ID: ${data.transactionId}. We'll contact you within 24 hours. Thank you!`;
}

// Refund confirmation SMS
export function getRefundConfirmationSMS(data: {
  userName: string;
  amount: number;
  refundId: string;
}) {
  return `TrustAuto: Refund of Rs${(data.amount / 1000000).toFixed(2)}M processed successfully. Refund ID: ${data.refundId}. Amount will reflect in 5-7 business days.`;
}

// Auction bid notification SMS
export function getAuctionBidSMS(data: {
  carName: string;
  bidAmount: number;
  status: 'outbid' | 'winning';
}) {
  if (data.status === 'outbid') {
    return `TrustAuto: You've been outbid on ${data.carName}. Current bid: Rs${(data.bidAmount / 1000000).toFixed(2)}M. Place a higher bid now!`;
  }
  return `TrustAuto: You're the highest bidder on ${data.carName} at Rs${(data.bidAmount / 1000000).toFixed(2)}M. Good luck!`;
}

// Auction won SMS
export function getAuctionWonSMS(data: {
  carName: string;
  winningBid: number;
}) {
  return `TrustAuto: Congratulations! You won ${data.carName} at Rs${(data.winningBid / 1000000).toFixed(2)}M. We'll contact you shortly to complete the purchase.`;
}

// Installment reminder SMS
export function getInstallmentReminderSMS(data: {
  userName: string;
  amount: number;
  dueDate: string;
  installmentNumber: number;
}) {
  return `TrustAuto: Reminder - Installment #${data.installmentNumber} of Rs${(data.amount / 1000000).toFixed(2)}M is due on ${data.dueDate}. Please make payment to avoid late fees.`;
}
