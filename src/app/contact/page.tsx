import type { Metadata } from "next";
import { publishArticle } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Contact Us | Beacon-Hub",
  description: "Get in touch with Beacon-Hub - send us your inquiries, feedback, or business inquiries.",
};

export default function ContactPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !subject || !message) {
      throw new Error("All fields are required");
    }

    try {
      // In production, this would send to an email service
      console.log("Contact form submission:", { name, email, subject, message });
      // TODO: Integrate with email service (Resend, SendGrid, etc.)
    } catch (error) {
      console.error("Contact form error:", error);
      throw error;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#1A1A1A] dark:text-white">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[#9C4A3A]">Get in Touch</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-[#1A1A1A] dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">
                <a href="mailto:support@beacon-hub.com" className="text-[#9C4A3A] hover:underline">
                  support@beacon-hub.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A1A1A] dark:text-white mb-2">Response Time</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We typically respond within 24-48 business hours.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A1A1A] dark:text-white mb-2">Support Categories</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• General Inquiries</li>
                <li>• Technical Support</li>
                <li>• Marketplace Issues</li>
                <li>• Business Partnerships</li>
                <li>• Feedback & Suggestions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A1A1A] dark:text-white mb-2">Hours</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monday - Friday: 9:00 AM - 6:00 PM UTC<br />
                Weekend: Limited support available
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[#F4EFEA] dark:bg-[#2A2A2A] rounded-lg">
            <h3 className="font-semibold text-[#1A1A1A] dark:text-white mb-2">Other Channels</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Follow us on social media for updates and community engagement.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[#9C4A3A]">Send a Message</h2>
          
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C4A3A]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C4A3A]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-1">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C4A3A]"
              >
                <option value="">Select a subject...</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="marketplace">Marketplace Issue</option>
                <option value="partnership">Business Partnership</option>
                <option value="feedback">Feedback & Suggestions</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C4A3A] resize-none"
                placeholder="Please describe your inquiry in detail..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#9C4A3A] hover:bg-[#8B3F30] text-white font-semibold py-3 rounded-lg transition-colors duration-300"
            >
              Send Message
            </button>

            <p className="text-xs text-gray-600 dark:text-gray-400">
              We respect your privacy. See our <a href="/privacy" className="text-[#9C4A3A] underline">Privacy Policy</a> for details.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
