import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "car_marketplace",
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    // Find session and user
    const result = await pool.query(
      `SELECT s.id, s.user_id, s.expires_at, u.name, u.email, u.role, u.business_name, u.phone
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = $1 AND s.expires_at > NOW()`,
      [sessionToken]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const session = result.rows[0];

    return NextResponse.json({
      success: true,
      user: {
        id: session.user_id,
        name: session.name,
        email: session.email,
        role: session.role,
        businessName: session.business_name,
        phone: session.phone
      }
    });

  } catch (error) {
    console.error("Verify session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
