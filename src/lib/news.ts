import queryString from 'query-string';

export interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export async function getLiveNews(category?: string): Promise<Article[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  
  if (!apiKey) {
    console.error("GNEWS_API_KEY is missing from environment variables.");
    return [];
  }

  // Base query: default to general breaking news or specific category keywords
  // If no category is passed, we target general news with a focus on Nigeria
  let searchQuery = "Nigeria";
  if (category) {
    searchQuery = `Nigeria AND ${category}`;
  }

  const urlParams = {
    q: searchQuery,
    lang: 'en',
    country: 'ng',
    max: 9, // 3x3 grid size for premium editorial feel
    apikey: apiKey
  };

  const targetUrl = `https://gnews.io/api/v4/search?${queryString.stringify(urlParams)}`;

  try {
    const response = await fetch(targetUrl, {
      next: { revalidate: 21600 } // Cache data for 6 hours (Incremental Static Regeneration)
    });

    if (!response.ok) {
      throw new Error(`GNews API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Failed fetching live news data:", error);
    return [];
  }
}
