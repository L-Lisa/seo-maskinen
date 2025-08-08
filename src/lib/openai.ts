import OpenAI from 'openai'
import type { CrawlData, Improvement } from '@/types/seo'
import { PERFORMANCE_LIMITS } from '@/lib/constants'

// ========================
// OpenAI-specific Types  
// ========================

export interface OpenAIAnalysisResult {
  overall_score: number;
  title_score: number;
  h1_score: number;
  meta_score: number;
  content_score: number;
  technical_score: number;
  improvements: Improvement[];
  content_ideas: string[];
  tokens_used: number;
}

// Legacy type - use OpenAIAnalysisResult instead
export type SeoAnalysis = OpenAIAnalysisResult;

export type AnalyzeOptions = {
  targetKeyword?: string
  businessType?: string
  location?: string
  language: 'sv'
  model: 'gpt-4o-mini'
  temperature: number
  timeoutMs: number
}

export interface AnalyzeParams {
  crawlData: CrawlData;
  options?: {
    targetKeyword?: string;
    businessType?: string;
    location?: string;
    model?: 'gpt-4o-mini';
    temperature?: number;
  };
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

// ========================
// Constants & Defaults
// ========================

const DEFAULT_OPTIONS = {
  model: 'gpt-4o-mini' as const,
  temperature: 0.3,
  timeout: PERFORMANCE_LIMITS.OPENAI_TIMEOUT,
};

const ERROR_MESSAGES = {
  NO_API_KEY: 'Saknar OpenAI-nyckel. Kontakta support om problemet kvarstår.',
  TIMEOUT: 'Analysen tog för lång tid. Försök igen.',
  RATE_LIMIT: 'För många förfrågningar just nu. Försök igen om en liten stund.',
  SERVER_ERROR: 'Ett tillfälligt fel uppstod. Försök igen senare.',
  GENERIC: 'Kunde inte analysera innehållet. Försök igen senare.',
  INVALID_RESPONSE: 'Ogiltigt svar från analysen. Försök igen.',
} as const

// ========================
// OpenAI client - DISABLED FOR COMING SOON MODE
// ========================

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// Mock client for coming soon mode
export const openai: OpenAI | null = null;

// ========================
// Helpers
// ========================

function normalizeCrawlData(input: CrawlData): CrawlData {
  return {
    url: input.url,
    keyword: input.keyword,
    title: (input.title ?? '').toString().trim(),
    h1: (input.h1 ?? '').toString().trim(),
    meta: (input.meta ?? '').toString().trim(),
    content: (input.content ?? '').toString().replace(/\s+/g, ' ').trim().slice(0, 10_000),
    loadTime: input.loadTime,
    mobileFriendly: input.mobileFriendly,
    pages: input.pages ?? [],
    errors: input.errors ?? []
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function stripCodeFences(text: string): string {
  const fenced = text.trim().replace(/^```(json)?/i, '').replace(/```$/i, '').trim()
  const firstBrace = fenced.indexOf('{')
  const lastBrace = fenced.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return fenced.slice(firstBrace, lastBrace + 1)
  }
  return fenced
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNumberInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === 'string')
}

function isImprovement(value: unknown): value is Improvement {
  if (!isRecord(value)) return false
  const area = value['area']
  const issue = value['issue']
  const fix = value['fix']
  const impact = value['impact']
  return (
    (area === 'Titel' || area === 'H1' || area === 'Meta' || area === 'Innehåll' || area === 'Teknik') &&
    isString(issue) &&
    isString(fix) &&
    (impact === 'låg' || impact === 'medel' || impact === 'hög')
  )
}

function validateSeoAnalysis(obj: unknown): obj is SeoAnalysis {
  if (!isRecord(obj)) return false
  const scores = obj['scores']
  if (!isRecord(scores)) return false
  if (
    !isNumberInRange(scores['overall'], 0, 100) ||
    !isNumberInRange(scores['title'], 0, 100) ||
    !isNumberInRange(scores['h1'], 0, 100) ||
    !isNumberInRange(scores['meta'], 0, 100) ||
    !isNumberInRange(scores['content'], 0, 100) ||
    !isNumberInRange(scores['technical'], 0, 100)
  ) return false

  const quickWins = obj['quickWins']
  if (!isStringArray(quickWins)) return false

  const improvements = obj['improvements']
  if (!Array.isArray(improvements) || !improvements.every(isImprovement)) return false

  const metaSuggestions = obj['metaSuggestions']
  if (!isRecord(metaSuggestions) || !isString(metaSuggestions['title']) || !isString(metaSuggestions['description'])) return false

  const contentIdeas = obj['contentIdeas']
  if (!isStringArray(contentIdeas)) return false

  const tokensUsed = obj['tokensUsed']
  if (!isRecord(tokensUsed) ||
      !isNumberInRange(tokensUsed['prompt'], 0, Number.POSITIVE_INFINITY) ||
      !isNumberInRange(tokensUsed['completion'], 0, Number.POSITIVE_INFINITY) ||
      !isNumberInRange(tokensUsed['total'], 0, Number.POSITIVE_INFINITY)) return false

  return true
}

function buildMessages(crawl: CrawlData, opts: { targetKeyword?: string; businessType?: string; location?: string; language?: string }): ChatMessage[] {
  const system: ChatMessage = {
    role: 'system',
    content:
      'Du är en svensk SEO-expert som hjälper småföretagare. ' +
      'Skriv kortfattat, konkret och prioriterat. Ge praktiska åtgärder som kan göras utan utvecklare. ' +
      'All output ska vara på svenska och returneras enbart som JSON enligt schemat.'
  }

  const schema = {
    type: 'object',
    properties: {
      scores: {
        type: 'object',
        properties: {
          overall: { type: 'number', minimum: 0, maximum: 100 },
          title: { type: 'number', minimum: 0, maximum: 100 },
          h1: { type: 'number', minimum: 0, maximum: 100 },
          meta: { type: 'number', minimum: 0, maximum: 100 },
          content: { type: 'number', minimum: 0, maximum: 100 },
          technical: { type: 'number', minimum: 0, maximum: 100 },
        },
        required: ['overall', 'title', 'h1', 'meta', 'content', 'technical']
      },
      quickWins: { type: 'array', items: { type: 'string' }, maxItems: 5 },
      improvements: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            area: { type: 'string', enum: ['Titel', 'H1', 'Meta', 'Innehåll', 'Teknik'] },
            issue: { type: 'string' },
            fix: { type: 'string' },
            impact: { type: 'string', enum: ['låg', 'medel', 'hög'] },
          },
          required: ['area', 'issue', 'fix', 'impact']
        },
        maxItems: 10
      },
      metaSuggestions: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['title', 'description']
      },
      contentIdeas: { type: 'array', items: { type: 'string' }, maxItems: 5 },
      tokensUsed: {
        type: 'object',
        properties: {
          prompt: { type: 'number' },
          completion: { type: 'number' },
          total: { type: 'number' },
        },
        required: ['prompt', 'completion', 'total']
      },
    },
    required: ['scores', 'quickWins', 'improvements', 'metaSuggestions', 'contentIdeas', 'tokensUsed']
  }

  const user: ChatMessage = {
    role: 'user',
    content:
      `Analysera följande webbsideinnehåll och ge enbart JSON enligt schemat nedan. ` +
      `Fokusera på nytta för en svensk småföretagare. ` +
      `Mål: bättre synlighet, fler förfrågningar, tydligare budskap.\n\n` +
      `Målsökord: ${opts.targetKeyword ?? '(ej angivet)'}\n` +
      `Företagstyp: ${opts.businessType ?? '(ej angivet)'}\n` +
      `Plats: ${opts.location ?? '(ej angivet)'}\n` +
      `Språk: ${opts.language}\n\n` +
      `Schema (JSON):\n${JSON.stringify(schema, null, 2)}\n\n` +
      `Data:\n${JSON.stringify(crawl, null, 2)}\n\n` +
      `Viktigt: Returnera enbart giltig JSON utan förklaringar eller kodblock.`
  }

  return [system, user]
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, signal?: AbortSignal): Promise<T> {
  if (signal?.aborted) throw new Error(ERROR_MESSAGES.TIMEOUT)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const result = await promise
    clearTimeout(timer)
    return result
  } catch (err) {
    clearTimeout(timer)
    if (controller.signal.aborted) {
      throw new Error(ERROR_MESSAGES.TIMEOUT)
    }
    throw err
  }
}

