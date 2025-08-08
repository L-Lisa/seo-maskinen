import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Error messages in Swedish
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Felaktiga inloggningsuppgifter',
  EMAIL_NOT_CONFIRMED: 'Vänligen bekräfta din e-postadress',
  RATE_LIMITED: 'För många försök. Vänta en stund och försök igen',
  INVALID_EMAIL: 'Ogiltig e-postadress',
  WEAK_PASSWORD: 'Lösenordet är för svagt. Använd minst 8 tecken med siffror och bokstäver',
  USER_EXISTS: 'En användare med denna e-postadress finns redan',
  CREDITS_EXCEEDED: 'Du har använt alla dina krediter. Kontakta oss för att få fler.',
  GENERIC_ERROR: 'Något gick fel. Försök igen senare',
} as const

export const ANALYSIS_ERRORS = {
  INVALID_URL: 'Ogiltig webbadress',
  CRAWL_FAILED: 'Kunde inte analysera webbplatsen. Kontrollera att den är tillgänglig.',
  PROCESSING_ERROR: 'Ett fel uppstod under analysen. Försök igen senare.',
  NOT_FOUND: 'Analysen kunde inte hittas',
} as const

// Browser client instance
export const createClient = () => {
  // DISABLED FOR COMING SOON MODE
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Return a mock client for coming soon mode
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
      }),
    } as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Server client instance with service role for admin operations
export const createServerClient = () => {
  // DISABLED FOR COMING SOON MODE
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Return a mock client for coming soon mode
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
      }),
    } as unknown as ReturnType<typeof createSupabaseServerClient<Database>>;
  }

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name: string) {
          return undefined // We don't need cookies for admin operations
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          // No-op for admin operations
        },
        remove(name: string, options: Record<string, unknown>) {
          // No-op for admin operations
        },
      },
    }
  )
}

// User profile functions
export async function getUserProfile(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw new Error(AUTH_ERRORS.GENERIC_ERROR)
  return data
}

export async function updateUserProfile(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  profile: Database['public']['Tables']['users']['Update']
) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...profile, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw new Error(AUTH_ERRORS.GENERIC_ERROR)
  return data
}

// Analysis functions
export async function createAnalysis(
  supabase: ReturnType<typeof createClient>,
  analysis: Omit<Database['public']['Tables']['analyses']['Insert'], 'user_id'>
) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error(AUTH_ERRORS.GENERIC_ERROR)

  const { data: profile } = await supabase
    .from('users')
    .select('credits')
    .eq('id', user.id)
    .single()

  if (profile && profile.credits <= 0) {
    throw new Error(AUTH_ERRORS.CREDITS_EXCEEDED)
  }

  const { data, error } = await supabase
    .from('analyses')
    .insert({ ...analysis, user_id: user.id })
    .select()
    .single()
  
  if (error) throw new Error(ANALYSIS_ERRORS.PROCESSING_ERROR)
  return data
}

export async function getUserAnalyses(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw new Error('Kunde inte hämta dina analyser')
  return data
}

export async function getAnalysis(supabase: ReturnType<typeof createClient>, id: string) {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw new Error(ANALYSIS_ERRORS.NOT_FOUND)
  return data
}

// Contact request functions
export async function createContactRequest(
  supabase: ReturnType<typeof createClient>,
  request: Database['public']['Tables']['contact_requests']['Insert']
) {
  const { error } = await supabase
    .from('contact_requests')
    .insert(request)
  
  if (error) throw new Error('Kunde inte skicka meddelandet. Försök igen senare.')
}

// Auth functions
export async function signIn(supabase: ReturnType<typeof createClient>, email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS)
    }
    if (error.message.includes('Email not confirmed')) {
      throw new Error(AUTH_ERRORS.EMAIL_NOT_CONFIRMED)
    }
    throw new Error(AUTH_ERRORS.GENERIC_ERROR)
  }

  return data
}

export async function signUp(
  supabase: ReturnType<typeof createClient>, 
  email: string, 
  password: string,
  metadata?: { name?: string; company?: string }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      throw new Error(AUTH_ERRORS.USER_EXISTS)
    }
    if (error.message.includes('weak password')) {
      throw new Error(AUTH_ERRORS.WEAK_PASSWORD)
    }
    throw new Error(AUTH_ERRORS.GENERIC_ERROR)
  }

  return data
}

export async function signOut(supabase: ReturnType<typeof createClient>) {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('Kunde inte logga ut. Försök igen senare.')
}

// Real-time subscriptions
type AnalysisRow = Database['public']['Tables']['analyses']['Row']

export function subscribeToAnalysis(
  supabase: ReturnType<typeof createClient>,
  analysisId: string,
  callback: (analysis: AnalysisRow) => void
) {
  return supabase
    .channel(`analysis_${analysisId}`)
    .on<AnalysisRow>(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'analyses',
        filter: `id=eq.${analysisId}`
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new)
        }
      }
    )
    .subscribe()
}