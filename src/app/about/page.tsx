import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Beacon-Hub | Global Intelligence Platform",
  description: "Learn about Beacon-Hub, your premier source for global news, tech startups, astrology, and verified marketplace deals.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#1A1A1A] dark:text-white">About Beacon-Hub</h1>
      
      <div className="prose dark:prose-invert max-w-none text-[#1A1A1A] dark:text-[#F4EFEA]">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">Our Mission</h2>
          <p>
            Beacon-Hub is your premium intelligence platform designed to illuminate global opportunities and insights across news, technology, astrology, and verified marketplace deals. We believe in empowering our community with accurate, timely, and diverse information.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">What We Offer</h2>
          
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="p-6 bg-[#F4EFEA] dark:bg-[#2A2A2A] rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-[#9C4A3A]">Intelligence Desk</h3>
              <p>
                Curated global news and editorial analysis covering tech, business, politics, and world events. Stay informed with real-time updates and in-depth reporting.
              </p>
            </div>
            
            <div className="p-6 bg-[#F4EFEA] dark:bg-[#2A2A2A] rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-[#9C4A3A]">Tech & Startups</h3>
              <p>
                Breaking news and analysis on emerging technologies, startup funding, innovation trends, and digital transformation reshaping industries.
              </p>
            </div>
            
            <div className="p-6 bg-[#F4EFEA] dark:bg-[#2A2A2A] rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-[#9C4A3A]">Astrology Hub</h3>
              <p>
                Daily horoscope readings for all zodiac signs, astrological insights, and celestial event updates powered by advanced AI analysis.
              </p>
            </div>
            
            <div className="p-6 bg-[#F4EFEA] dark:bg-[#2A2A2A] rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-[#9C4A3A]">Verified Marketplace</h3>
              <p>
                Secure escrow-based marketplace for vetted deals, services, and opportunities. Trade with confidence knowing funds are protected.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">Our Values</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-[#9C4A3A] mr-3 font-bold">✓</span>
              <span><strong>Accuracy:</strong> We verify information and cite credible sources</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#9C4A3A] mr-3 font-bold">✓</span>
              <span><strong>Transparency:</strong> Clear about our data practices and partnerships</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#9C4A3A] mr-3 font-bold">✓</span>
              <span><strong>Security:</strong> Protecting your data and transactions with industry standards</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#9C4A3A] mr-3 font-bold">✓</span>
              <span><strong>Community:</strong> Building a trustworthy network of informed users</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#9C4A3A] mr-3 font-bold">✓</span>
              <span><strong>Innovation:</strong> Continuously improving our platform with AI and new features</span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">Our Technology</h2>
          <p>
            Beacon-Hub is built with modern, scalable technology:
          </p>
          <ul className="list-disc pl-6 mt-3">
            <li>Next.js 16 for high-performance web experiences</li>
            <li>Vercel serverless infrastructure for global reliability</li>
            <li>Neon PostgreSQL for secure, scalable data management</li>
            <li>Google Gemini AI for astrology insights and content optimization</li>
            <li>GNews API for real-time global news aggregation</li>
            <li>Vercel Blob storage for secure media management</li>
            <li>Automated cron jobs for scheduled data updates</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">Our Team</h2>
          <p>
            Beacon-Hub is developed by a dedicated team of software engineers, data analysts, and content creators committed to providing the highest quality intelligence and marketplace services.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">Marketplace & Escrow</h2>
          <p>
            Our verified marketplace features secure escrow transactions:
          </p>
          <ul className="list-disc pl-6 mt-3">
            <li>Funds held securely during transaction verification</li>
            <li>Flat ₦50 platform fee per transaction</li>
            <li>Vendor verification and buyer protection</li>
            <li>Dispute resolution support</li>
            <li>Support for real estate, services, events, and digital goods</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">Contact & Support</h2>
          <p>
            Have questions or feedback? We'd love to hear from you!
          </p>
          <p className="mt-4">
            <strong>Email:</strong> support@beacon-hub.com<br />
            <strong>Contact Form:</strong>{" "}
            <a href="https://www.beacon-hub.com.ng/contact" className="text-[#9C4A3A] underline">
              Visit our contact page
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">Legal</h2>
          <p>
            Learn more about our commitments:
          </p>
          <ul className="list-disc pl-6 mt-3">
            <li><a href="/privacy" className="text-[#9C4A3A] underline">Privacy Policy</a></li>
            <li><a href="/terms" className="text-[#9C4A3A] underline">Terms of Service</a></li>
            <li><a href="/disclaimer" className="text-[#9C4A3A] underline">Disclaimer</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
