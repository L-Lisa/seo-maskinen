'use client';

import Link from 'next/link';
import { BarChart3, Globe, ArrowLeft, Clock, Zap } from 'lucide-react';

export default function DashboardPage() {
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

      {/* Coming Soon Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="max-w-2xl w-full text-center">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till startsidan
          </Link>
          
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <BarChart3 className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold text-light mb-6">
            Dashboard kommer snart
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Vi arbetar hårt för att göra SEO Maskinen tillgänglig för alla småföretagare. 
            Just nu är vi i beta-fas och förbereder för lansering.
          </p>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary mr-2" />
              <span className="text-primary font-semibold">Beta Version</span>
            </div>
            <p className="text-gray-300 mb-4">
              Dashboard-funktioner kommer att inkludera:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-primary mr-2" />
                <span>SEO-analyser</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 text-primary mr-2" />
                <span>Resultatrapporter</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-primary mr-2" />
                <span>Webbplatsövervakning</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-primary mr-2" />
                <span>Förbättringsförslag</span>
              </div>
            </div>
          </div>
          
          <Link 
            href="/"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Gå tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}
