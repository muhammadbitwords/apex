
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function run(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  const prompt = `
    You are a car marketplace search assistant. A user has provided the following search query: "${query}".
    Your task is to extract relevant search parameters from this query and return them as a JSON object.
    The possible search parameters are: make, model, minPrice, maxPrice, year, mileage, color, features, transmission, engineType, bodyType, minMileage, maxMileage, minEngineCC, maxEngineCC.
    The features can be an array of strings.
    Ensure that the values for 'make' and 'model' are properly capitalized (e.g., 'Toyota', 'Corolla').
    For example, if the user says "a red toyota camry under $20000 from 2022 with less than 50000 miles and has a sunroof", you should return:
    {
      "make": "toyota",
      "model": "camry",
      "maxPrice": 20000,
      "year": 2022,
      "mileage": 50000,
      "color": "red",
      "features": ["sunroof"]
    }
    If the user says "a reliable and fuel-efficient car for a small family", you can suggest some popular models that fit this description.
    For example:
    {
        "make": ["Honda", "Toyota", "Subaru"],
        "model": ["Civic", "Corolla", "Impreza"],
        "features": ["fuel-efficient", "high safety rating"]
    }
    Only return the JSON object, with no other text or explanations.
    `;

  try {
    const aiResponse = await run(prompt);
    // Extract JSON from the markdown block
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
    const jsonResponse = JSON.parse(jsonString);
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error with AI search:", error);
    return NextResponse.json({ error: "Failed to process AI search query." }, { status: 500 });
  }
}
