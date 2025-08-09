import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { StructuredData, websiteSchema, organizationSchema } from '@/components/StructuredData';

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
    "Förbättra din hemsidas synlighet med AI-drivet SEO-verktyg. Perfekt för svenska småföretagare som vill optimera sin webbplats själva. Gratis SEO-analys på svenska.",
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
    description: 'Förbättra din hemsidas synlighet med AI-drivet SEO-verktyg. Gratis SEO-analys på svenska för småföretagare.',
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
    description: 'Förbättra din hemsidas synlighet med AI-drivet SEO-verktyg. Gratis SEO-analys på svenska.',
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
        <StructuredData data={websiteSchema} />
        <StructuredData data={organizationSchema} />
      </head>
      <body className="bg-dark text-light min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
