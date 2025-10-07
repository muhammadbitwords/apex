import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'available';
    
    const result = await pool.query(
      'SELECT * FROM cars WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      seller_id,
      make,
      model,
      year,
      mileage,
      price,
      description,
      condition,
      transmission,
      fuel_type,
      color,
      vin,
      images
    } = body;

    const result = await pool.query(
      `INSERT INTO cars (seller_id, make, model, year, mileage, price, description, condition, transmission, fuel_type, color, vin, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [seller_id, make, model, year, mileage, price, description, condition, transmission, fuel_type, color, vin, images]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car listing' }, { status: 500 });
  }
}
