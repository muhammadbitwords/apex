import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const client = await pool.connect();

    try {
      // Update transaction status
      const result = await client.query(
        `UPDATE transactions 
         SET status = $1, updated_at = NOW() 
         WHERE stripe_payment_intent_id = $2 
         RETURNING *`,
        [paymentIntent.status === "succeeded" ? "completed" : "failed", paymentIntentId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Transaction not found" },
          { status: 404 }
        );
      }

      const transaction = result.rows[0];

      // If payment succeeded and it's a purchase, update car status
      if (paymentIntent.status === "succeeded" && transaction.type === "purchase") {
        await client.query(
          `UPDATE cars SET status = $1 WHERE id = $2`,
          ["sold", transaction.car_id]
        );
      }

      return NextResponse.json({
        success: true,
        status: paymentIntent.status,
        transaction,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
