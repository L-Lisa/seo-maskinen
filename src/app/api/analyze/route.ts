export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { crawlWebsite } from '@/lib/crawler';
import { analyzeSEO } from '@/lib/openai';
import type { Database } from '@/types/database';
import type { ApiResult } from '@/types/api';
import { createSuccessResponse, createErrorResponse } from '@/types/api';
import { requireAuth, checkRateLimit, createAuthErrorResponse } from '@/lib/auth';
import { AnalyzeRequestSchema, validateEnv } from '@/lib/validation';
import type { CrawlData } from '@/types/seo';
import type { OpenAIAnalysisResult } from '@/lib/openai';
// TODO: Re-implement timeout coordination in next iteration
import { apiLogger, generateRequestId, PerformanceTracker } from '@/lib/logger';

// Remove service role client - will use user-scoped client instead

interface AnalysisResponse {
  id: string | null;
  url: string;
  analysis: OpenAIAnalysisResult;
  crawlData: CrawlData;
  createdAt: string | null;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResult<AnalysisResponse>>> {
  // DISABLED FOR COMING SOON MODE
  // Skip environment validation during build time
  // if (process.env.NODE_ENV === 'production' && !process.env.OPENAI_API_KEY) {
  //   return NextResponse.json(
  //     createErrorResponse(
  //       'Tjänsten är inte tillgänglig just nu. Försök igen senare.',
  //       'SERVICE_UNAVAILABLE'
  //     ),
  //     { status: 503 }
  //   );
  // }

  // Generate request ID for tracing
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  // Declare variables at function scope for error handling
  let userId: string | undefined;
  let originalCredits: number | undefined;
  let supabase: ReturnType<typeof createClient> | undefined;

  // Initialize performance tracker
  const perfTracker = new PerformanceTracker('analyze_website', requestId, apiLogger);

  // Log incoming request
  apiLogger.withRequest(requestId).info('Analysis request started', {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent') || undefined,
  });

  try {
    // DISABLED FOR COMING SOON MODE
    // Validate environment first (only in runtime, not build time)
    // if (process.env.NODE_ENV !== 'production' || process.env.OPENAI_API_KEY) {
    //   validateEnv();
    // }

    // Parse and validate request body
    const body = await request.json();
    const validation = AnalyzeRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          validation.error.issues[0]?.message || 'Ogiltig förfrågan',
          'INVALID_REQUEST'
        ),
        { status: 400 }
      );
    }

    const { url } = validation.data;

    // Require authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        createAuthErrorResponse(authResult.error),
        { status: 401 }
      );
    }

    const { user } = authResult;
    userId = user.id; // Store for error handling scope
    originalCredits = user.credits; // Store for rollback

    // Create user-scoped Supabase client
    supabase = createClient();

    // Log authentication success
    apiLogger.withRequest(requestId).withUser(userId).info('User authenticated', {
      credits: user.credits,
    });

    // Check rate limiting
    const rateLimit = checkRateLimit(user.id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        createErrorResponse(
          `För många förfrågningar. Försök igen om ${Math.ceil((rateLimit.resetTime - Date.now()) / 1000)} sekunder.`,
          'RATE_LIMITED'
        ),
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimit.remainingRequests.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    // Check if user has sufficient credits
    if (user.credits <= 0) {
      return NextResponse.json(
        createErrorResponse(
          'Du har slut på krediter. Kontakta oss för fler analyser.',
          'INSUFFICIENT_CREDITS'
        ),
        { status: 403 }
      );
    }

    // Parse URL (already validated by Zod schema)
    const validUrl = new URL(url.startsWith('http') ? url : `https://${url}`);

    // Log analysis start with structured data
    apiLogger.withRequest(requestId).withUser(userId).info('Starting website analysis', {
      url: validUrl.href,
    });
    
    // Step 1: Crawl the website
    const crawlData = await crawlWebsite({ url: validUrl.href, keyword: 'SEO' });
    
    apiLogger.withRequest(requestId).withUser(userId).info('Crawler completed, starting OpenAI analysis');
    
    // Step 2: Analyze with OpenAI
    const seoAnalysis = await analyzeSEO({ crawlData });
    
    apiLogger.withRequest(requestId).withUser(userId).info('OpenAI analysis completed, saving to database');

    // Step 3: Save analysis to database with authenticated user
    let savedAnalysis: Database['public']['Tables']['analyses']['Row'] | null = null;
    
    const insertPayload: Database['public']['Tables']['analyses']['Insert'] = {
      user_id: user.id,
      website_url: validUrl.href,
      status: 'completed',
      overall_score: seoAnalysis.overall_score,
      title_score: seoAnalysis.title_score,
      h1_score: seoAnalysis.h1_score,
      meta_score: seoAnalysis.meta_score,
      content_score: seoAnalysis.content_score,
      technical_score: seoAnalysis.technical_score,
      crawl_data: crawlData ? JSON.parse(JSON.stringify(crawlData)) : null,
      improvements: JSON.parse(JSON.stringify(seoAnalysis.improvements)),
      content_ideas: JSON.parse(JSON.stringify(seoAnalysis.content_ideas)),
      openai_tokens_used: seoAnalysis.tokens_used,
    };

    const { data, error: saveError } = await supabase
      .from('analyses')
      .insert([insertPayload])
      .select()
      .single();

    if (saveError) {
      apiLogger.withRequest(requestId).withUser(userId).error('Database save failed', {
        error: saveError.message,
        url: validUrl.href,
      });
      // Still return the analysis even if save fails
    } else {
      savedAnalysis = data;
      apiLogger.withRequest(requestId).withUser(userId).info('Analysis saved to database', {
        analysisId: data.id,
      });
    }

    // Credit already deducted atomically at the start - no additional update needed

    const duration = Date.now() - startTime;
    perfTracker.success({
      url: validUrl.href,
      analysisId: savedAnalysis?.id || 'none',
      totalDuration: duration,
    });

    apiLogger.withRequest(requestId).withUser(userId).info('Analysis completed successfully', {
      url: validUrl.href,
      duration,
      analysisId: savedAnalysis?.id,
    });

    // Return successful analysis
    return NextResponse.json(
      createSuccessResponse({
        id: savedAnalysis?.id ?? null,
        url: validUrl.href,
        analysis: seoAnalysis,
        crawlData: crawlData,
        createdAt: savedAnalysis?.created_at ?? null
      })
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log error with structured data
    apiLogger.withRequest(requestId).error('Analysis failed', {
      error: errorMessage,
      duration,
      userId,
    });

    // Track performance failure
    perfTracker.failure(errorMessage, { duration });
    
    // If analysis fails, try to rollback the credit deduction
    // Note: We attempt rollback but don't fail the response if rollback fails
    if (userId && originalCredits !== undefined && supabase) {
      try {
        await supabase
          .from('users')
          .update({
            credits: Math.max(0, originalCredits), // Ensure we don't go negative
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        apiLogger.withRequest(requestId).withUser(userId).info('Credit rollback successful');
      } catch (rollbackError) {
        apiLogger.withRequest(requestId).withUser(userId).error('Credit rollback failed', {
          rollbackError: rollbackError instanceof Error ? rollbackError.message : 'Unknown rollback error',
        });
        // Continue to return the analysis error to user
      }
    }
    
    // Handle specific error types with better categorization
    if (error instanceof Error) {
      // Service timeout errors
      if (error.message.includes('timed out') || error.message.includes('Insufficient time')) {
        return NextResponse.json(
          createErrorResponse(
            'Analysen tog för lång tid att slutföra. Försök med en enklare hemsida eller försök igen senare.',
            'TIMEOUT_ERROR'
          ),
          { status: 408 }
        );
      }
      
      // Circuit breaker errors  
      if (error.message.includes('currently unavailable')) {
        return NextResponse.json(
          createErrorResponse(
            'Tjänsten är tillfälligt överbelastad. Försök igen om en minut.',
            'SERVICE_UNAVAILABLE'
          ),
          { status: 503 }
        );
      }
      
      // Crawler-specific errors
      if (error.message.includes('tid') || error.message.includes('Laddningen tog för lång tid')) {
        return NextResponse.json(
          createErrorResponse(
            'Hemsidan svarade inte inom rimlig tid. Kontrollera att URL:en är korrekt och försök igen.',
            'CRAWLER_TIMEOUT'
          ),
          { status: 408 }
        );
      }
      
      // Crawler access errors (403, 404, etc)
      if (error.message.includes('Blockerad av robots.txt') || error.message.includes('kunde inte hämta')) {
        return NextResponse.json(
          createErrorResponse(
            'Hemsidan kunde inte analyseras. Den kan vara otillgänglig eller blockera automatisk analys.',
            'CRAWLER_ACCESS_DENIED'
          ),
          { status: 403 }
        );
      }
      
      // OpenAI API errors
      if (error.message.includes('OpenAI') || error.message.includes('Analysen tog för lång tid')) {
        return NextResponse.json(
          createErrorResponse(
            'AI-analysen misslyckades. Försök igen om en stund.',
            'OPENAI_ERROR'
          ),
          { status: 503 }
        );
      }

      // Diagnostic: return the actual error message to help debugging
      console.error('Unhandled analysis error:', error);
      return NextResponse.json(
        createErrorResponse(error.message, 'ANALYSIS_ERROR'),
        { status: 500 }
      )
    }
    
    // Generic error fallback
    return NextResponse.json(
      createErrorResponse('Ett oväntat fel uppstod. Försök igen eller kontakta support.', 'UNKNOWN_ERROR'),
      { status: 500 }
    );
  }
}