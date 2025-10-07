import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Simulated AI valuation logic
function calculateAIValuation(data: any) {
  const { make, model, year, mileage, condition, inspection_score } = data;
  
  // Base value calculation (simplified)
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(year);
  let baseValue = 35000; // Starting base
  
  // Depreciation by age
  baseValue -= age * 2000;
  
  // Mileage adjustment
  const mileageAdjustment = Math.max(0, (50000 - parseInt(mileage)) / 10000 * 500);
  
  // Condition bonus
  const conditionBonus = {
    'excellent': 2000,
    'very-good': 1000,
    'good': 0,
    'fair': -1500
  }[condition] || 0;
  
  // Market demand (simulated)
  const marketDemand = Math.floor(Math.random() * 2000) + 500;
  
  // Inspection bonus
  const inspectionBonus = inspection_score ? (inspection_score - 180) * 50 : 0;
  
  const marketValue = baseValue + mileageAdjustment + conditionBonus + marketDemand;
  const competitorAvg = marketValue * 0.98; // Slightly lower
  const aiSuggestedValue = marketValue + inspectionBonus;
  const finalOffer = Math.round(aiSuggestedValue * 0.99); // Slight discount for immediate offer
  
  return {
    baseValue: Math.round(baseValue),
    mileageAdjustment: Math.round(mileageAdjustment),
    conditionBonus,
    marketDemand,
    inspectionBonus: Math.round(inspectionBonus),
    marketValue: Math.round(marketValue),
    competitorAvg: Math.round(competitorAvg),
    aiSuggestedValue: Math.round(aiSuggestedValue),
    finalOffer,
    confidence: 92 + Math.floor(Math.random() * 6), // 92-97%
    comparableListings: 35 + Math.floor(Math.random() * 20),
    marketTrend: Math.random() > 0.5 ? 'increasing' : 'stable'
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      make,
      model,
      year,
      mileage,
      condition,
      inspection_score
    } = body;

    // Calculate AI valuation
    const valuation = calculateAIValuation({
      make,
      model,
      year,
      mileage,
      condition,
      inspection_score
    });

    // Store valuation in database
    const result = await pool.query(
      `INSERT INTO trade_in_valuations 
       (user_id, make, model, year, mileage, condition, inspection_score, 
        market_value, competitor_avg_price, ai_suggested_value, final_offer, valuation_data, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW() + INTERVAL '7 days')
       RETURNING *`,
      [
        user_id,
        make,
        model,
        year,
        mileage,
        condition,
        inspection_score,
        valuation.marketValue,
        valuation.competitorAvg,
        valuation.aiSuggestedValue,
        valuation.finalOffer,
        JSON.stringify(valuation)
      ]
    );

    return NextResponse.json({
      valuation: result.rows[0],
      breakdown: valuation
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating valuation:', error);
    return NextResponse.json({ error: 'Failed to create valuation' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT * FROM trade_in_valuations 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user_id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching valuations:', error);
    return NextResponse.json({ error: 'Failed to fetch valuations' }, { status: 500 });
  }
}

// Accept trade-in offer
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { valuation_id, actual_sale_price } = body;

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update valuation status
      const valuationResult = await client.query(
        'UPDATE trade_in_valuations SET status = $1 WHERE id = $2 RETURNING *',
        ['accepted', valuation_id]
      );

      if (valuationResult.rows.length === 0) {
        throw new Error('Valuation not found');
      }

      const valuation = valuationResult.rows[0];

      // Store learning data if actual sale price is provided
      if (actual_sale_price) {
        const difference = actual_sale_price - valuation.ai_suggested_value;
        const accuracyPercentage = 100 - Math.abs((difference / actual_sale_price) * 100);

        await client.query(
          `INSERT INTO trade_in_learning 
           (valuation_id, proposed_value, actual_sale_price, difference, accuracy_percentage, market_conditions)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            valuation_id,
            valuation.ai_suggested_value,
            actual_sale_price,
            difference,
            accuracyPercentage,
            JSON.stringify({ timestamp: new Date() })
          ]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json(valuationResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error accepting valuation:', error);
    return NextResponse.json({ error: error.message || 'Failed to accept valuation' }, { status: 400 });
  }
}
