import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, carId, userId, type } = await request.json();

    // Validate required fields
    if (!amount || !carId || !userId || !type) {
      return NextResponse.json(
        { error: "Amount, carId, userId, and type are required" },
        { status: 400 }
      );
    }

    // Validate type (purchase, deposit, bid_deposit)
    const validTypes = ["purchase", "deposit", "bid_deposit"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid payment type" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Get user details
      const userResult = await client.query(
        "SELECT * FROM users WHERE id = $1",
        [userId]
      );

      if (userResult.rows.length === 0) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const user = userResult.rows[0];

      // Get car details
      const carResult = await client.query(
        "SELECT * FROM cars WHERE id = $1",
        [carId]
      );

      if (carResult.rows.length === 0) {
        return NextResponse.json(
          { error: "Car not found" },
          { status: 404 }
        );
      }

      const car = carResult.rows[0];

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to paisa (smallest currency unit)
        currency: "pkr",
        metadata: {
          carId: carId.toString(),
          userId: userId.toString(),
          carName: car.make + " " + car.model,
          type: type,
        },
        description: `${type === "purchase" ? "Purchase" : type === "deposit" ? "Deposit" : "Bid Deposit"} for ${car.make} ${car.model}`,
      });

      // Create transaction record
      await client.query(
        `INSERT INTO transactions (user_id, car_id, amount, type, status, stripe_payment_intent_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, carId, amount, type, "pending", paymentIntent.id]
      );

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
