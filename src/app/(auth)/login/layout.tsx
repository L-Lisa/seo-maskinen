import type { Metadata } from 'next';
import { StructuredData, softwareApplicationSchema, serviceSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Gratis SEO-analys - Analysera din webbplats nu',
  description: 'Starta din gratis SEO-analys på 30 sekunder! Få konkreta förbättringsförslag på svenska för title tags, meta descriptions och nyckelord. 5 analyser per dag - ingen registrering krävs.',
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
    description: 'Starta din gratis SEO-analys på 30 sekunder! Få konkreta förbättringsförslag på svenska. 5 analyser per dag - ingen registrering krävs.',
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
