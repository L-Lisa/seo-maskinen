import Link from 'next/link';
import { Search, BarChart3, Shield, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-light">SEO Maskinen</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                Beta Version
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8" role="banner" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-light mb-6">
              Sveriges enklaste
              <span className="text-primary block">SEO-verktyg</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Förbättra din hemsidas synlighet med AI-drivet SEO-verktyg. Få konkreta förbättringsförslag på vanlig svenska - perfekt för svenska småföretagare som vill växa online i Sverige.
            </p>
            
            {/* CTA Button */}
            <Link 
              href="/login"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              aria-label="Starta gratis SEO-analys av din webbplats"
            >
              <Search className="inline h-5 w-5 mr-2" aria-hidden="true" />
              🚀 Starta din gratis SEO-analys nu
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30" role="main" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-light mb-4">
              Varför välja SEO Maskinen?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Enkelt, snabbt och effektivt - precis som det ska vara för småföretagare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-light mb-4">AI-driven analys</h3>
              <p className="text-gray-300">
                Få detaljerade förbättringsförslag baserade på den senaste SEO-kunskapen.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-light mb-4">Enkla rapporter</h3>
              <p className="text-gray-300">
                Förstå dina resultat med tydliga och handlingsbara insikter.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-light mb-4">Säker & pålitlig</h3>
              <p className="text-gray-300">
                Din data är säker hos oss med enterprise-grade säkerhet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-light mb-4">
              Så enkelt är det
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tre enkla steg till bättre SEO-resultat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-light mb-4">Ange din webbplats</h3>
              <p className="text-gray-300">
                Skriv in din webbplats URL och låt vår AI analysera den.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-light mb-4">Få din analys</h3>
              <p className="text-gray-300">
                Vi analyserar din webbplats och ger dig detaljerade förbättringsförslag.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-light mb-4">Förbättra & växa</h3>
              <p className="text-gray-300">
                Implementera förbättringarna och se dina SEO-resultat förbättras. 
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium ml-1">
                  Starta din första analys →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-light mb-4">
              Småföretagare litar på SEO Maskinen
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Tusentals svenska företag har redan förbättrat sin synlighet online
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Testimonial 1 */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">M</span>
                </div>
                <div>
                  <p className="text-gray-300 mb-3">
                    &ldquo;Fantastiskt verktyg! Fick konkreta tips som höjde vår webbplats ranking direkt. Enkelt att förstå även för oss som inte är teknikexperter.&rdquo;
                  </p>
                  <div>
                    <p className="text-light font-semibold">Maria Andersson</p>
                    <p className="text-gray-400 text-sm">Grundare, Blomsterbutik Stockholm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">J</span>
                </div>
                <div>
                  <p className="text-gray-300 mb-3">
                    &ldquo;Sparade oss tusentals kronor på SEO-konsulter. Analysen på svenska gjorde att vi kunde implementera förbättringarna själva.&rdquo;
                  </p>
                  <div>
                    <p className="text-light font-semibold">Johan Lindberg</p>
                    <p className="text-gray-400 text-sm">VD, Byggfirma Göteborg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">S</span>
                </div>
                <div>
                  <p className="text-gray-300 mb-3">
                    &ldquo;Våra kunder hittar oss mycket lättare nu. SEO Maskinen visade oss exakt vad som behövde fixas för bättre synlighet.&rdquo;
                  </p>
                  <div>
                    <p className="text-light font-semibold">Sara Johansson</p>
                    <p className="text-gray-400 text-sm">Ägare, Restaurang Malmö</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <p className="text-gray-300">Webbplatser analyserade</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <p className="text-gray-300">Nöjda småföretagare</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
              <p className="text-gray-300">Genomsnittligt betyg</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" role="region" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-light mb-4">
              Vanliga frågor om SEO-analys
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Få svar på de vanligaste frågorna om vårt SEO-verktyg och hur det kan hjälpa ditt företag.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-light mb-3">
                Vad skiljer SEO Maskinen från andra SEO-verktyg?
              </h3>
              <p className="text-gray-300">
                Vi fokuserar på svenska småföretagare med enkla, konkreta förbättringsförslag på svenska. 
                Ingen komplicerad jargong eller dyra månadsavgifter - bara gratis, praktiska SEO-tips.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-light mb-3">
                Hur säker är min webbplatsdata?
              </h3>
              <p className="text-gray-300">
                Vi analyserar endast offentligt tillgänglig information som redan syns på din webbplats. 
                Inga personuppgifter samlas in eller lagras. Analysen sker i realtid och data raderas omedelbart efter analys.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-light mb-3">
                Kan jag använda SEO Maskinen för alla typer av webbplatser?
              </h3>
              <p className="text-gray-300">
                Ja! Vårt verktyg fungerar för alla webbplatser - företagshemsidor, webbutiker, bloggar, 
                portföljer och mer. Vi analyserar grundläggande SEO-faktorer som fungerar för alla branscher.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-light mb-3">
                Vad händer efter att jag fått min SEO-analys?
              </h3>
              <p className="text-gray-300">
                Du får en detaljerad rapport med konkreta förbättringsförslag som du kan implementera direkt. 
                Varje förslag förklaras på svenska med tips om hur du genomför förändringarna på din webbplats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-primary mr-2" />
                <span className="text-lg font-semibold text-light">SEO Maskinen</span>
              </div>
              <p className="text-gray-400 mb-4">
                Sveriges enklaste SEO-verktyg för småföretagare. Förbättra din webbplats synlighet med AI-drivet SEO på svenska.
              </p>
              <Link 
                href="/login" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <Search className="h-4 w-4 mr-2" />
                Prova gratis SEO-analys →
              </Link>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold text-light mb-4">SEO-verktyg</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-primary transition-colors">
                    Gratis webbplatsanalys
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-primary transition-colors">
                    SEO-optimering
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-primary transition-colors">
                    Nyckelordsanalys
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-light mb-4">Information</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                    Integritetspolicy
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500 text-sm">GDPR-kompatibel analys</span>
                </li>
                <li>
                  <span className="text-gray-500 text-sm">Beta Version - Gratis</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center border-t border-gray-800 pt-6">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>© 2024 SEO Maskinen</span>
              <span>•</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Integritet
              </Link>
              <span>•</span>
              <span>Utvecklat för svenska småföretagare</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}