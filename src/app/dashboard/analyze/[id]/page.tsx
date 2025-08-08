'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, TrendingUp, Target, FileText, Settings, Zap } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Analysis = Database['public']['Tables']['analyses']['Row'];

export default function AnalysisDetailPage() {
  const { profile, loading: userLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const analysisId = params.id as string;
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, [analysisId]);

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

  const fetchAnalysis = async () => {
    try {
      const supabase = createClient();
      
      const { data, error: fetchError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (fetchError) {
        setError('Kunde inte hämta analysen. Försök igen.');
        return;
      }

      // Check if analysis belongs to current user
      if (data.user_id !== profile?.id) {
        setError('Du har inte behörighet att visa denna analys.');
        return;
      }

      setAnalysis(data);
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Utmärkt';
    if (score >= 60) return 'Bra';
    if (score >= 40) return 'Behöver förbättring';
    return 'Kritisk';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Fel vid hämtning av analys</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link
              href="/dashboard/history"
              className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka till historik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Analys hittades inte</h1>
            <p className="text-gray-400 mb-6">Den begärda analysen kunde inte hittas.</p>
            <Link
              href="/dashboard/history"
              className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka till historik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const improvements = analysis.improvements ? JSON.parse(JSON.stringify(analysis.improvements)) : [];
  const contentIdeas = analysis.content_ideas ? JSON.parse(JSON.stringify(analysis.content_ideas)) : [];

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/history"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till historik
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">SEO-analys</h1>
              <p className="text-gray-400">{analysis.website_url}</p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(analysis.status)}
              <span className="text-gray-400 capitalize">{analysis.status}</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mt-2">
            Analyserad {formatDate(analysis.created_at)}
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Övergripande poäng
            </h2>
            <span className={`text-2xl font-bold ${getScoreColor(analysis.overall_score || 0)}`}>
              {analysis.overall_score || 0}/100
            </span>
          </div>
          <p className={`text-lg ${getScoreColor(analysis.overall_score || 0)}`}>
            {getScoreLabel(analysis.overall_score || 0)}
          </p>
        </div>

        {/* Detailed Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Target className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="font-semibold text-white">Titel</h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.title_score || 0)}`}>
              {analysis.title_score || 0}/100
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-green-400 mr-2" />
              <h3 className="font-semibold text-white">H1</h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.h1_score || 0)}`}>
              {analysis.h1_score || 0}/100
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Settings className="w-5 h-5 text-purple-400 mr-2" />
              <h3 className="font-semibold text-white">Meta</h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.meta_score || 0)}`}>
              {analysis.meta_score || 0}/100
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-yellow-400 mr-2" />
              <h3 className="font-semibold text-white">Innehåll</h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.content_score || 0)}`}>
              {analysis.content_score || 0}/100
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center mb-3">
              <Zap className="w-5 h-5 text-orange-400 mr-2" />
              <h3 className="font-semibold text-white">Teknik</h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.technical_score || 0)}`}>
              {analysis.technical_score || 0}/100
            </div>
          </div>
        </div>

        {/* Improvements */}
        {improvements.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Förbättringsförslag</h2>
            <div className="space-y-4">
              {improvements.map((improvement: { area: string; priority: string; issue: string; solution: string }, index: number) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{improvement.area}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      improvement.priority === 'high' ? 'bg-red-900/20 text-red-400' :
                      improvement.priority === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                      'bg-blue-900/20 text-blue-400'
                    }`}>
                      {improvement.priority === 'high' ? 'Hög prioritet' :
                       improvement.priority === 'medium' ? 'Medel prioritet' : 'Låg prioritet'}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2">{improvement.issue}</p>
                  <p className="text-green-400 text-sm">{improvement.solution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Ideas */}
        {contentIdeas.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Innehållsförslag</h2>
            <div className="space-y-3">
              {contentIdeas.map((idea: string, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-300">{idea}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Teknisk information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Sidor analyserade:</span>
              <span className="text-white ml-2">{analysis.pages_crawled || 1}</span>
            </div>
            <div>
              <span className="text-gray-400">Bearbetningstid:</span>
              <span className="text-white ml-2">
                {analysis.processing_time_seconds ? `${analysis.processing_time_seconds}s` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">OpenAI tokens:</span>
              <span className="text-white ml-2">{analysis.openai_tokens_used || 0}</span>
            </div>
            <div>
              <span className="text-gray-400">Analys-ID:</span>
              <span className="text-white ml-2 font-mono text-xs">{analysis.id}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {analysis.status === 'error' && analysis.error_message && (
          <div className="mt-8 p-6 bg-red-900/20 border border-red-500 rounded-xl">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Fel vid analys</h3>
            <p className="text-red-300">{analysis.error_message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
