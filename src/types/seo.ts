// SEO Maskinen - Core Types (PRD Compliant)

// Branded types for type safety (C-2 rule)
export type UserId = string & { readonly brand: unique symbol };
export type AnalysisId = string & { readonly brand: unique symbol };
export type WebsiteUrl = string & { readonly brand: unique symbol };

// Core User interface (aligned with database.ts)
export interface User {
  id: UserId;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  website?: WebsiteUrl;
  industry?: string;
  city?: string;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  credits: number;
  gdpr_consent: boolean;
  gdpr_date: string;
}

// SEO Analysis interfaces (aligned with PRD)
export interface Improvement {
  area: string;
  score: number;
  issue: string;
  solution: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PageData {
  url: string;
  title?: string;
  h1?: string;
  content?: string;
}

export interface CrawlData {
  url: WebsiteUrl;
  keyword: string;
  title?: string;
  h1?: string;
  meta?: string;
  content?: string;
  loadTime?: number;
  mobileFriendly?: boolean;
  pages: PageData[];
  errors: string[];
}

export interface SeoAnalysis {
  id: AnalysisId;
  user_id: UserId;
  website_url: WebsiteUrl;
  target_keyword: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  overall_score: number;
  title_score: number;
  h1_score: number;
  meta_score: number;
  content_score: number;
  technical_score: number;
  improvements: Improvement[];
  content_ideas: string[];
  crawl_data: CrawlData;
  error_message?: string;
  pages_crawled: number;
  processing_time_seconds: number;
  openai_tokens_used: number;
  created_at: string;
}

// Contact Request interface
export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  company?: string;
  website?: WebsiteUrl;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

// Helper functions for branded types
export function createUserId(id: string): UserId {
  return id as UserId;
}

export function createAnalysisId(id: string): AnalysisId {
  return id as AnalysisId;
}

export function createWebsiteUrl(url: string): WebsiteUrl {
  return url as WebsiteUrl;
}