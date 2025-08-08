'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, BarChart3, ExternalLink } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Analysis = Database['public']['Tables']['analyses']['Row'];

export default function HistoryPage() {
  const { profile, loading: userLoading } = useUser();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, []);

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

  const fetchAnalyses = async () => {
    try {
      const supabase = createClient();
      
      const { data, error: fetchError } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) {
        setError('Kunde inte hämta analyshistorik. Försök igen.');
        return;
      }

      setAnalyses(data || []);
    } catch {
      setError('Ett oväntat fel uppstod. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Slutförd';
      case 'error':
        return 'Fel';
      case 'processing':
        return 'Bearbetar';
      case 'pending':
        return 'Väntar';
      default:
        return 'Okänd';
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname.slice(0, 30) + (urlObj.pathname.length > 30 ? '...' : '');
    } catch {
      return url.slice(0, 50) + (url.length > 50 ? '...' : '');
    }
  };

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
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light mb-2">
            Analyshistorik
          </h1>
          <p className="text-gray-400">
            Se dina tidigare analyser och resultat
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && analyses.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-light mb-2">
              Ingen analyshistorik än
            </h3>
            <p className="text-gray-400 mb-6">
              Du har inte gjort några analyser ännu. Starta din första analys för att se resultat här.
            </p>
            <Link
              href="/dashboard/analyze"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Starta första analysen
            </Link>
          </div>
        )}

        {/* Analyses List */}
        {!loading && analyses.length > 0 && (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-dark/30 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <a
                        href={analysis.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 font-medium flex items-center"
                      >
                        {truncateUrl(analysis.website_url)}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(analysis.status)}
                        <span className="text-sm text-gray-400">
                          {getStatusText(analysis.status)}
                        </span>
                      </div>
                    </div>
                    
                    {analysis.target_keyword && (
                      <p className="text-sm text-gray-400 mb-2">
                        Sökord: <span className="text-light">{analysis.target_keyword}</span>
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      {formatDate(analysis.created_at)}
                    </p>
                  </div>

                  {/* Score Display */}
                  {analysis.status === 'completed' && analysis.overall_score !== null && (
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                        {analysis.overall_score}
                      </div>
                      <div className="text-sm text-gray-400">Totalt</div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {analysis.status === 'completed' && (
                    <Link
                      href={`/dashboard/analyze/${analysis.id}`}
                      className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Visa resultat
                    </Link>
                  )}
                  
                  {analysis.status === 'error' && (
                    <button
                      onClick={() => fetchAnalyses()}
                      className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Uppdatera
                    </button>
                  )}
                  
                  {analysis.status === 'processing' && (
                    <button
                      onClick={() => fetchAnalyses()}
                      className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Kontrollera status
                    </button>
                  )}
                </div>

                {/* Error Message */}
                {analysis.status === 'error' && analysis.error_message && (
                  <div className="mt-3 p-3 bg-red-900/20 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm">{analysis.error_message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && analyses.length >= 50 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {/* TODO: Implement pagination */}}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Ladda fler analyser
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
