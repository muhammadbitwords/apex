import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Pool } from 'pg';
import { sendEmail, getRefundConfirmationEmail } from '@/lib/services/email';
import { sendSMS, getRefundConfirmationSMS } from '@/lib/services/sms';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { transactionId, reason } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Get transaction details
    const transactionResult = await pool.query(
      `SELECT t.*, u.name as user_name, u.email, u.phone, c.name as car_name
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN cars c ON t.car_id = c.id
       WHERE t.id = $1`,
      [transactionId]
    );

    if (transactionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transaction = transactionResult.rows[0];

    if (transaction.status !== 'completed') {
      return NextResponse.json(
        { error: 'Only completed transactions can be refunded' },
        { status: 400 }
      );
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: transaction.stripe_payment_intent_id,
      reason: reason || 'requested_by_customer',
    });

    // Update transaction status
    await pool.query(
      `UPDATE transactions 
       SET status = $1, updated_at = NOW()
       WHERE id = $2`,
      ['refunded', transactionId]
    );

    // Update car status back to available if it was a purchase
    if (transaction.type === 'purchase' && transaction.car_id) {
      await pool.query(
        `UPDATE cars SET status = $1 WHERE id = $2`,
        ['available', transaction.car_id]
      );
    }

    // Send email notification
    const emailData = getRefundConfirmationEmail({
      userName: transaction.user_name,
      carName: transaction.car_name || 'Vehicle',
      amount: transaction.amount,
      refundId: refund.id,
      date: new Date().toLocaleDateString('en-PK'),
    });

    await sendEmail({
      to: transaction.email,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    // Send SMS notification
    if (transaction.phone) {
      const smsMessage = getRefundConfirmationSMS({
        userName: transaction.user_name,
        amount: transaction.amount,
        refundId: refund.id,
      });

      await sendSMS({
        to: transaction.phone,
        message: smsMessage,
      });
    }

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
      },
    });
  } catch (error: any) {
    console.error('Refund error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process refund' },
      { status: 500 }
    );
  }
}
