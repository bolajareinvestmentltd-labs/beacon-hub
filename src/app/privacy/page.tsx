import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Beacon-Hub",
  description: "Beacon-Hub privacy policy - learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#1A1A1A] dark:text-white">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none text-[#1A1A1A] dark:text-[#F4EFEA]">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          <strong>Last Updated:</strong> May 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">1. Introduction</h2>
          <p>
            Beacon-Hub ("we," "us," "our," or "Company") operates the www.beacon-hub.com.ng website (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Log Data: IP address, browser type, pages visited, time and date stamps</li>
            <li>Device Information: Device type, operating system, unique device identifiers</li>
            <li>Usage Data: Interaction patterns, features used, content preferences</li>
            <li>Location Data: Approximate location derived from IP address (non-precise)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">2.2 Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Newsletter Subscriptions: Email address for news updates</li>
            <li>Contact Forms: Name, email, subject, and message content</li>
            <li>User Accounts: Email, preferences, and activity history (if applicable)</li>
            <li>Marketplace Transactions: Payment information handled by third-party processors</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">2.3 Third-Party Data</h3>
          <p>
            We may receive information about you from third-party sources including analytics providers, advertising partners, and data brokers to enhance our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Delivering and improving our Service</li>
            <li>Sending newsletters and promotional communications (with consent)</li>
            <li>Personalizing your experience and content recommendations</li>
            <li>Analyzing usage patterns to optimize website performance</li>
            <li>Responding to inquiries and customer support requests</li>
            <li>Detecting, preventing, and addressing fraud and security issues</li>
            <li>Complying with legal obligations and enforcement of agreements</li>
            <li>Displaying targeted advertisements through Google AdSense</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">4. Advertising and Google AdSense</h2>
          <p>
            Beacon-Hub uses Google AdSense to display advertisements. Google and its partners may use cookies and other tracking technologies to serve ads based on your prior visits to our site and other websites.
          </p>
          <p className="mt-3">
            You can opt out of Google's advertising personalization by visiting Google's{" "}
            <a href="https://adssettings.google.com" className="text-[#9C4A3A] underline">
              Ads Settings
            </a>
            {" "}or by installing the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#9C4A3A] underline">
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">5. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies, web beacons, and similar technologies to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Remember your preferences and login information</li>
            <li>Understand how you use our Service</li>
            <li>Deliver personalized content and advertisements</li>
            <li>Analyze traffic and optimize performance</li>
          </ul>
          <p>
            You can control cookie settings through your browser. However, disabling cookies may limit functionality of our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">6. Google Analytics</h2>
          <p>
            We use Google Analytics to track visitor behavior and website performance. Google Analytics uses cookies and similar technologies to analyze how users interact with our site. Google may use this data for its own purposes as described in their{" "}
            <a href="https://policies.google.com/privacy" className="text-[#9C4A3A] underline">
              Privacy Policy
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">7. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal information. However, we may share information with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Service Providers: Hosting, analytics, email, and payment processors</li>
            <li>Advertising Partners: To deliver targeted advertisements</li>
            <li>Legal Requirements: When required by law or to protect rights</li>
            <li>Business Transfers: In case of merger, acquisition, or asset sale</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">8. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is completely secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">9. Your Rights and Choices</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Access:</strong> You may request access to your personal information</li>
            <li><strong>Correction:</strong> You may request corrections to inaccurate data</li>
            <li><strong>Deletion:</strong> You may request deletion of your data (subject to legal requirements)</li>
            <li><strong>Opt-out:</strong> You may unsubscribe from marketing communications at any time</li>
            <li><strong>Portability:</strong> You may request your data in a portable format</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">10. Children's Privacy</h2>
          <p>
            Our Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will delete it promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">11. International Data Transfers</h2>
          <p>
            Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be effective immediately upon posting to the Service. Your continued use of the Service following any changes constitutes your acceptance of the new Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#9C4A3A]">13. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> support@beacon-hub.com<br />
            <strong>Website:</strong>{" "}
            <a href="https://www.beacon-hub.com.ng/contact" className="text-[#9C4A3A] underline">
              Contact Form
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
