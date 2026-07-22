import { NextResponse } from "next/server";
import { db } from "@/db";
import { horoscopes } from "@/db/schema";
import { validateHoroscopeReading, validateContentDepth, HoroscopeReadingsBatchSchema } from "@/lib/contentValidator";

export const maxDuration = 60;

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const isAuthorized = isVercelCron || authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  // Premium astrology prompt with structured output requirements
  const prompt = `You are a master astrologer providing daily celestial intelligence for Beacon-Hub.
Generate comprehensive daily horoscope readings for ALL 12 zodiac signs.

CRITICAL REQUIREMENTS FOR EACH READING:
- Deep reading: 150-400 words with celestial context, planetary positions, and wisdom
- Career guidance: Specific actionable advice for the professional sphere
- Love forecast: Relationship insights and romantic prospects
- Financial tip: Money and resource management guidance
- Lucky color & number: Specific color and single-digit or double-digit number
- Power affirmation: Empowering statement to guide the day
- Compatible signs: Top 3 most compatible signs for today
- Lunar phase from today (choose one: New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent)
- Fortune level: Rating from 1-5

Return ONLY a JSON array. Each object must match EXACTLY:
{
  "sign": "Aries",
  "reading": "Deep celestial reading text (150-400 words)",
  "lunarPhase": "Full Moon",
  "fortuneLevel": 4,
  "luckyColor": "Red",
  "luckyNumber": 7,
  "compatibleSigns": ["Leo", "Sagittarius", "Gemini"],
  "careerForecast": "Career guidance text",
  "loveForecast": "Love/relationships text",
  "financialTip": "Financial guidance text",
  "powerAffirmation": "Empowering affirmation statement"
}

ALL 12 SIGNS REQUIRED: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces

RETURN ONLY VALID JSON ARRAY - NO MARKDOWN, NO BACKTICKS, NO COMMENTARY.`;

  try {
    // Call Gemini 3.1 Pro with structured output
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  sign: {
                    type: "STRING",
                    enum: [
                      "Aries",
                      "Taurus",
                      "Gemini",
                      "Cancer",
                      "Leo",
                      "Virgo",
                      "Libra",
                      "Scorpio",
                      "Sagittarius",
                      "Capricorn",
                      "Aquarius",
                      "Pisces",
                    ],
                  },
                  reading: { type: "STRING" },
                  lunarPhase: { type: "STRING" },
                  fortuneLevel: { type: "NUMBER" },
                  luckyColor: { type: "STRING" },
                  luckyNumber: { type: "NUMBER" },
                  compatibleSigns: { type: "ARRAY", items: { type: "STRING" } },
                  careerForecast: { type: "STRING" },
                  loveForecast: { type: "STRING" },
                  financialTip: { type: "STRING" },
                  powerAffirmation: { type: "STRING" },
                },
              },
            },
          },
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      let errorData: any = null;
      let rawBody: string | undefined = undefined;
      try {
        errorData = await res.json();
      } catch {
        rawBody = await res.text().catch(() => undefined);
      }

      console.error("Gemini API Error:", errorData ?? rawBody);
      const retryAfter = res.headers.get('retry-after');
      const details = {
        error: "Gemini API error",
        status: res.status,
        retryAfter: retryAfter ?? undefined,
        details: errorData ?? rawBody,
      };
      return NextResponse.json(details, { status: res.status });
    }

    const data = await res.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      return NextResponse.json(
        { error: "Empty response from Gemini" },
        { status: 500 }
      );
    }

    // Parse JSON response
    let readings;
    try {
      readings = JSON.parse(textResponse);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Response:", textResponse.substring(0, 500));
      return NextResponse.json(
        { error: "Failed to parse Gemini response as JSON" },
        { status: 500 }
      );
    }

    if (!Array.isArray(readings)) {
      readings = [readings];
    }

    // Validate and process horoscope readings
    const validatedReadings = [];
    const errors = [];

    for (let i = 0; i < readings.length; i++) {
      const reading = readings[i];

      // Validate against schema
      const validation = validateHoroscopeReading(reading);
      if (!validation.valid) {
        errors.push({
          index: i,
          sign: reading.sign || "Unknown",
          error: validation.errors?.message || "Schema validation failed",
        });
        continue;
      }

      const validatedData = validation.data!;

      // Depth check on reading content
      const depthCheck = validateContentDepth({
        content: validatedData.reading,
        keywordTags: [],
      });

      if (!depthCheck.isValid) {
        console.warn(
          `${validatedData.sign} reading failed depth check:`,
          depthCheck.warnings
        );
        // Continue anyway but log warning
      }

      validatedReadings.push({
        sign: validatedData.sign,
        reading: validatedData.reading,
        lunarPhase: validatedData.lunarPhase,
        fortuneLevel: validatedData.fortuneLevel,
        luckyColor: validatedData.luckyColor,
        luckyNumber: validatedData.luckyNumber,
        compatibleSigns: validatedData.compatibleSigns,
        careerForecast: validatedData.careerForecast,
        loveForecast: validatedData.loveForecast,
        financialTip: validatedData.financialTip,
        powerAffirmation: validatedData.powerAffirmation,
        publishDate: new Date(),
      });
    }

    // Require all 12 signs
    if (validatedReadings.length < 12) {
      return NextResponse.json(
        {
          error: `Incomplete horoscope set: Only ${validatedReadings.length} of 12 signs received`,
          details: errors,
        },
        { status: 400 }
      );
    }

    // Insert into database
    const insertedReadings = await db
      .insert(horoscopes)
      .values(validatedReadings)
      .returning();

    return NextResponse.json({
      success: true,
      message: `12 Deep Celestial Intelligence Readings deployed successfully.`,
      readingsCreated: insertedReadings.length,
      validationErrors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("ASTRO CRON ERROR:", error);
    return NextResponse.json(
      {
        error: "Celestial Intelligence handshake failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}