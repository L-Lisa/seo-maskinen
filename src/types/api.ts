// SEO Maskinen - API Response Types

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// Specific API response types
export interface AnalysisStartResponse {
  analysis_id: string;
  status: 'processing';
  estimated_completion: string;
}

export interface UserStatsResponse {
  analyses_count: number;
  credits_remaining: number;
  last_analysis?: string;
}

export interface AnalysisResultResponse {
  id: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  overall_score?: number;
  improvements?: Array<{
    area: string;
    issue: string;
    solution: string;
    priority: string;
  }>;
  content_ideas?: string[];
  created_at: string;
}

// Helper functions for consistent API responses
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function createErrorResponse(error: string, code?: string): ApiError {
  return { success: false, error, code };
}
