'use client';

import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import { Globe, FileText, Search, ArrowRight, User, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const { user, profile, loading, signOut } = useUser();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="fixed top-0 w-full bg-dark/80 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-bold text-primary">
            SEO Maskinen
          </Link>
          <nav className="space-x-4">
            {loading ? (
              <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center text-light hover:text-primary transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  {profile?.name || 'Dashboard'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logga ut
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-light hover:text-primary transition-colors"
                >
                  Logga in
                </Link>
                <Link
                  href="/register"
                  className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Registrera
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-light mb-6">
            {user ? (
              <>
                Välkommen tillbaka, <span className="text-primary">{profile?.name}</span>!
              </>
            ) : (
              <>
                Kontakta oss för att bli testperson med{" "}
                <span className="text-primary">Beta-access</span> till SEO Maskinen
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
            {user ? (
              <>
                Välkommen tillbaka till SEO Maskinen! 
                <Link href="/dashboard" className="text-primary hover:text-primary/80 ml-2">
                  Gå till din dashboard →
                </Link>
              </>
            ) : (
              <>
                Sveriges enklaste SEO-verktyg för småföretagare som vill förbättra sin hemsida själva
                <br />
                <span className="text-lg">
                  Har du redan ett konto?{' '}
                  <Link href="/login" className="text-primary hover:text-primary/80 underline">
                    Logga in här
                  </Link>
                </span>
              </>
            )}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-dark/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-dark/30 rounded-xl border border-gray-800">
              <Globe className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-display font-semibold text-light mb-2">
                Omfattande Analys
              </h3>
              <p className="text-gray-400">
                Få en detaljerad genomgång av din webbplats SEO-prestanda
              </p>
            </div>
            <div className="p-6 bg-dark/30 rounded-xl border border-gray-800">
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-display font-semibold text-light mb-2">
                Konkreta Tips
              </h3>
              <p className="text-gray-400">
                Tydliga rekommendationer på vad du kan förbättra
              </p>
            </div>
            <div className="p-6 bg-dark/30 rounded-xl border border-gray-800">
              <Search className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-display font-semibold text-light mb-2">
                Bättre Ranking
              </h3>
              <p className="text-gray-400">
                Öka din synlighet i sökmotorer med våra verktyg
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Only show if not logged in */}
      {!user && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-dark/30 border border-gray-800 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-light text-center mb-8">
                Bli testperson
              </h2>
              <p className="text-gray-400 text-center mb-8">
                Fyll i formuläret nedan för att ansöka om att bli testperson för SEO Maskinen.
                Vi återkommer med mer information inom kort.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SEO Maskinen. Alla rättigheter förbehållna.</p>
        </div>
      </footer>
    </div>
  );
}