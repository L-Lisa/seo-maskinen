import Link from 'next/link';
import { Globe, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Globe className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold text-light mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-light mb-4">Sidan hittades inte</h2>
        
        <p className="text-gray-300 mb-8">
          Sidan du letar efter finns inte. Den kan ha flyttats eller tagits bort.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Gå tillbaka till startsidan
        </Link>
      </div>
    </div>
  );
}
