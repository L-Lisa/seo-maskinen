'use client'

import { Mail, Globe, Clock } from 'lucide-react';

export default function ContactForm() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-light mb-4">
        Kommer snart
      </h3>
      
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
          Kontaktformulär kommer att vara tillgängligt snart.
        </p>
      </div>
      
      <div className="flex items-center justify-center text-sm text-gray-500">
        <Clock className="h-4 w-4 mr-2" />
        <span>Förbereder för lansering</span>
      </div>
    </div>
  );
}