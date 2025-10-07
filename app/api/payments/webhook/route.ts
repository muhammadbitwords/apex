import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Pool } from 'pg';
import { sendEmail, getPaymentConfirmationEmail } from '@/lib/services/email';
import { sendSMS, getPaymentConfirmationSMS } from '@/lib/services/sms';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentCanceled(canceledPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update transaction status
    const result = await pool.query(
      `UPDATE transactions 
       SET status = $1, updated_at = NOW()
       WHERE stripe_payment_intent_id = $2
       RETURNING *`,
      ['completed', paymentIntent.id]
    );

    if (result.rows.length === 0) {
      console.error('Transaction not found for payment intent:', paymentIntent.id);
      return;
    }

    const transaction = result.rows[0];

    // Update car status if it's a purchase
    if (transaction.type === 'purchase' && transaction.car_id) {
      await pool.query(
        `UPDATE cars SET status = $1 WHERE id = $2`,
        ['sold', transaction.car_id]
      );
    }

    // Get user and car details for notifications
    const detailsResult = await pool.query(
      `SELECT u.name as user_name, u.email, u.phone,
              c.name as car_name
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN cars c ON t.car_id = c.id
       WHERE t.id = $1`,
      [transaction.id]
    );

    if (detailsResult.rows.length > 0) {
      const details = detailsResult.rows[0];

      // Send email notification
      const emailData = getPaymentConfirmationEmail({
        userName: details.user_name,
        carName: details.car_name || 'Vehicle',
        amount: transaction.amount,
        transactionId: paymentIntent.id,
        date: new Date().toLocaleDateString('en-PK'),
      });

      await sendEmail({
        to: details.email,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      });

      // Send SMS notification
      if (details.phone) {
        const smsMessage = getPaymentConfirmationSMS({
          userName: details.user_name,
          carName: details.car_name || 'Vehicle',
          amount: transaction.amount,
          transactionId: paymentIntent.id,
        });

        await sendSMS({
          to: details.phone,
          message: smsMessage,
        });
      }
    }

    console.log('Payment succeeded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    await pool.query(
      `UPDATE transactions 
       SET status = $1, updated_at = NOW()
       WHERE stripe_payment_intent_id = $2`,
      ['failed', paymentIntent.id]
    );

    console.log('Payment failed:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    await pool.query(
      `UPDATE transactions 
       SET status = $1, updated_at = NOW()
       WHERE stripe_payment_intent_id = $2`,
      ['canceled', paymentIntent.id]
    );

    console.log('Payment canceled:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}
