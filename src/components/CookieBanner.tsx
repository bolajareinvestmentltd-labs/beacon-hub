'use client';

import CookieConsent from 'react-cookie-consent';
import { useEffect } from 'react';

const CONSENT_COOKIE = 'beacon_hub_consent';

function hasProductionPublisherId(value?: string) {
  return Boolean(
    value &&
    /^ca-pub-\d{16}$/.test(value) &&
    !['ca-pub-1234567890123456', 'ca-pub-0000000000000000'].includes(value)
  );
}

function loadAdSense(publisherId?: string) {
  if (!hasProductionPublisherId(publisherId) || document.getElementById('google-adsense-master')) return;

  const script = document.createElement('script');
  script.id = 'google-adsense-master';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
  document.head.appendChild(script);
}

export default function CookieBanner({ publisherId }: { publisherId?: string }) {
  useEffect(() => {
    const accepted = document.cookie.split(';').some((cookie) => cookie.trim() === `${CONSENT_COOKIE}=true`);
    if (accepted) loadAdSense(publisherId);
  }, [publisherId]);

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
        loadAdSense(publisherId);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
          });
        }
      }}
      onDecline={() => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
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
