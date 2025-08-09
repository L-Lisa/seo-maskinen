// SEO Maskinen - GDPR Privacy Policy
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integritetspolicy & GDPR - SEO Maskinen',
  description: 'Läs om vårt GDPR-kompatibla tillvägagångssätt för SEO-analys. Vi samlar aldrig personuppgifter, endast offentliga SEO-metadata. Fullständig transparens för svenska användare.',
  keywords: [
    'GDPR', 'integritetspolicy', 'personuppgifter', 'SEO-analys GDPR',
    'GDPR-kompatibel', 'dataskydd', 'SEO verktyg sverige'
  ],
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Integritetspolicy & GDPR - SEO Maskinen',
    description: 'GDPR-kompatibel SEO-analys. Vi samlar aldrig personuppgifter, endast offentliga SEO-metadata.',
    url: 'https://seomaskinen.se/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark text-light px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-light mb-8">
          Integritetspolicy - SEO Maskinen
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">
              GDPR-kompatibel SEO-analys
            </h2>
            <p className="text-gray-300 mb-4">
              SEO Maskinen utför automatiserad analys av publikt tillgängliga webbplatser 
              enligt GDPR (Art. 6.1.f - Legitimt intresse).
            </p>
            
            <h3 className="text-lg font-semibold text-light mb-3">Vad vi analyserar:</h3>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li>• <strong>HTML-metadata:</strong> Title tags, meta descriptions</li>
              <li>• <strong>Rubrikstruktur:</strong> H1, H2, H3 taggar</li>
              <li>• <strong>Grundläggande innehåll:</strong> För nyckelords-analys</li>
              <li>• <strong>Bildstatistik:</strong> Antal bilder och alt-attribut</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Datahantering
            </h2>
            <div className="text-gray-300 space-y-3">
              <p>
                <strong>✅ Inga personuppgifter samlas in:</strong> Vi crawlar endast publikt 
                tillgänglig SEO-metadata, inte användardata eller känslig information.
              </p>
              <p>
                <strong>✅ Ingen datalagring:</strong> All analys sker i realtid. 
                Webbplatsdata raderas omedelbart efter analys.
              </p>
              <p>
                <strong>✅ Transparent process:</strong> Du ser exakt vilka SEO-metrics 
                vi analyserar i vårt gränssnitt.
              </p>
              <p>
                <strong>✅ Etisk crawling:</strong> Vi respekterar robots.txt där möjligt 
                och använder rimliga timeouts.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Rättslig grund
            </h2>
            <p className="text-gray-300">
              Vår SEO-analys baseras på <strong>legitimt intresse</strong> enligt GDPR Art. 6.1.f:
            </p>
            <ul className="text-gray-300 mt-3 space-y-2 ml-6">
              <li>• Analyserar endast publikt tillgänglig information</li>
              <li>• Utför teknisk SEO-analys för affärsändamål</li>
              <li>• Inkråktar inte på individers integritet</li>
              <li>• Sammankopplar inte data med personer</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Kontakt
            </h2>
            <p className="text-gray-300">
              Har du frågor om vår datahantering? Kontakta oss på:
            </p>
            <p className="text-primary mt-2">
              <strong>kontakt [at] seo-maskinen [dot] se</strong>
            </p>
            
            <p className="text-gray-400 text-sm mt-4">
              Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
