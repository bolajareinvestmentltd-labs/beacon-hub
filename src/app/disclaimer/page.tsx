import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Beacon-Hub",
  description: "Important disclaimers regarding astrology, financial information, and marketplace services on Beacon-Hub.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#1A1A1A] dark:text-white">Disclaimer</h1>
      <div className="prose dark:prose-invert max-w-none text-[#1A1A1A] dark:text-[#F4EFEA]">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          <strong>Last Updated:</strong> May 2026
        </p>

        <section className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
          <h2 className="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-200">⚠️ Important Notice</h2>
          <p>
            Please read this disclaimer carefully before using Beacon-Hub. By accessing and using our Service, you acknowledge that you have read, understood, and agree to be bound by all terms and disclaimers contained herein.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">1. General Disclaimer</h2>
          <p>
            The information provided on beacon-hub.vercel.app is for informational purposes only. While we strive for accuracy, we make no representations or warranties of any kind regarding the completeness, accuracy, reliability, or suitability of the information.
          </p>
          <p className="mt-3">
            Use of the Service is at your own risk. Beacon-Hub assumes no responsibility for errors, omissions, or inaccuracies in the content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">2. Astrology Disclaimer</h2>
          <p>
            <strong>IMPORTANT:</strong> All horoscope readings, astrological insights, and celestial forecasts are for entertainment purposes only.
          </p>
          <ul className="list-disc pl-6 mt-3 mb-3">
            <li>Astrology is not a science and should not be relied upon for decision-making</li>
            <li>Horoscope readings do not predict the future with certainty</li>
            <li>Astrological content is AI-generated and may contain inaccuracies</li>
            <li>We do not guarantee the accuracy or usefulness of horoscope predictions</li>
            <li>Do not make major life decisions based solely on astrological information</li>
          </ul>
          <p>
            The purpose of our astrology section is entertainment and self-reflection, not guidance for critical life decisions. Users are solely responsible for any consequences resulting from reliance on astrological content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">3. News and Information Disclaimer</h2>
          <p>
            News articles and editorial content are sourced from multiple outlets and may include commentary and analysis. We do not guarantee:
          </p>
          <ul className="list-disc pl-6 mt-3 mb-3">
            <li>The accuracy of news from original sources</li>
            <li>That all viewpoints or perspectives are represented</li>
            <li>That breaking news is completely verified at time of publication</li>
            <li>That commentary reflects editorial stance rather than individual analysis</li>
          </ul>
          <p>
            Users should verify important information through primary sources before making decisions based on our reporting.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">4. Financial and Investment Disclaimer</h2>
          <p className="mb-3">
            <strong>NO FINANCIAL ADVICE:</strong> The information on Beacon-Hub does not constitute financial, investment, legal, or tax advice.
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>We do not recommend or endorse any investment, product, or service</li>
            <li>Past performance does not guarantee future results</li>
            <li>All investments carry risk, including potential loss of principal</li>
            <li>Cryptocurrency and emerging technology investments are highly speculative</li>
            <li>Consult with qualified financial advisors before making investment decisions</li>
            <li>Beacon-Hub is not a financial institution and does not offer investment services</li>
          </ul>
          <p>
            Any financial information provided is for educational purposes only. Users assume all responsibility for their financial decisions and outcomes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">5. Marketplace and Deals Disclaimer</h2>
          <p>
            Use of our marketplace constitutes agreement to the following:
          </p>
          <ul className="list-disc pl-6 mt-3 mb-3">
            <li>Users verify information about products and services independently</li>
            <li>Beacon-Hub does not guarantee quality, legality, or authenticity of listings</li>
            <li>Vendors and buyers are responsible for compliance with all applicable laws</li>
            <li>Escrow services hold funds but do not evaluate transaction legitimacy</li>
            <li>Disputes are resolved according to our marketplace policies</li>
            <li>Users assume all risk in marketplace transactions</li>
            <li>The ₦50 platform fee is non-refundable regardless of transaction outcome</li>
          </ul>
          <p className="mt-3">
            Beacon-Hub is not liable for fraudulent listings, product defects, service quality issues, or disputes between buyers and sellers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">6. Medical and Health Disclaimer</h2>
          <p>
            Health and wellness information on Beacon-Hub is for informational purposes only and not a substitute for professional medical advice.
          </p>
          <ul className="list-disc pl-6 mt-3 mb-3">
            <li>Always consult qualified healthcare professionals for medical concerns</li>
            <li>Do not use our information to diagnose or treat medical conditions</li>
            <li>Emergency medical situations require immediate professional help</li>
            <li>We do not endorse specific treatments, medications, or healthcare providers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">7. Tech and Startup Information Disclaimer</h2>
          <p>
            Technology and startup content may include:
          </p>
          <ul className="list-disc pl-6 mt-3 mb-3">
            <li>Analysis that may be outdated or incomplete</li>
            <li>Opinions that do not represent verified facts</li>
            <li>Information about companies that may face regulatory issues</li>
            <li>Predictions about technology adoption that may not materialize</li>
          </ul>
          <p className="mt-3">
            Users should conduct independent research and due diligence before making decisions based on tech news or startup coverage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">8. Third-Party Links and Content</h2>
          <p>
            Beacon-Hub is not responsible for:
          </p>
          <ul className="list-disc pl-6 mt-3 mb-3">
            <li>Content on external websites or links</li>
            <li>Third-party product or service quality</li>
            <li>Third-party privacy practices or data handling</li>
            <li>Accuracy of third-party information</li>
          </ul>
          <p className="mt-3">
            Links are provided for convenience and do not imply endorsement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">9. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, BEACON-HUB DISCLAIMS ALL WARRANTIES AND LIABILITY FOR:
          </p>
          <ul className="list-disc pl-6 mt-3 mb-3">
            <li>Any direct, indirect, incidental, or consequential damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Service interruptions or technical failures</li>
            <li>Hacking, unauthorized access, or data breaches (except where we are negligent)</li>
            <li>Actions or omissions of third parties</li>
          </ul>
          <p className="mt-3">
            Even if Beacon-Hub has been advised of the possibility of such damages, we shall not be liable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">10. Indemnification</h2>
          <p>
            You agree to indemnify and hold Beacon-Hub harmless from any claims, damages, or costs resulting from:
          </p>
          <ul className="list-disc pl-6 mt-3 mb-3">
            <li>Your use or misuse of the Service</li>
            <li>Your violation of these disclaimers or terms</li>
            <li>Your violation of any law or third-party rights</li>
            <li>Marketplace transactions you conduct</li>
            <li>Information you provide or actions you take based on our content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">11. Changes to Disclaimer</h2>
          <p>
            Beacon-Hub reserves the right to modify this disclaimer at any time. Continued use of the Service following changes constitutes acceptance of the updated disclaimer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">12. Severability</h2>
          <p>
            If any portion of this disclaimer is found to be unenforceable, the remaining portions shall remain in full force and effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">13. Contact for Disclaimer Questions</h2>
          <p>
            If you have questions about this disclaimer, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> support@beacon-hub.com<br />
            <strong>Contact Form:</strong>{" "}
            <a href="https://beacon-hub.vercel.app/contact" className="text-[#9C4A3A] underline">
              Visit our contact page
            </a>
          </p>
        </section>

        <section className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
          <p className="text-sm font-semibold text-red-800 dark:text-red-200">
            By using Beacon-Hub, you acknowledge that you have read this entire disclaimer and agree to all terms contained herein. Your use of the Service constitutes acceptance of this disclaimer.
          </p>
        </section>
      </div>
    </div>
  );
}