async function callOpenAIOnce(messages: ChatMessage[], opts: { model: string; temperature: number }, signal?: AbortSignal): Promise<{ content: string; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }> {
  // Mock response for coming soon mode
  if (!openai) {
    return {
      content: JSON.stringify({
        scores: {
          overall: 75,
          title: 80,
          h1: 70,
          meta: 65,
          content: 75,
          technical: 80
        },
        quickWins: [
          "Lägg till mer innehåll på sidan",
          "Förbättra meta-beskrivningen"
        ],
        improvements: [
          {
            area: "Innehåll",
            issue: "Sidan behöver mer text",
            fix: "Lägg till minst 300 ord relevant innehåll",
            impact: "hög"
          }
        ],
        metaSuggestions: {
          title: "Förbättrad titel",
          description: "Bättre meta-beskrivning"
        },
        contentIdeas: [
          "Skriv om din tjänst",
          "Lägg till kundrecensioner"
        ],
        tokensUsed: {
          prompt: 500,
          completion: 200,
          total: 700
        }
      }),
      usage: {
        prompt_tokens: 500,
        completion_tokens: 200,
        total_tokens: 700
      }
    };
  }

  const res = await openai.chat.completions.create({
    model: opts.model,
    temperature: opts.temperature,
    messages,
  }, {
    signal,
  })
  const choice = res.choices?.[0]
  const content = choice?.message?.content ?? ''
  const usage = {
    prompt_tokens: res.usage?.prompt_tokens ?? 0,
    completion_tokens: res.usage?.completion_tokens ?? 0,
    total_tokens: res.usage?.total_tokens ?? 0,
  }
  return { content, usage }
}

