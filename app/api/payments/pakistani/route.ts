import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { 
  processJazzCashPayment, 
  processEasypaisaPayment, 
  getBankTransferInstructions,
  verifyManualPayment 
} from '@/lib/services/pakistani-payments';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'trustauto-secret-key';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { method, carId, amount, type } = await request.json();

    if (!method || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user details
    const userResult = await pool.query(
      'SELECT name, email, phone FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Create transaction record
    const transactionResult = await pool.query(
      `INSERT INTO transactions (user_id, car_id, amount, type, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, carId, amount, type || 'purchase', 'pending']
    );

    const transaction = transactionResult.rows[0];
    const orderId = `TA-${transaction.id}-${Date.now()}`;

    const paymentOptions = {
      method,
      amount,
      customerName: user.name,
      customerPhone: user.phone || '',
      customerEmail: user.email,
      orderId,
    };

    let result;

    switch (method) {
      case 'jazzcash':
        result = await processJazzCashPayment(paymentOptions);
        break;
      case 'easypaisa':
        result = await processEasypaisaPayment(paymentOptions);
        break;
      case 'bank_transfer':
        result = getBankTransferInstructions(paymentOptions);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid payment method' },
          { status: 400 }
        );
    }

    // Update transaction with order ID
    await pool.query(
      `UPDATE transactions SET stripe_payment_intent_id = $1 WHERE id = $2`,
      [orderId, transaction.id]
    );

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      orderId,
      ...result,
    });
  } catch (error: any) {
    console.error('Pakistani payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payment' },
      { status: 500 }
    );
  }
}

// Verify manual payment
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { transactionId, externalTransactionId, receiptUrl } = await request.json();

    if (!transactionId || !externalTransactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify transaction belongs to user
    const transactionResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [transactionId, userId]
    );

    if (transactionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Update transaction with external ID and mark as pending verification
    await pool.query(
      `UPDATE transactions 
       SET status = $1, 
           stripe_payment_intent_id = $2,
           updated_at = NOW()
       WHERE id = $3`,
      ['pending_verification', externalTransactionId, transactionId]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment submitted for verification',
      status: 'pending_verification',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
