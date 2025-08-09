'use client';

import Script from 'next/script';

interface AnalyticsProps {
  measurementId?: string;
}

export default function Analytics({ measurementId }: AnalyticsProps) {
  // Only render in production with valid measurement ID
  if (!measurementId || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: true,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
            // GDPR compliance settings
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>

      {/* Google Search Console verification */}
      <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || ''} />
    </>
  );
}

// Custom event tracking for SEO analysis
export const trackSeoAnalysis = (url: string, keyword: string, success: boolean) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'seo_analysis', {
      event_category: 'engagement',
      event_label: url,
      custom_parameter_keyword: keyword,
      custom_parameter_success: success,
      // GDPR compliant - no personal data
      send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    });
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    });
  }
};

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
