import { z } from 'zod';

// ========================
// API Request Validation Schemas
// ========================

export const AnalyzeRequestSchema = z.object({
  url: z.string()
    .min(1, 'URL krävs för analys')
    .refine(
      (url) => {
        try {
          new URL(url.startsWith('http') ? url : `https://${url}`);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Ogiltig URL. Kontrollera att adressen är korrekt.' }
    ),
  userId: z.string().uuid('Ogiltigt användar-ID').optional(),
  keyword: z.string().min(1).max(100).optional().default('SEO'),
});

export const ContactRequestSchema = z.object({
  name: z.string()
    .min(1, 'Namn krävs')
    .max(100, 'Namnet är för långt'),
  email: z.string()
    .email('Ogiltig e-postadress')
    .max(255, 'E-postadressen är för lång'),
  company: z.string()
    .max(100, 'Företagsnamnet är för långt')
    .optional(),
  website: z.string()
    .url('Ogiltig webbadress')
    .optional(),
  message: z.string()
    .min(10, 'Meddelandet måste vara minst 10 tecken')
    .max(1000, 'Meddelandet är för långt'),
});

// ========================
// Authentication Validation
// ========================

export const AuthTokenSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  iat: z.number(),
  exp: z.number(),
});

// ========================
// Database Validation Schemas
// ========================

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  company: z.string().max(100).nullable(),
  credits: z.number().int().min(0),
  is_admin: z.boolean(),
});

export const AnalysisResultSchema = z.object({
  overall_score: z.number().int().min(0).max(100),
  title_score: z.number().int().min(0).max(100),
  h1_score: z.number().int().min(0).max(100),
  meta_score: z.number().int().min(0).max(100),
  content_score: z.number().int().min(0).max(100),
  technical_score: z.number().int().min(0).max(100),
  improvements: z.array(z.object({
    area: z.string(),
    issue: z.string(),
    solution: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
  })),
  content_ideas: z.array(z.string()),
  tokens_used: z.number().int().min(0),
});

// ========================
// Environment Validation
// ========================

export const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// ========================
// Type Exports
// ========================

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type ContactRequest = z.infer<typeof ContactRequestSchema>;
export type AuthToken = z.infer<typeof AuthTokenSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type EnvConfig = z.infer<typeof EnvSchema>;

// ========================
// Validation Helper Functions
// ========================

export function validateEnv(): EnvConfig {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Miljövariabler saknas eller är ogiltiga:');
    result.error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    throw new Error('Felaktiga miljövariabler. Kontrollera .env.local filen.');
  }
  return result.data;
}

export function sanitizeUrl(input: string): string {
  return input.startsWith('http') ? input : `https://${input}`;
}

export function isValidUuid(input: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(input);
}
