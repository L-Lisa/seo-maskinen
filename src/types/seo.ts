// SEO Maskinen - Frontend-Only Types

// Branded types for type safety (C-2 rule)
export type WebsiteUrl = string & { readonly brand: unique symbol };

// SEO Analysis interfaces for frontend-only tool
export interface SeoMetric {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  suggestions: string[];
}

export interface SeoAnalysisResult {
  url: WebsiteUrl;
  keyword: string;
  overallScore: number;
  metrics: {
    title: SeoMetric;
    metaDescription: SeoMetric;
    headingStructure: SeoMetric;
    keywordDensity: SeoMetric;
    urlStructure: SeoMetric;
  };
  improvements: string[];
  analyzedAt: string;
}

export interface WebsiteData {
  url: string;
  title?: string;
  metaDescription?: string;
  h1?: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  content?: string;
  images: {
    total: number;
    withAlt: number;
  };
}

// Contact Request interface
export interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  website?: string;
  message: string;
}

// Helper functions for branded types
export function createWebsiteUrl(url: string): WebsiteUrl {
  return url as WebsiteUrl;
}