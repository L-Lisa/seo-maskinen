'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, Search, BarChart3, Settings } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export default function DashboardPage() {
  const { user, profile, loading, error, signOut } = useUser();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="text-primary hover:text-primary/80"
          >
            Gå till inloggning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            SEO Maskinen
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-light">
              <User className="w-4 h-4 mr-2" />
              <span>{profile?.name || 'Användare'}</span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logga ut
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light mb-2">
            Välkommen tillbaka, {profile?.name || 'Användare'}!
          </h1>
          <p className="text-gray-400">
            Du har {profile?.credits || 0} analyser kvar denna månad.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dashboard/analyze"
            className="bg-dark/30 border border-gray-800 rounded-xl p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center mb-4">
              <Search className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-light">Ny Analys</h3>
            </div>
            <p className="text-gray-400">
              Analysera din webbplats och få förbättringsförslag
            </p>
          </Link>

          <Link
            href="/dashboard/history"
            className="bg-dark/30 border border-gray-800 rounded-xl p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-light">Analyshistorik</h3>
            </div>
            <p className="text-gray-400">
              Se dina tidigare analyser och resultat
            </p>
          </Link>

          <Link
            href="/dashboard/settings"
            className="bg-dark/30 border border-gray-800 rounded-xl p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center mb-4">
              <Settings className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-light">Inställningar</h3>
            </div>
            <p className="text-gray-400">
              Hantera ditt konto och inställningar
            </p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-dark/30 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-light mb-4">Senaste aktivitet</h2>
          <div className="text-gray-400 text-center py-8">
            <p>Ingen aktivitet än. Starta din första analys!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
