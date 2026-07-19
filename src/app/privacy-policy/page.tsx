import React from 'react';

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const brandName = "Beacon-Hub";

  return (
    <main className="min-h-screen bg-[#FDFDFB] text-slate-900 font-sans p-6 md:p-12 lg:p-24 selection:bg-[#C85A32] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight font-medium text-slate-950">
            Privacy Policy
          </h1>
          <p className="text-slate-600 font-mono text-xs tracking-widest uppercase">
            Effective Date: {lastUpdated} | {brandName} Executive Division
          </p>
        </div>

        {/* Content - Matured, Corporate Tone for AdSense Approval */}
        <div className="font-serif text-base md:text-lg text-slate-800 leading-relaxed space-y-8 whitespace-pre-line">
          <p>
            At {brandName}, available from https://www.beacon-hub.com.ng, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {brandName} and how we use it.
          </p>

          <h2 className="text-2xl font-sans font-semibold tracking-tight text-slate-950 mt-12 mb-4">
            1. Consent
          </h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>

          <h2 className="text-2xl font-sans font-semibold tracking-tight text-slate-950 mt-12 mb-4">
            2. Information We Collect
          </h2>
          <p>
            {brandName} is primarily a content aggregation and synthesis platform. We do not require you to create an account to view our public news or astrology feeds.

            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>

          <h2 className="text-2xl font-sans font-semibold tracking-tight text-slate-950 mt-12 mb-4">
            3. How We Use Your Information
          </h2>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc list-outside pl-6 space-y-2 marker:text-[#C85A32]">
            <li>Provide, operate, and maintain our website and content feeds.</li>
            <li>Improve, personalize, and expand our website user experience.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Communicate with you for customer service or critical updates.</li>
            <li>Send you emails if you have opted into specific newsletters.</li>
            <li>Find and prevent fraud on our escrow and transactional interfaces.</li>
          </ul>

          <h2 className="text-2xl font-sans font-semibold tracking-tight text-slate-950 mt-12 mb-4">
            4. Log Files
          </h2>
          <p>
            {brandName} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>

          <h2 className="text-2xl font-sans font-semibold tracking-tight text-slate-950 mt-12 mb-4">
            5. Advertising Partners and Cookies
          </h2>
          <p>
            You may consult this list to find the Privacy Policy for each of the advertising partners of {brandName}.
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on {brandName}, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p className="font-semibold text-slate-950">
            Note that {brandName} has no access to or control over these cookies that are used by third-party advertisers. We strictly adhere to Google AdSense program policies.
          </p>
        </div>

        {/* Closing Footer of the page */}
        <div className="border-t border-slate-200 pt-12 mt-16 text-center text-slate-500 font-mono text-xs">
          © {new Date().getFullYear()} {brandName} Operational Intelligence Division. All Rights Reserved.
        </div>

      </div>
    </main>
  );
}
