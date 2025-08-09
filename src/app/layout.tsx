import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { StructuredData, websiteSchema, organizationSchema, localBusinessSchema } from '@/components/StructuredData';
import Analytics from '@/components/Analytics';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SEO Maskinen - Sveriges enklaste SEO-verktyg för småföretagare",
    template: "%s | SEO Maskinen"
  },
  description:
    "Sveriges enklaste SEO-verktyg för småföretagare! Få AI-drivet SEO-analys på svenska med konkreta förbättringsförslag. 5 gratis analyser per dag - starta direkt utan registrering.",
  keywords: [
    "SEO-verktyg",
    "SEO Sverige",
    "småföretagare SEO", 
    "webbplats optimering",
    "sökmotoroptimering",
    "gratis SEO analys",
    "svenska SEO verktyg",
    "hemsida SEO",
    "digital marknadsföring",
    "AI SEO"
  ],
  authors: [{ name: "SEO Maskinen Team" }],
  creator: "SEO Maskinen",
  publisher: "SEO Maskinen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://seomaskinen.se'),
  alternates: {
    canonical: '/',
    languages: {
      'sv-SE': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://seomaskinen.se',
    title: 'SEO Maskinen - Sveriges enklaste SEO-verktyg för småföretagare',
    description: 'Sveriges enklaste SEO-verktyg för småföretagare! Få AI-drivet SEO-analys på svenska med konkreta förbättringsförslag. 5 gratis analyser per dag.',
    siteName: 'SEO Maskinen',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Maskinen - Sveriges enklaste SEO-verktyg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Maskinen - Sveriges enklaste SEO-verktyg',
    description: 'Sveriges enklaste SEO-verktyg för småföretagare! AI-drivet SEO-analys på svenska. 5 gratis analyser per dag.',
    images: ['/og-image.jpg'],
    creator: '@seomaskinen',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      'msvalidate.01': 'microsoft-verification-code',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${inter.variable} ${poppins.variable}`}>
          <head>
      {/* Preload critical resources for Core Web Vitals */}
      <link rel="preload" href="/favicon.svg" as="image" type="image/svg+xml" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Critical CSS for faster LCP */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .bg-dark { background-color: #111827 }
          .text-light { color: #f9fafb }
          .text-primary { color: #10b981 }
          .min-h-screen { min-height: 100vh }
          .font-sans { font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif }
        `
      }} />
      
      <StructuredData data={websiteSchema} />
      <StructuredData data={organizationSchema} />
      <StructuredData data={localBusinessSchema} />
    </head>
      <body className="bg-dark text-light min-h-screen font-sans">
        <Analytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        {children}
      </body>
    </html>
  );
}
