'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, CreditCard, Shield, Trash2, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase';

interface ProfileForm {
  name: string;
  company: string;
  email: string;
  gdpr_consent: boolean;
}

export default function SettingsPage() {
  const { profile, loading: userLoading } = useUser();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    company: '',
    email: '',
    gdpr_consent: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        company: profile.company || '',
        email: profile.email || '',
        gdpr_consent: profile.gdpr_consent || false,
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          gdpr_consent: form.gdpr_consent,
          gdpr_date: form.gdpr_consent ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile?.id);

      if (updateError) {
        setError('Kunde inte spara ändringar. Försök igen.');
        return;
      }

      setSuccess('Inställningar sparade framgångsrikt!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Ett oväntat fel uppstod. Försök igen.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Är du säker på att du vill ta bort ditt konto? Detta går inte att ångra.')) {
      return;
    }

    try {
      const supabase = createClient();

      // Delete user data first
      const { error: deleteDataError } = await supabase
        .from('analyses')
        .delete()
        .eq('user_id', profile?.id);

      if (deleteDataError) {
        setError('Kunde inte ta bort användardata. Kontakta support.');
        return;
      }

      // Delete user profile
      const { error: deleteProfileError } = await supabase
        .from('users')
        .delete()
        .eq('id', profile?.id);

      if (deleteProfileError) {
        setError('Kunde inte ta bort användarprofil. Kontakta support.');
        return;
      }

      // Sign out and redirect
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      setError('Ett fel uppstod vid borttagning av konto. Kontakta support.');
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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light mb-2">
            Inställningar
          </h1>
          <p className="text-gray-400">
            Hantera ditt konto och inställningar
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

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-400">{success}</span>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-dark/30 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-light">Profilinformation</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-light mb-2">
                Namn
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ditt namn"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-light mb-2">
                Företag
              </label>
              <input
                id="company"
                type="text"
                value={form.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Företagsnamn (valfritt)"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light mb-2">
                E-postadress
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="din@email.se"
              />
            </div>
          </div>
        </div>

        {/* Credits Section */}
        <div className="bg-dark/30 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-light">Krediter</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Krediter kvar</p>
              <p className="text-2xl font-bold text-primary">{profile?.credits || 0}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Varje analys kostar 1 kredit</p>
              <p className="text-sm text-gray-500">Kontakta oss för fler krediter</p>
            </div>
          </div>
        </div>

        {/* GDPR Section */}
        <div className="bg-dark/30 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-light">Integritet och GDPR</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.gdpr_consent}
                onChange={(e) => handleInputChange('gdpr_consent', e.target.checked)}
                className="mt-1 w-4 h-4 text-primary bg-gray-800 border-gray-600 rounded focus:ring-primary focus:ring-2"
              />
              <div>
                <p className="text-light font-medium">Jag godkänner behandling av mina personuppgifter</p>
                <p className="text-sm text-gray-400">
                  Vi behandlar endast dina uppgifter för att tillhandahålla SEO-analyser. 
                  Du kan när som helst begära att dina uppgifter raderas.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sparar...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Spara ändringar
              </>
            )}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Trash2 className="w-5 h-5 text-red-400 mr-2" />
            <h2 className="text-xl font-semibold text-light">Farlig zon</h2>
          </div>

          <p className="text-gray-400 mb-4">
            Ta bort ditt konto permanent. Detta går inte att ångra och alla dina data kommer att raderas.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5 mr-2 inline" />
            Ta bort konto
          </button>
        </div>
      </main>
    </div>
  );
}
