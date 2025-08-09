'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, ArrowLeft, Loader2, Clock, Zap, AlertTriangle } from 'lucide-react';
import { canMakeRequest, recordSuccess, recordFailure, getUsageStats } from '@/lib/rate-limiter';
import { trackSeoAnalysis } from '@/components/Analytics';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import type { SeoAnalysisResult } from '@/types/seo';

export default function SeoAnalyzerPage() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeoAnalysisResult | null>(null);
  const [error, setError] = useState('');
  
  // Usage stats for UI
  const [usageStats, setUsageStats] = useState(getUsageStats());

  // Update usage stats periodically
  useEffect(() => {
    const updateStats = () => {
      setUsageStats(getUsageStats());
    };

    // Update immediately
    updateStats();

    // Update every minute to refresh countdown
    const interval = setInterval(updateStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Ange en webbplatsadress');
      return;
    }

    if (!keyword.trim()) {
      setError('Ange ett nyckelord');
      return;
    }

    // Check rate limits before proceeding
    const rateCheck = canMakeRequest();
    if (!rateCheck.allowed) {
      if (rateCheck.reason === 'failure_limit') {
        setError('🛑 Wow! Du har nått gränsen för misslyckade försök (40/dag). Det här skyddar både dig och våra servrar. Kom tillbaka imorgon! 🌅');
      } else {
        setError('🎯 Du har använt alla dina 5 gratis analyser idag! Kom tillbaka imorgon för fler. 🌅');
      }
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Use GDPR-compliant server-side crawling
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, keyword }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Analys misslyckades');
      }
      
      // Analyze the crawled data
      const { analyzeSeoMetrics } = await import('@/lib/seo-analyzer');
      const analysis = analyzeSeoMetrics(data.data, keyword);
      setResult(analysis);
      
      // Record successful analysis
      recordSuccess();
      setUsageStats(getUsageStats());
      
      // Track successful SEO analysis (GDPR compliant)
      trackSeoAnalysis(url, keyword, true);
    } catch (err) {
      // Record failed analysis
      recordFailure();
      setUsageStats(getUsageStats());
      
      // Track failed SEO analysis (GDPR compliant)
      trackSeoAnalysis(url, keyword, false);
      
      setError(err instanceof Error ? err.message : 'Ett fel uppstod vid analysen');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-dark text-light px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka till startsidan
            </Link>
            
            <h1 className="text-3xl font-bold text-light mb-4">
              SEO-analys för {result.url}
            </h1>
            <p className="text-gray-300">
              Nyckelord: <span className="text-primary font-semibold">{result.keyword}</span>
            </p>
          </div>

          {/* Overall Score */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8 text-center">
            <div className="text-6xl font-bold text-primary mb-2">
              {result.overallScore}
            </div>
            <p className="text-gray-300">av 100 poäng</p>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Object.entries(result.metrics).map(([key, metric]) => (
              <div key={key} className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-light mb-2">{metric.name}</h3>
                <div className="flex items-center mb-3">
                  <div className="text-2xl font-bold text-primary">
                    {metric.score}
                  </div>
                  <div className="text-gray-400 ml-1">/{metric.maxScore}</div>
                </div>
                <p className="text-sm text-gray-400 mb-3">{metric.description}</p>
                <ul className="space-y-1">
                  {metric.suggestions.map((suggestion, idx) => (
                    <li key={idx} className={`text-sm ${suggestion.startsWith('✓') ? 'text-primary' : 'text-gray-300'}`}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-light mb-4">Förbättringsförslag</h3>
              <ul className="space-y-2">
                {result.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-gray-300">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* New Analysis Button */}
          <div className="text-center">
            <button
              onClick={() => {
                setResult(null);
                setUrl('');
                setKeyword('');
                setError('');
              }}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🔍 Analysera nästa webbplats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <main className="max-w-md w-full" role="main" aria-labelledby="page-title">
        <Breadcrumb items={[{ label: 'SEO-analys' }]} />
        
        <header className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" aria-label="Tillbaka" />
            Tillbaka till startsidan
          </Link>
          
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-8 w-8 text-primary" aria-label="SEO-analys ikon" />
          </div>
          
          <h1 id="page-title" className="text-2xl font-bold text-light mb-4">
            Gratis SEO-analys för din webbplats
          </h1>
          
          <p className="text-gray-300 mb-4">
            Analysera din webbplats och få direkta förbättringsförslag för bättre SEO. 
            Läs mer om vårt <Link href="/privacy" className="text-primary hover:text-primary/80 underline">GDPR-kompatibla</Link> tillvägagångssätt.
          </p>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>GDPR-kompatibel analys:</strong> Vi crawlar endast offentligt tillgängliga SEO-metadata. 
              Inga personuppgifter samlas in eller lagras. Analysen sker i realtid och data raderas omedelbart.
            </p>
          </div>

                      <h2 className="text-lg font-semibold text-light mb-6 text-center">
              Kom igång med din analys
            </h2>

            {/* Daily Limit Counter - Simple & Playful */}
          <div className={`rounded-xl p-6 mb-8 border ${
            usageStats.isFailureLimitReached
              ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20' 
              : usageStats.isSuccessLimitReached 
                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
                             : usageStats.remainingSuccesses <= 2
               ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
                  : 'bg-gradient-to-r from-primary/10 to-emerald-600/10 border-primary/20'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {usageStats.isFailureLimitReached ? (
                <AlertTriangle className="text-red-400 h-5 w-5" />
              ) : usageStats.isSuccessLimitReached ? (
                <Clock className="text-yellow-400 h-5 w-5" />
              ) : (
                <Zap className="text-primary h-5 w-5" />
              )}
              <h3 className={`font-semibold ${
                usageStats.isFailureLimitReached ? 'text-red-400' 
                : usageStats.isSuccessLimitReached ? 'text-yellow-400' 
                : 'text-primary'
              }`}>
                {usageStats.isFailureLimitReached ? '🛑 Misslyckandegräns nådd!'
                : usageStats.isSuccessLimitReached ? '🌙 Dagens gräns nådd!' 
                : '⚡ Gratis SEO-analyser'}
              </h3>
            </div>
            
            {usageStats.isFailureLimitReached ? (
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">
                  🤔 <strong>Hmm, något verkar inte stämma!</strong> Du har haft många misslyckade försök idag. 
                  Det kan bero på att webbplatserna du testar blockerar våra crawlers.
                </p>
                <p className="text-orange-300 text-sm">
                  ⏰ <strong>Nästa reset:</strong> {usageStats.timeUntilReset} kvar till nya försök
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-300 text-sm">
                    💬 <strong>Behöver du hjälp?</strong> Kontakta oss gärna så löser vi detta tillsammans! 
                    Vi hjälper dig att hitta webbplatser som fungerar bra för SEO-analys.
                  </p>
                  <p className="text-blue-400 text-xs mt-2">
                    📧 <strong>Tips:</strong> Testa med vanliga webbplatser som inte har bot-skydd aktiverat.
                  </p>
                </div>
              </div>
            ) : usageStats.isSuccessLimitReached ? (
              <div className="space-y-2">
                             <p className="text-gray-300 text-sm">
               🎯 <strong>Fantastiskt!</strong> Du har använt alla dina 5 gratis analyser för idag.
               Du är verkligen engagerad i din SEO!
             </p>
                <p className="text-orange-300 text-sm">
                  ⏰ <strong>Nästa reset:</strong> {usageStats.timeUntilReset} kvar till nya analyser
                </p>
                <p className="text-primary text-sm">
                  💡 <strong>Pro-tips:</strong> Använd tiden till att implementera förbättringsförslagen!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                                 <p className="text-gray-300 text-sm">
                 🎯 <strong>Du har {usageStats.remainingSuccesses} av 5 gratis analyser kvar!</strong>
               </p>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    usageStats.remainingSuccesses <= 2 
                      ? 'bg-yellow-500/20 text-yellow-300' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {usageStats.remainingSuccesses} kvar
                  </div>
                </div>
                
                {usageStats.remainingSuccesses <= 2 && (
                  <p className="text-yellow-300 text-sm">
                    ⚡ <strong>Nästan slut!</strong> Använd dina kvarvarande analyser klokt.
                  </p>
                )}
                
                <p className="text-gray-400 text-xs">
                  🔄 Återställs kl 00:00 varje dag
                </p>
              </div>
            )}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-labelledby="form-heading" noValidate>
          <div className="sr-only">
            <h2 id="form-heading">SEO-analys formulär</h2>
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-light mb-2">
              Webbplatsadress
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="exempel.se eller https://exempel.se"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
                disabled={loading}
                required
                aria-describedby="url-description"
                aria-invalid={!!error && error.includes('webbplats')}
              />
              <div id="url-description" className="sr-only">
                Ange URL:en till webbplatsen du vill analysera
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-light mb-2">
              Nyckelord
            </label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ditt huvudnyckelord"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
              disabled={loading}
              required
              aria-describedby="keyword-description"
              aria-invalid={!!error && error.includes('nyckelord')}
            />
            <div id="keyword-description" className="sr-only">
              Ange det huvudnyckelord du vill optimera för
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4" role="alert" aria-live="polite">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || usageStats.isSuccessLimitReached || usageStats.isFailureLimitReached}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
              usageStats.isFailureLimitReached
                ? 'bg-red-600 text-red-300 cursor-not-allowed' 
                : usageStats.isSuccessLimitReached 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : loading 
                    ? 'bg-gray-600 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Analyserar...
              </>
            ) : usageStats.isFailureLimitReached ? (
              <>
                <AlertTriangle className="h-5 w-5 mr-2" />
                Kontakta oss för hjälp
              </>
            ) : usageStats.isSuccessLimitReached ? (
              <>
                <Clock className="h-5 w-5 mr-2" />
                Dagens gräns nådd
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                🎯 Starta SEO-analys ({usageStats.remainingSuccesses} kvar)
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Tryck Enter för att starta analysen
        </p>

        {/* SEO Information Section */}
        <section className="mt-12 bg-gray-800/50 rounded-xl p-6" role="complementary" aria-labelledby="seo-info-heading">
          <h2 id="seo-info-heading" className="text-xl font-semibold text-light mb-4 text-center">
            Vad analyserar vi?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 font-bold">T</span>
              </div>
              <h3 className="font-medium text-light mb-2">Title Tags</h3>
              <p className="text-gray-400 text-sm">
                Vi kontrollerar om din titel är optimerad för sökmotorer och innehåller ditt nyckelord.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">M</span>
              </div>
              <h3 className="font-medium text-light mb-2">Meta Descriptions</h3>
              <p className="text-gray-400 text-sm">
                Analyserar beskrivningar som visas i sökresultat för att maximera klickfrekvensen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">H</span>
              </div>
              <h3 className="font-medium text-light mb-2">Rubrikstruktur</h3>
              <p className="text-gray-400 text-sm">
                Granskar H1, H2, H3 taggar för optimal struktur och nyckelordsanvändning.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">🚀 Varför använda SEO Maskinen?</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• <strong>Snabbt:</strong> Analys på 30 sekunder</li>
              <li>• <strong>På svenska:</strong> Alla förbättringsförslag på svenska</li>
              <li>• <strong>GDPR-säkert:</strong> Inga personuppgifter lagras</li>
              <li>• <strong>Gratis:</strong> 5 analyser per dag utan registrering</li>
              <li>• <strong>Konkret:</strong> Direkta förbättringsförslag du kan implementera</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
