'use client';

import { useState } from 'react';
import { sendContactEmail } from '@/lib/email-actions';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('loading');

    const formData = new FormData(e.currentTarget);

    try {
      const result = await sendContactEmail(formData);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.success);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to send message');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Contact Form */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-[#9C4A3A]">Send a Message</h2>
        
        {/* Status Messages */}
        {status === 'success' && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200">{message}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{message}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1A1A1A] dark:text-white mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C4A3A] disabled:opacity-50"
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
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C4A3A] disabled:opacity-50"
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
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C4A3A] disabled:opacity-50"
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
              disabled={isSubmitting}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9C4A3A] resize-none disabled:opacity-50"
              placeholder="Please describe your inquiry in detail..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#9C4A3A] hover:bg-[#8B3F30] disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          <p className="text-xs text-gray-600 dark:text-gray-400">
            We respect your privacy. See our <a href="/privacy" className="text-[#9C4A3A] underline">Privacy Policy</a> for details.
          </p>
        </form>
      </div>
    </>
  );
}
