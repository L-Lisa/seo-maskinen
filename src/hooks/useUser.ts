'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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
  const initialized = useRef(false);
  const authChecked = useRef(false);

  const supabase = createClient();

  // Define fetchUserProfile BEFORE useEffect
  const fetchUserProfile = useCallback(async (userId: string) => {
    console.log('🔍 fetchUserProfile: Starting for user:', userId);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, company, credits, is_admin, gdpr_consent, gdpr_date')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('🔍 fetchUserProfile: Error:', error);
        setError('Kunde inte hämta användarprofil');
        return;
      }

      console.log('🔍 fetchUserProfile: Success, data:', data);
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
    } catch (error) {
      console.log('🔍 fetchUserProfile: Exception:', error);
      setError('Ett fel uppstod vid hämtning av användarprofil');
    }
  }, [supabase]);

  useEffect(() => {
    console.log('🔍 useEffect: Starting, initialized:', initialized.current);
    
    if (initialized.current) {
      console.log('🔍 useEffect: Already initialized, skipping');
      return;
    }
    
    initialized.current = true;

    // Validate environment variables first
    console.log('🔍 useEffect: Checking environment variables...');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // DISABLED FOR COMING SOON MODE
    if (!supabaseUrl || !supabaseKey) {
      console.log('🔍 useEffect: Missing environment variables - coming soon mode');
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    
    console.log('🔍 useEffect: Environment variables OK');

    // Get initial session
    const getInitialSession = async () => {
      if (authChecked.current) {
        console.log('🔍 getInitialSession: Already checked, skipping');
        return;
      }
      
      authChecked.current = true;
      console.log('🔍 getInitialSession: Starting...');
      
      try {
        console.log('🔍 getInitialSession: About to call supabase.auth.getSession()');
        
        // Try to get session with a simple approach
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔍 getInitialSession: Session result:', { hasSession: !!session, error });
        
        if (error) {
          console.log('🔍 getInitialSession: Auth error:', error);
          setError('Ett fel uppstod vid autentisering');
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('🔍 getInitialSession: Found user, fetching profile...');
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          console.log('🔍 getInitialSession: Profile fetch completed');
        } else {
          console.log('🔍 getInitialSession: No session found');
          // No session, user is not logged in
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.log('🔍 getInitialSession: Error (likely timeout):', error);
        // On timeout or error, assume no session and continue
        console.log('🔍 getInitialSession: Assuming no session due to error');
        setUser(null);
        setProfile(null);
      } finally {
        console.log('🔍 getInitialSession: Setting loading to false');
        setLoading(false);
      }
    };

    // Skip initial session check to avoid hanging - rely on onAuthStateChange
    console.log('🔍 useEffect: Skipping getInitialSession to avoid hanging');
    setLoading(false);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 onAuthStateChange:', event, { hasSession: !!session });
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('🔍 onAuthStateChange: SIGNED_IN, fetching profile...');
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          console.log('🔍 onAuthStateChange: Profile fetch completed');
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          console.log('🔍 onAuthStateChange: SIGNED_OUT');
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('🔍 useEffect: Cleanup');
      subscription.unsubscribe();
    };
  }, []); // Remove fetchUserProfile dependency

  // Debug: Log state changes
  useEffect(() => {
    console.log('🔍 useUser state:', { loading, user: !!user, profile: !!profile, error });
  }, [loading, user, profile, error]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError('Ett fel uppstod vid utloggning');
      }
    } catch {
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