import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

const generateSlug = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(request: Request) {
  try {
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    let publishedCount = 0;
    
    // ⚡ Upgraded to the ultimate 2.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const gnewsKey = process.env.GNEWS_API_KEY;
    const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // ==========================================
    // PIPELINE 1: THE EXPANDED GLOBAL & LOCAL DESKS
    // ==========================================
    const newsDesks = [
      { category: "Naija Politics", query: "Nigeria politics OR Lagos government" },
      { category: "Global Politics", query: "global politics OR international relations" },
      { category: "Tech & Startups", query: "technology OR startups OR African tech funding" },
      { category: "Wealth & Real Estate", query: "business OR finance OR real estate markets" },
      { category: "Sports", query: "sports OR Premier League OR AFCON" },
      { category: "Culture", query: "entertainment OR movies OR Nollywood OR book reviews" }
    ];

    for (const desk of newsDesks) {
      // Fetching 3 per desk to keep the total volume manageable while testing (18 total news articles + 12 horoscopes)
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(desk.query)}&lang=en&max=3&apikey=${gnewsKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.articles) {
        for (const raw of data.articles) {
          let finalContent = raw.description || raw.content || "";

          try {
            const prompt = `You are a senior editor for 'Beacon-Hub', an elite, institutional wealth and news platform. 
            Expand the following news snippet into a professional, highly engaging 3-paragraph executive briefing. 
            STRICT RULES: Do not invent any new facts, numbers, or names. Only use the provided information. 
            Format cleanly without markdown bolding.
            
            Headline: ${raw.title}
            Snippet: ${finalContent}`;

            const result = await model.generateContent(prompt);
            finalContent = result.response.text();
            
            await sleep(2000); 
          } catch (aiError) {
            console.error(`AI Generation failed for ${raw.title}`, aiError);
          }

          try {
            await db.insert(articles).values({
              title: raw.title,
              slug: generateSlug(raw.title),
              content: finalContent,
              category: desk.category,
              author: "Beacon-Hub Intelligence", 
            });
            publishedCount++;
          } catch (dbError) {
            console.log(`Skipped duplicate article: ${raw.title}`);
          }
        }
      }
    }

    // ==========================================
    // PIPELINE 2: THE ASTRO DESK (All 12 Signs)
    // ==========================================
    const zodiacSigns = [
      "aries", "taurus", "gemini", "cancer", 
      "leo", "virgo", "libra", "scorpio", 
      "sagittarius", "capricorn", "aquarius", "pisces"
    ]; 
    
    for (const sign of zodiacSigns) {
      const astroRes = await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`);
      const astroData = await astroRes.json();

      if (astroData.data && astroData.data.horoscope_data) {
        const rawHoroscope = astroData.data.horoscope_data;
        const astroTitle = `${sign.charAt(0).toUpperCase() + sign.slice(1)}: Macro-Market Astrological Forecast (${todayDate})`;
        let finalAstroContent = rawHoroscope;

        try {
          const prompt = `You are a financial astrologer for 'Beacon-Hub', a high-end institutional wealth portal. 
          Rewrite the following daily horoscope so it sounds like a professional "Macro-Market Astrological Forecast". 
          Use Wall Street and executive terminology (e.g., market positioning, risk management, strategic alliances). 
          Keep it to 2 concise paragraphs.
          
          Original Horoscope: ${rawHoroscope}`;

          const result = await model.generateContent(prompt);
          finalAstroContent = result.response.text();
          
          await sleep(2000);
        } catch (aiError) {
          console.error(`AI Astro failed for ${sign}`, aiError);
        }

        try {
          await db.insert(articles).values({
            title: astroTitle,
            slug: generateSlug(astroTitle),
            content: finalAstroContent,
            category: "Astro Desk", 
            author: "Starlight Oracle", 
          });
          publishedCount++;
        } catch (dbError) {
          console.log(`Skipped duplicate Astro: ${astroTitle}`);
        }
      }
    }

    revalidatePath("/", "layout");

    return NextResponse.json({ 
      success: true, 
      message: `Global Network updated. Successfully curated and published ${publishedCount} new reports across all 7 desks.` 
    });

  } catch (error) {
    console.error("Cron Job Pipeline Error:", error);
    return NextResponse.json({ error: 'Failed to process pipeline', details: String(error) }, { status: 500 });
  }
}