function getStatusCode(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null) {
    const maybe = error as { status?: number; code?: number }
    return maybe.status ?? maybe.code
  }
  return undefined
}

async function callOpenAIWithRetry(messages: ChatMessage[], opts: { model?: string; temperature?: number }, timeoutMs: number): Promise<{ content: string; usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }> {
  const linked = new AbortController()

  try {
    const maxAttempts = 3
    let lastError: unknown
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await withTimeout(callOpenAIOnce(messages, { model: 'gpt-4o-mini', temperature: opts.temperature || 0.3 }, linked.signal), timeoutMs)
      } catch (err) {
        lastError = err
        const status = getStatusCode(err)
        if (status !== 429 && !(typeof status === 'number' && status >= 500 && status < 600)) {
          throw err
        }
        if (attempt === maxAttempts) {
          throw err
        }
        const base = 1500 * Math.pow(2, attempt - 1)
        const wait = Math.floor(base * (0.8 + Math.random() * 0.4))
        await sleep(wait)
      }
    }
    throw lastError
  } finally {
    // Cleanup
  }
}

function toSeoAnalysis(obj: unknown, usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }): SeoAnalysis {
  const rec = obj as Record<string, unknown>
  const scoresRec = rec['scores'] as Record<string, unknown>
  const improvementsArr = (rec['improvements'] as unknown[]) || []
  const contentIdeasArr = (rec['contentIdeas'] as unknown[]) || []
  // Removed unused variables quickWinsArr and metaRec

  const analysis: OpenAIAnalysisResult = {
    overall_score: Number(rec['overall_score'] || scoresRec?.['overall'] || 0),
    title_score: Number(rec['title_score'] || scoresRec?.['title'] || 0),
    h1_score: Number(rec['h1_score'] || scoresRec?.['h1'] || 0),
    meta_score: Number(rec['meta_score'] || scoresRec?.['meta'] || 0),
    content_score: Number(rec['content_score'] || scoresRec?.['content'] || 0),
    technical_score: Number(rec['technical_score'] || scoresRec?.['technical'] || 0),
    improvements: improvementsArr.map((i) => {
      const r = i as Record<string, unknown>
      return {
        area: r['area'] as string,
        score: typeof r['score'] === 'number' ? r['score'] : 50,
        issue: String(r['issue'] ?? ''),
        solution: String((r['solution'] || r['fix']) ?? ''),
        priority: ((r['priority'] || r['impact']) as 'low' | 'medium' | 'high'),
      }
    }),
    content_ideas: (contentIdeasArr || rec['content_ideas'] || []).map(String),
    tokens_used: usage.total_tokens,
  }
  return analysis
}

// ========================
// Public API
// ========================

export async function analyzeSEO(params: AnalyzeParams): Promise<OpenAIAnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(ERROR_MESSAGES.NO_API_KEY)
  }

  const { crawlData, options: userOptions = {} } = params
  const options = { ...DEFAULT_OPTIONS, ...userOptions }
  const crawl = normalizeCrawlData(crawlData)

  const messages = buildMessages(crawl, options)

  try {
    const first = await callOpenAIWithRetry(messages, options, options.timeout)
    let usageCounts = first.usage

    const raw = stripCodeFences(first.content)
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      const strictMessages: ChatMessage[] = [
        messages[0],
        { role: 'user', content: messages[1].content + '\n\nReturnera ENBART giltig JSON exakt enligt schemat. Inga extra tecken.' }
      ]
      const retry = await callOpenAIWithRetry(strictMessages, options, options.timeout)
      usageCounts = retry.usage
      const raw2 = stripCodeFences(retry.content)
      parsed = JSON.parse(raw2)
    }

    if (!validateSeoAnalysis(parsed)) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE)
    }

    return toSeoAnalysis(parsed, usageCounts)
  } catch (err) {
    const status = getStatusCode(err)
    if (err instanceof Error && err.message === ERROR_MESSAGES.TIMEOUT) {
      throw new Error(ERROR_MESSAGES.TIMEOUT)
    }
    if (status === 429) {
      throw new Error(ERROR_MESSAGES.RATE_LIMIT)
    }
    if (typeof status === 'number' && status >= 500) {
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }
    if (err instanceof Error && err.message === ERROR_MESSAGES.INVALID_RESPONSE) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE)
    }
    throw new Error(ERROR_MESSAGES.GENERIC)
  }
}