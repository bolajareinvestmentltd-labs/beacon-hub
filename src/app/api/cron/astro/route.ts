import { NextResponse } from "next/server";
import { db } from "@/db";
import { horoscopes } from "@/db/schema";

export async function GET() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Missing Gemini API Key in .env.local" }, { status: 500 });
  }

  const prompt = `
    Generate a daily strategic horoscope briefing for all 12 zodiac signs. 
    The tone should be 'Beacon-Hub Intelligence'—professional, insightful, and focused on macro-trends.
    Return ONLY a strictly valid JSON array of objects. No markdown formatting, no backticks, no introductory text.
    Each object must have exactly two keys: "sign" (e.g. 'Aries') and "reading" (2-3 sentences).
  `;

  try {
    // Upgraded to gemini-1.5-flash for speed and higher reliability with JSON
   const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();

    // 🚨 DEFENSIVE CHECK: Did Google return an error instead of our data?
    if (data.error) {
      console.error("Google API Error Details:", data.error);
      return NextResponse.json({ 
        error: "Google API rejected the request. Check your VS Code terminal for the exact reason.",
        details: data.error 
      }, { status: 500 });
    }

    // Double check that we actually have candidates
    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json({ error: "Gemini returned an empty response." }, { status: 500 });
    }

    let textResult = data.candidates[0].content.parts[0].text;
    
    // DEFENSIVE CHECK: AI models sometimes add ```json at the start. This strips it out so it doesn't crash our app.
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const readings = JSON.parse(textResult);

    // Format for our Neon DB
    const formattedReadings = readings.map((r: any) => ({
      sign: r.sign,
      reading: r.reading,
      publishDate: new Date(),
    }));

    // Batch insert into Neon
    await db.insert(horoscopes).values(formattedReadings);

    return NextResponse.json({ success: true, message: "12 Celestial briefings ingested." });
    
  } catch (error) {
    console.error("Astro Cron Fatal Error:", error);
    return NextResponse.json({ error: "Failed to generate celestial intelligence. Check terminal." }, { status: 500 });
  }
}