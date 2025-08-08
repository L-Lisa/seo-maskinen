import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { AuthTokenSchema } from '@/lib/validation';
import type { UserProfile } from '@/types/user';

// ========================
// Authentication Types
// ========================

export interface AuthContext {
  user: UserProfile;
  isAuthenticated: true;
}

export interface NoAuthContext {
  user: null;
  isAuthenticated: false;
  error: string;
}

export type AuthResult = AuthContext | NoAuthContext;

// ========================
// Authentication Utilities
// ========================

/**
 * Get authenticated user from request
 * Uses proper user-scoped Supabase client instead of service role
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthResult> {
  try {
    // Create user-scoped Supabase client from request
    const supabase = createClient();
    
    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        user: null,
        isAuthenticated: false,
        error: 'Ingen giltig autentisering hittades. Logga in för att fortsätta.'
      };
    }

    // Validate token structure
    const tokenValidation = AuthTokenSchema.safeParse({
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000) - 3600, // Assume 1 hour ago for validation
      exp: Math.floor(Date.now() / 1000) + 3600, // Assume 1 hour from now
    });

    if (!tokenValidation.success) {
      return {
        user: null,
        isAuthenticated: false,
        error: 'Ogiltig token-struktur. Logga in igen.'
      };
    }

    // Get user profile from database using user-scoped client
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, company, credits, is_admin, gdpr_consent, gdpr_date')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return {
        user: null,
        isAuthenticated: false,
        error: 'Användarprofil kunde inte hämtas. Kontakta support.'
      };
    }

    // Transform database profile to UserProfile type
    const userProfile: UserProfile = {
      id: profile.id,
      email: profile.email,
      name: profile.name || '',
      company: profile.company,
      credits: profile.credits,
      is_admin: profile.is_admin,
      gdpr_consent: profile.gdpr_consent,
      gdpr_date: profile.gdpr_date,
    };

    return {
      user: userProfile,
      isAuthenticated: true,
    };

  } catch (error) {
    console.error('Authentication error:', error);
    return {
      user: null,
      isAuthenticated: false,
      error: 'Ett fel uppstod vid autentisering. Försök igen.'
    };
  }
}

/**
 * Middleware helper to require authentication
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authResult = await getAuthenticatedUser(request);
  
  if (!authResult.isAuthenticated) {
    // Log authentication failures for monitoring
    console.warn('Authentication failed:', {
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      error: authResult.error,
    });
  }
  
  return authResult;
}

/**
 * Check if user has sufficient credits
 */
export function hasAvailableCredits(user: UserProfile): boolean {
  return user.credits > 0;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: UserProfile): boolean {
  return user.is_admin;
}

/**
 * Rate limiting by user ID
 */
const userRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per user

export function checkRateLimit(userId: string): { allowed: boolean; remainingRequests: number; resetTime: number } {
  const now = Date.now();
  const userLimit = userRequestCounts.get(userId);
  
  // Reset if window expired
  if (!userLimit || now > userLimit.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW;
    userRequestCounts.set(userId, { count: 1, resetTime });
    return {
      allowed: true,
      remainingRequests: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime,
    };
  }
  
  // Check if limit exceeded
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remainingRequests: 0,
      resetTime: userLimit.resetTime,
    };
  }
  
  // Increment count
  userLimit.count++;
  userRequestCounts.set(userId, userLimit);
  
  return {
    allowed: true,
    remainingRequests: RATE_LIMIT_MAX_REQUESTS - userLimit.count,
    resetTime: userLimit.resetTime,
  };
}

/**
 * Create error response for authentication failures
 */
export function createAuthErrorResponse(error: string, status: number = 401) {
  return {
    success: false as const,
    error,
    code: 'AUTHENTICATION_ERROR',
  };
}
