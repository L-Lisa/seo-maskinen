import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO-verktyg - Analysera din webbplats',
  description: 'Förbättra din hemsidas SEO med våra kraftfulla verktyg. Gratis SEO-analys på svenska för småföretagare.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
