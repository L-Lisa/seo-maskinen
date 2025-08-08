'use client';

import Link from 'next/link';
import { Search, BarChart3, Zap, Shield, Globe, Users } from 'lucide-react';

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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-light mb-6">
              Sveriges enklaste
              <span className="text-primary block">SEO-verktyg</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Förbättra din hemsidas synlighet med AI-drivet SEO. Perfekt för småföretagare som vill ta kontroll över sin digitala närvaro.
            </p>
            
            {/* Beta Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-primary mr-2" />
                <span className="text-primary font-semibold">Beta Version</span>
              </div>
              <p className="text-gray-300 text-sm">
                Vi arbetar hårt för att göra SEO Maskinen tillgänglig för alla småföretagare. 
                Just nu är vi i beta-fas och förbereder för lansering.
              </p>
            </div>

            {/* Disabled CTA Button */}
            <button 
              disabled 
              className="bg-gray-600 text-gray-400 px-8 py-4 rounded-lg font-semibold text-lg cursor-not-allowed opacity-50"
            >
              Kommer snart
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-light mb-4">
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
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold text-light">SEO Maskinen</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sveriges enklaste SEO-verktyg för småföretagare
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>© 2024 SEO Maskinen</span>
              <span>•</span>
              <span>Beta Version</span>
              <span>•</span>
              <span>Kommer snart</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}