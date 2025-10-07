import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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
    
    // Only admin can access analytics
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days

    // Total revenue
    const revenueResult = await pool.query(
      `SELECT 
        COUNT(*) as total_transactions,
        SUM(amount) as total_revenue,
        AVG(amount) as average_transaction
       FROM transactions 
       WHERE status = 'completed' 
       AND created_at >= NOW() - INTERVAL '${period} days'`
    );

    // Revenue by payment type
    const typeResult = await pool.query(
      `SELECT 
        type,
        COUNT(*) as count,
        SUM(amount) as revenue
       FROM transactions 
       WHERE status = 'completed'
       AND created_at >= NOW() - INTERVAL '${period} days'
       GROUP BY type`
    );

    // Daily revenue trend
    const trendResult = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as transactions,
        SUM(amount) as revenue
       FROM transactions 
       WHERE status = 'completed'
       AND created_at >= NOW() - INTERVAL '${period} days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    // Payment status distribution
    const statusResult = await pool.query(
      `SELECT 
        status,
        COUNT(*) as count
       FROM transactions 
       WHERE created_at >= NOW() - INTERVAL '${period} days'
       GROUP BY status`
    );

    // Top selling cars
    const topCarsResult = await pool.query(
      `SELECT 
        c.name,
        c.make,
        c.model,
        c.year,
        COUNT(t.id) as sales_count,
        SUM(t.amount) as total_revenue
       FROM transactions t
       JOIN cars c ON t.car_id = c.id
       WHERE t.status = 'completed'
       AND t.created_at >= NOW() - INTERVAL '${period} days'
       GROUP BY c.id, c.name, c.make, c.model, c.year
       ORDER BY sales_count DESC
       LIMIT 10`
    );

    // Refund statistics
    const refundResult = await pool.query(
      `SELECT 
        COUNT(*) as total_refunds,
        SUM(amount) as total_refunded
       FROM transactions 
       WHERE status = 'refunded'
       AND created_at >= NOW() - INTERVAL '${period} days'`
    );

    // Installment plans statistics
    const installmentResult = await pool.query(
      `SELECT 
        COUNT(*) as total_plans,
        SUM(total_amount) as total_financed,
        AVG(number_of_months) as avg_duration
       FROM installment_plans 
       WHERE created_at >= NOW() - INTERVAL '${period} days'`
    );

    return NextResponse.json({
      period: `${period} days`,
      overview: {
        totalTransactions: parseInt(revenueResult.rows[0].total_transactions) || 0,
        totalRevenue: parseInt(revenueResult.rows[0].total_revenue) || 0,
        averageTransaction: parseInt(revenueResult.rows[0].average_transaction) || 0,
        totalRefunds: parseInt(refundResult.rows[0].total_refunds) || 0,
        totalRefunded: parseInt(refundResult.rows[0].total_refunded) || 0,
      },
      byType: typeResult.rows.map(row => ({
        type: row.type,
        count: parseInt(row.count),
        revenue: parseInt(row.revenue),
      })),
      trend: trendResult.rows.map(row => ({
        date: row.date,
        transactions: parseInt(row.transactions),
        revenue: parseInt(row.revenue),
      })),
      byStatus: statusResult.rows.map(row => ({
        status: row.status,
        count: parseInt(row.count),
      })),
      topCars: topCarsResult.rows.map(row => ({
        name: row.name,
        make: row.make,
        model: row.model,
        year: row.year,
        salesCount: parseInt(row.sales_count),
        totalRevenue: parseInt(row.total_revenue),
      })),
      installments: {
        totalPlans: parseInt(installmentResult.rows[0]?.total_plans) || 0,
        totalFinanced: parseInt(installmentResult.rows[0]?.total_financed) || 0,
        avgDuration: parseFloat(installmentResult.rows[0]?.avg_duration) || 0,
      },
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
