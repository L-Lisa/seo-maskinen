'use client';

import { Suspense } from 'react';
import { Lock, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ComingSoonMessage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till startsidan
          </Link>
          
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-light mb-4">
            Kommer snart
          </h1>
          
          <p className="text-gray-300 mb-6">
            Vi arbetar hårt för att göra SEO Maskinen tillgänglig för alla småföretagare. 
            Just nu är vi i beta-fas och förbereder för lansering.
          </p>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Globe className="h-5 w-5 text-primary mr-2" />
              <span className="text-primary font-semibold text-sm">Beta Version</span>
            </div>
            <p className="text-gray-400 text-sm">
              Registrering och inloggning kommer att vara tillgängligt snart.
            </p>
          </div>
          
          <Link 
            href="/"
            className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Gå tillbaka till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComingSoonMessage />
    </Suspense>
  );
}
