import { NextResponse } from "next/server";
import { db } from "@/db";
import { astrology } from "@/db/schema";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return new NextResponse("Unauthorized Execution Protocol", { status: 401 });
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const apiKey = process.env.GEMINI_API_KEY || "";

  try {
    console.log(`🤖 Initializing Daily Performance Space Cast for date: ${todayStr}`);

    const masterPrompt = `
      You are an elite enterprise macro-analyst and performance strategist. 
      Generate the daily executive mindset and energy vector forecasts for all 12 zodiac signs for the date: ${todayStr}.
      
      CRITICAL: Return ONLY a raw JSON array.
      Format:
      [
        {
          "sign": "aries",
          "focusToken": "VELOCITY",
          "reading": "A 3-paragraph executive breakdown...",
          "metricFocus": 85,
          "metricRisk": 42,
          "metricVelocity": 91
        }
      ]
    `;

    // ⚡ Bypassing the SDK: Native REST call to the stable v1 API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: masterPrompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google API REST Error: ${response.status} - ${errText}`);
    }

    const result = await response.json();
    const responseText = result.candidates[0].content.parts[0].text.trim();

    const cleanJson = responseText.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    const parsedData = JSON.parse(cleanJson);

    if (!Array.isArray(parsedData) || parsedData.length !== 12) {
      throw new Error("Invalid matrix payload length.");
    }

    const databasePayload = parsedData.map((item: any) => ({
      sign: item.sign.toLowerCase(),
      date: todayStr,
      focusToken: item.focusToken.toUpperCase(),
      reading: item.reading,
      metricFocus: item.metricFocus,
      metricRisk: item.metricRisk,
      metricVelocity: item.metricVelocity,
    }));
    
    await db.insert(astrology).values(databasePayload);
    return NextResponse.json({ success: true, processedCount: databasePayload.length, date: todayStr });
  } catch (error: any) {
    console.error("❌ Execution Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
