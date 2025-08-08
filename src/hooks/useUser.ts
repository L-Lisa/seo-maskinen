'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/user';

interface UseUserReturn {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError('Ett fel uppstod vid autentisering');
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (err) {
        setError('Ett oväntat fel uppstod');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, company, credits, is_admin, gdpr_consent, gdpr_date')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setError('Kunde inte hämta användarprofil');
        return;
      }

      const userProfile: UserProfile = {
        id: data.id,
        email: data.email,
        name: data.name || '',
        company: data.company,
        credits: data.credits,
        is_admin: data.is_admin,
        gdpr_consent: data.gdpr_consent,
        gdpr_date: data.gdpr_date,
      };

      setProfile(userProfile);
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      setError('Ett fel uppstod vid hämtning av användarprofil');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError('Ett fel uppstod vid utloggning');
      }
    } catch (err) {
      setError('Ett oväntat fel uppstod');
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    signOut,
  };
}