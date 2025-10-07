import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "@/lib/jwt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role, businessName, businessLicense } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["buyer", "seller", "dealer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Check if user already exists
      const existingUser = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert new user
      const result = await client.query(
        `INSERT INTO users (name, email, password_hash, phone, role, business_name, business_license, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
         RETURNING id, name, email, phone, role, business_name, business_license, created_at`,
        [name, email, passwordHash, phone || null, role, businessName || null, businessLicense || null]
      );

      const user = result.rows[0];

      // Generate session token
      const sessionToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

      // Store session in database
      await client.query(
        `INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          user.id,
          sessionToken,
          expiresAt,
          request.headers.get("x-forwarded-for") || "unknown",
          request.headers.get("user-agent") || "unknown",
        ]
      );

      // Generate JWT token for WebSocket authentication
      const jwtToken = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      return NextResponse.json({
        success: true,
        user,
        sessionToken,
        jwtToken, // NEW: JWT token for WebSocket auth
        message: "Registration successful",
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
