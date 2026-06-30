import type { Metadata } from "next";
import { sendContactEmail } from "@/lib/email-actions";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Beacon-Hub",
  description: "Get in touch with Beacon-Hub - send us your inquiries, feedback, or business inquiries.",
};

export default function ContactPage() {
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

        {/* Contact Form Component */}
        <ContactForm />
      </div>
    </div>
  );
}
