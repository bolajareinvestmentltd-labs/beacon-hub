import { NextResponse } from "next/server";
import { db } from "@/db";
import { astrology } from "@/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini SDK using the production variable we pulled earlier
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(request: Request) {
  // Security handshake: Ensure only Vercel's Cron scheduler can trigger this engine
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return new NextResponse("Unauthorized Execution Protocol", { status: 401 });
  }

  const todayStr = new Date().toISOString().split("T")[0];

  try {
    console.log(`🤖 Initializing Daily Performance Space Cast for date: ${todayStr}`);

    // Master Prompt commanding Gemini to return a clean, strictly formatted JSON payload
    const masterPrompt = `
      You are an elite enterprise macro-analyst and performance strategist. 
      Generate the daily executive mindset and energy vector forecasts for all 12 zodiac signs for the date: ${todayStr}.
      
      CRITICAL: You must return ONLY a raw, valid JSON array. No markdown, no enclosing grid blocks, no "json" wrappers. Just the array.
       Each object in the array must strictly follow this TypeScript structural contract:
      {
        "sign": "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo" | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces",
        "focusToken": "A single uppercase word representing the core tactical theme (e.g., CAPITULATION, LEVERAGE, PIVOT, VELOCITY)",
        "reading": "A deep, sophisticated, 3-paragraph corporate and strategic performance breakdown. Do not talk about luck or magic. Frame it around cognitive bandwidth, workflow optimization, risk mitigation, and ecosystem alignment tailored for high-achieving founders and developers.",
        "metricFocus": number (integer between 15 and 100 representing cognitive focus percentage),
        "metricRisk": number (integer between 15 and 100 representing exposure posture percentage),
        "metricVelocity": number (integer between 15 and 100 representing execution throughput percentage)
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(masterPrompt);
    const responseText = result.response.text().trim();

    // Clean up any rogue formatting wrappers if the model misbehaves
    const cleanJson = responseText
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    const parsedData = JSON.parse(cleanJson);

    if (!Array.isArray(parsedData) || parsedData.length !== 12) {
      throw new Error("Invalid matrix payload length or format from generation engine.");
    }

    // Map properties cleanly to fit our schema columns exactly
    const databasePayload = parsedData.map((item: any) => ({
      sign: item.sign.toLowerCase(), // Store lowercase for fast structural routing matching
      date: todayStr,
      focusToken: item.focusToken.toUpperCase(),
      reading: item.reading,
      metricFocus: item.metricFocus,
      metricRisk: item.metricRisk,
      metricVelocity: item.metricVelocity,
    }));

    console.log("⚡ Database connection established. Injecting new matrix blocks...");
    
    // Bulk execution insert directly into Neon
    await db.insert(astrology).values(databasePayload);

    return NextResponse.json({ success: true, processedCount: databasePayload.length, date: todayStr });
  } catch (error: any) {
    console.error("❌ Critical Error during Astro execution factory:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
