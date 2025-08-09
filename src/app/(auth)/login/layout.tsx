import type { Metadata } from 'next';
import { StructuredData, softwareApplicationSchema, serviceSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Gratis SEO-analys - Analysera din webbplats nu',
  description: 'Få en komplett SEO-analys av din webbplats på svenska. Analysera title tags, meta descriptions, nyckelord och mer. Helt gratis för småföretagare.',
  keywords: [
    'gratis SEO analys',
    'webbplats analys', 
    'SEO test',
    'hemsida granskning',
    'sökmotoroptimering test',
    'SEO checkup',
    'webbsida SEO',
    'svenska SEO analys'
  ],
  openGraph: {
    title: 'Gratis SEO-analys - Analysera din webbplats nu | SEO Maskinen',
    description: 'Få en komplett SEO-analys av din webbplats på svenska. Analysera title tags, meta descriptions, nyckelord och mer.',
    url: 'https://seomaskinen.se/login',
  },
  alternates: {
    canonical: '/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={softwareApplicationSchema} />
      <StructuredData data={serviceSchema} />
      {children}
    </>
  );
}
