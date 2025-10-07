import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'trustauto-secret-key';

// Create installment plan
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { carId, totalAmount, downPayment, numberOfMonths, interestRate } = await request.json();

    if (!carId || !totalAmount || !downPayment || !numberOfMonths) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate monthly payment
    const remainingAmount = totalAmount - downPayment;
    const monthlyInterest = (interestRate || 0) / 100 / 12;
    const monthlyPayment = monthlyInterest > 0
      ? Math.round((remainingAmount * monthlyInterest * Math.pow(1 + monthlyInterest, numberOfMonths)) / 
          (Math.pow(1 + monthlyInterest, numberOfMonths) - 1))
      : Math.round(remainingAmount / numberOfMonths);

    // Create installment plan
    const planResult = await pool.query(
      `INSERT INTO installment_plans 
       (user_id, car_id, total_amount, down_payment, monthly_payment, number_of_months, interest_rate)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, carId, totalAmount, downPayment, monthlyPayment, numberOfMonths, interestRate || 0]
    );

    const plan = planResult.rows[0];

    // Create individual installment payments
    const startDate = new Date();
    for (let i = 1; i <= numberOfMonths; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      await pool.query(
        `INSERT INTO installment_payments 
         (plan_id, installment_number, amount, due_date)
         VALUES ($1, $2, $3, $4)`,
        [plan.id, i, monthlyPayment, dueDate]
      );
    }

    return NextResponse.json({
      success: true,
      plan: {
        id: plan.id,
        totalAmount: plan.total_amount,
        downPayment: plan.down_payment,
        monthlyPayment: plan.monthly_payment,
        numberOfMonths: plan.number_of_months,
        interestRate: plan.interest_rate,
      },
    });
  } catch (error: any) {
    console.error('Installment plan error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create installment plan' },
      { status: 500 }
    );
  }
}

// Get user's installment plans
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const result = await pool.query(
      `SELECT ip.*, c.name as car_name, c.make, c.model, c.year
       FROM installment_plans ip
       LEFT JOIN cars c ON ip.car_id = c.id
       WHERE ip.user_id = $1
       ORDER BY ip.created_at DESC`,
      [userId]
    );

    return NextResponse.json({ plans: result.rows });
  } catch (error: any) {
    console.error('Get installment plans error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get installment plans' },
      { status: 500 }
    );
  }
}
