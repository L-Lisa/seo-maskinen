'use client'

import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import type { ContactRequest } from '@/types/seo';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactRequest>({
    name: '',
    email: '',
    company: '',
    website: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Kontaktformulär skickat (dummy):', formData);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-light mb-4">
          Tack för ditt meddelande!
        </h3>
        
        <p className="text-gray-300 mb-6">
          Vi har tagit emot ditt meddelande och återkommer så snart som möjligt.
        </p>
        
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', company: '', website: '', message: '' });
          }}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Skicka ett nytt meddelande
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-light mb-4">
          Kontakta oss
        </h3>
        
        <p className="text-gray-300">
          Har du frågor eller feedback? Vi hör gärna från dig!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-light mb-2">
              Namn *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
              placeholder="Ditt namn"
            />
          </div>

          {/* Email field temporarily hidden */}
          {/* <div>
            <label htmlFor="email" className="block text-sm font-medium text-light mb-2">
              E-post *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
              placeholder="din@email.se"
            />
          </div> */}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-light mb-2">
              Företag
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
              placeholder="Ditt företag"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-light mb-2">
              Webbplats
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
              placeholder="https://dittforetag.se"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-light mb-2">
            Meddelande *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400 resize-none"
            placeholder="Berätta vad vi kan hjälpa dig med..."
          />
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-400">
            <strong>Dummy-formulär:</strong> Detta formulär sparar inte data någonstans. 
            Det är endast för demonstration.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Skickar...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Skicka meddelande
            </>
          )}
        </button>
      </form>
    </div>
  );
}