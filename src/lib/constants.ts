// SEO Maskinen - Design System Constants

export const COLORS = {
  primary: '#10B981',      // emerald-500 - Main CTA, highlights
  secondary: '#059669',    // emerald-600 - Hover states, secondary actions  
  dark: '#111827',         // gray-900 - Main background
  light: '#F9FAFB',        // gray-50 - Light sections, cards
  accent: '#3B82F6',       // blue-500 - Links, info elements
  
  // Gray Scale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',  
  error: '#EF4444',
} as const;

export const FONTS = {
  display: 'Poppins',      // H1, Hero text, Logo
  body: 'Inter',           // All other text, UI elements
} as const;

export interface BrandConfig {
  logo: string;
  tagline: string;
  description: string;
}

export const BRAND: BrandConfig = {
  logo: "SEO Maskinen",
  tagline: "Sveriges enklaste SEO för småföretagare",
  description: "Vi hjälper småföretagare förbättra sin hemsida själva med AI-driven SEO-analys",
};

export const PERFORMANCE_LIMITS = {
  CRAWL_TIMEOUT: 90_000,        // 90 seconds
  OPENAI_TIMEOUT: 30_000,       // 30 seconds  
  MAX_CONCURRENT_CRAWLS: 5,     // Prevent memory issues
  MAX_PAGES_PER_CRAWL: 5,       // Reasonable crawl depth
  RATE_LIMIT_PER_USER: 1,       // 1 analysis per user concurrently
} as const;
