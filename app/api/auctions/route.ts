import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    
    const result = await pool.query(
      `SELECT a.*, c.make, c.model, c.year, c.images, c.mileage,
              (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as total_bids
       FROM auctions a
       JOIN cars c ON a.car_id = c.id
       WHERE a.status = $1
       ORDER BY a.end_time ASC`,
      [status]
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json({ error: 'Failed to fetch auctions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      car_id,
      starting_price,
      reserve_price,
      start_time,
      end_time
    } = body;

    const result = await pool.query(
      `INSERT INTO auctions (car_id, starting_price, reserve_price, start_time, end_time, current_bid)
       VALUES ($1, $2, $3, $4, $5, $2)
       RETURNING *`,
      [car_id, starting_price, reserve_price, start_time, end_time]
    );

    // Update car status to auction
    await pool.query(
      'UPDATE cars SET status = $1 WHERE id = $2',
      ['auction', car_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating auction:', error);
    return NextResponse.json({ error: 'Failed to create auction' }, { status: 500 });
  }
}
