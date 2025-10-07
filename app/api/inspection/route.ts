import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const car_id = searchParams.get('car_id');

    if (!car_id) {
      return NextResponse.json({ error: 'car_id is required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT ir.*, u.full_name as inspector_name
       FROM inspection_reports ir
       LEFT JOIN users u ON ir.inspector_id = u.id
       WHERE ir.car_id = $1
       ORDER BY ir.inspection_date DESC
       LIMIT 1`,
      [car_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Inspection report not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching inspection report:', error);
    return NextResponse.json({ error: 'Failed to fetch inspection report' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      car_id,
      inspector_id,
      overall_score,
      exterior_score,
      interior_score,
      mechanical_score,
      electrical_score,
      safety_score,
      detailed_report
    } = body;

    const result = await pool.query(
      `INSERT INTO inspection_reports 
       (car_id, inspector_id, overall_score, exterior_score, interior_score, 
        mechanical_score, electrical_score, safety_score, detailed_report)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        car_id,
        inspector_id,
        overall_score,
        exterior_score,
        interior_score,
        mechanical_score,
        electrical_score,
        safety_score,
        JSON.stringify(detailed_report)
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating inspection report:', error);
    return NextResponse.json({ error: 'Failed to create inspection report' }, { status: 500 });
  }
}
