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

    // Delete session
    await pool.query(
      "DELETE FROM user_sessions WHERE session_token = $1",
      [sessionToken]
    );

    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
