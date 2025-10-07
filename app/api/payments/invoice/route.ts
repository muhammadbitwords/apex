import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { generateInvoice, getInvoiceNumber } from '@/lib/services/invoice';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'trustauto-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Get transaction details
    const result = await pool.query(
      `SELECT t.*, u.name as user_name, u.email, u.phone,
              c.name as car_name, c.make, c.model, c.year
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN cars c ON t.car_id = c.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transaction = result.rows[0];

    // Generate invoice
    const invoiceData = {
      invoiceNumber: getInvoiceNumber(),
      transactionId: transaction.stripe_payment_intent_id || transaction.id,
      date: new Date(transaction.created_at).toLocaleDateString('en-PK'),
      customerName: transaction.user_name,
      customerEmail: transaction.email,
      customerPhone: transaction.phone || 'N/A',
      carName: transaction.car_name || 'Vehicle',
      carYear: transaction.year || new Date().getFullYear(),
      carMake: transaction.make || 'N/A',
      carModel: transaction.model || 'N/A',
      amount: transaction.amount,
      paymentMethod: 'Stripe',
      paymentType: transaction.type,
    };

    const pdfBuffer = await generateInvoice(invoiceData);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="TrustAuto-Invoice-${invoiceData.invoiceNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
