import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Sidan hittades inte',
  description: 'Sidan du letar efter finns inte. Gå tillbaka till SEO Maskinen och starta din gratis SEO-analys istället. Sveriges enklaste SEO-verktyg för småföretagare.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark text-light flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-emerald-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Sidan hittades inte</h2>
        <p className="text-gray-400 mb-8">
          Sidan du letar efter finns inte eller har flyttats.
        </p>
        <Link
          href="/"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Gå tillbaka till startsidan
        </Link>
      </div>
    </div>
  );
}
