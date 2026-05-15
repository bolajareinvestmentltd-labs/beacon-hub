import { NextResponse } from "next/server";
import { db } from "@/db";
import { horoscopes } from "@/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  try {
    // FORCE STABLE v1 ENDPOINT
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the absolute stable identifier
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    }, { apiVersion: 'v1' }); // <--- This forces the stable production route

    const prompt = `Generate a daily strategic horoscope briefing for all 12 zodiac signs. 
    Return ONLY a raw JSON array of objects. No markdown.
    Each object: {"sign": "Aries", "reading": "2 sentences"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResult = response.text();
    
    // Clean up any AI chatter
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const readings = JSON.parse(textResult);

    const formattedReadings = readings.map((r: any) => ({
      sign: r.sign,
      reading: r.reading,
      publishDate: new Date(),
    }));

    await db.insert(horoscopes).values(formattedReadings);

    return NextResponse.json({ success: true, message: "12 briefings ingested into Neon." });
    
  } catch (error: any) {
    console.error("STABLE ROUTE ERROR:", error);
    return NextResponse.json({ 
      error: "Handshake Failed on Stable Route", 
      message: error.message 
    }, { status: 500 });
  }
}