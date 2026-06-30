'use client';

import CookieConsent from 'react-cookie-consent';

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Decline"
      cookieName="beacon_hub_consent"
      expires={365}
      containerClasses="cookie-banner"
      buttonClasses="cookie-button-accept"
      declineButtonClasses="cookie-button-decline"
      enableDeclineButton
      onAccept={() => {
        // Track analytics consent
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted'
          });
        }
      }}
      onDecline={() => {
        // Disable analytics on decline
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied'
          });
        }
      }}
    >
      <div className="text-sm text-gray-700 dark:text-gray-300">
        We use cookies to improve your experience and analyze site usage. By clicking
        &quot;Accept All&quot;, you consent to the use of{' '}
        <a href="/privacy#cookies" className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800">
          all cookies
        </a>
        . You can decline non-essential cookies by clicking &quot;Decline&quot;.
      </div>
    </CookieConsent>
  );
}

declare global {
  interface Window {
    gtag?: (
      command: 'consent' | 'event' | 'config',
      action: string,
      options?: Record<string, string | boolean>
    ) => void;
  }
}
