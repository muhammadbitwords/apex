import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { auctionId, bidAmount, userId } = await request.json();

    if (!auctionId || !bidAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Start transaction
      await client.query("BEGIN");

      // Get current auction details
      const auctionResult = await client.query(
        "SELECT * FROM auctions WHERE id = $1",
        [auctionId]
      );

      if (auctionResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Auction not found" },
          { status: 404 }
        );
      }

      const auction = auctionResult.rows[0];

      // Check if auction is still active
      if (new Date(auction.ends_at) < new Date()) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Auction has ended" },
          { status: 400 }
        );
      }

      // Check if bid is higher than current bid
      if (bidAmount <= auction.current_bid) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Bid must be higher than current bid" },
          { status: 400 }
        );
      }

      // Insert new bid
      const bidResult = await client.query(
        `INSERT INTO bids (auction_id, user_id, amount, created_at) 
         VALUES ($1, $2, $3, NOW()) 
         RETURNING *`,
        [auctionId, userId || 1, bidAmount]
      );

      // Update auction current bid
      await client.query(
        "UPDATE auctions SET current_bid = $1 WHERE id = $2",
        [bidAmount, auctionId]
      );

      // Commit transaction
      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        bid: bidResult.rows[0],
        message: "Bid placed successfully"
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json(
      { error: "Failed to place bid" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get("auctionId");

    if (!auctionId) {
      return NextResponse.json(
        { error: "Auction ID required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT b.*, u.name as bidder_name 
         FROM bids b 
         LEFT JOIN users u ON b.user_id = u.id 
         WHERE b.auction_id = $1 
         ORDER BY b.created_at DESC`,
        [auctionId]
      );

      return NextResponse.json({
        success: true,
        bids: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}
