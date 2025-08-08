'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase';
import type { ApiResult } from '@/types/api';

interface AnalysisResponse {
  id: string | null;
  url: string;
  analysis: any;
  crawlData: any;
  createdAt: string | null;
}

export default function AnalyzePage() {
  const { profile, loading: userLoading } = useUser();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not authenticated
  if (!userLoading && !profile) {
    router.push('/login');
    return null;
  }

  // Show loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError('');
    setSuccess('');

    try {
      // Validate URL
      if (!url.trim()) {
        setError('Webbadress krävs för analys');
        return;
      }

      // Check if user has credits
      if (profile && profile.credits <= 0) {
        setError('Du har slut på krediter. Kontakta oss för fler analyser.');
        return;
      }

      const supabase = createClient();

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          keyword: keyword.trim() || undefined,
        }),
      });

      const result: ApiResult<AnalysisResponse> = await response.json();

      if (!result.success) {
        setError(result.error || 'Ett fel uppstod vid analysen. Försök igen.');
        return;
      }

      setSuccess('Analysen startades framgångsrikt!');
      
      // Redirect to analysis results after a short delay
      setTimeout(() => {
        if (result.data?.id) {
          router.push(`/dashboard/analyze/${result.data.id}`);
        } else {
          router.push('/dashboard/history');
        }
      }, 2000);

    } catch (err) {
      setError('Ett oväntat fel uppstod. Kontrollera din internetanslutning och försök igen.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const validateUrl = (input: string): boolean => {
    try {
      new URL(input.startsWith('http') ? input : `https://${input}`);
      return true;
    } catch {
      return false;
    }
  };

  const isUrlValid = url.trim() === '' || validateUrl(url.trim());

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka till dashboard
            </Link>
          </div>
          <div className="text-2xl font-bold text-primary">
            SEO Maskinen
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light mb-2">
            Ny SEO-analys
          </h1>
          <p className="text-gray-400">
            Analysera din webbplats och få konkreta förbättringsförslag
          </p>
        </div>

        {/* Credit Status */}
        <div className="bg-dark/30 border border-gray-800 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-primary mr-2" />
              <span className="text-light">Krediter kvar</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              {profile?.credits || 0}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Varje analys kostar 1 kredit
          </p>
        </div>

        {/* Analysis Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-light mb-2">
              Webbadress *
            </label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.se eller example.se"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                url.trim() && !isUrlValid ? 'border-red-500' : 'border-gray-600'
              }`}
              disabled={isAnalyzing}
            />
            {url.trim() && !isUrlValid && (
              <p className="text-red-400 text-sm mt-1">
                Ogiltig webbadress. Kontrollera att adressen är korrekt.
              </p>
            )}
          </div>

          {/* Keyword Input */}
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-light mb-2">
              Sökord (valfritt)
            </label>
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="T.ex. 'städfirma stockholm'"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isAnalyzing}
            />
            <p className="text-gray-400 text-sm mt-1">
              Lämna tomt för allmän SEO-analys
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-400">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-400">{success}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnalyzing || !isUrlValid || !url.trim() || (profile?.credits || 0) <= 0}
            className="w-full flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyserar...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Starta analys
              </>
            )}
          </button>
        </form>

        {/* Info Section */}
        <div className="mt-8 bg-dark/30 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-light mb-3">
            Vad analyserar vi?
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>• Titel och meta-beskrivningar</li>
            <li>• Rubrikstruktur (H1, H2, H3)</li>
            <li>• Innehållskvalitet och längd</li>
            <li>• Teknisk SEO (laddningstid, mobilanpassning)</li>
            <li>• Användarvänlighet och navigering</li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            Analysen tar cirka 30-60 sekunder att slutföra.
          </p>
        </div>
      </main>
    </div>
  );
}
