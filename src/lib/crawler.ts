import puppeteer from 'puppeteer'
import type { HTTPRequest, Browser, Dialog } from 'puppeteer'
import type { CrawlData } from '@/types/seo'
import { createWebsiteUrl } from '@/types/seo'
import { PERFORMANCE_LIMITS } from '@/lib/constants'

export type CrawlerOptions = {
  userAgent: string
  viewport: { width: number; height: number }
  timeoutMs: number
  respectRobots: boolean
  maxContentChars: number
  maxLinks: number
}

export interface CrawlParams {
  url: string;
  keyword?: string;
  options?: Partial<CrawlerOptions>;
}

const DEFAULT_OPTIONS: CrawlerOptions = {
  userAgent: 'SEO Maskinen Bot/1.0 (+https://seo-maskinen.se)',
  viewport: { width: 1280, height: 800 },
  timeoutMs: PERFORMANCE_LIMITS.CRAWL_TIMEOUT,
  respectRobots: true,
  maxContentChars: 10_000,
  maxLinks: 100,
}

const ERRORS = {
  INVALID_URL: 'Ogiltig webbadress',
  ROBOTS_BLOCKED: 'Blockerad av robots.txt för denna sökväg.',
  TIMEOUT: 'Webbplatsen tog för lång tid att laddas. Försök igen senare.',
  NAVIGATION: 'Kunde inte hämta sidan. Kontrollera webbadressen.',
  GENERIC: 'Ett fel uppstod vid hämtning av sidan. Försök igen.',
} as const

async function fetchWithTimeout(resource: string, opts: { timeoutMs: number }): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs)
  try {
    const res = await fetch(resource, { signal: controller.signal })
    return res
  } finally {
    clearTimeout(timer)
  }
}

async function isBlockedByRobots(targetUrl: URL, timeoutMs: number): Promise<boolean> {
  const robotsUrl = new URL('/robots.txt', `${targetUrl.protocol}//${targetUrl.host}`)
  try {
    const res = await fetchWithTimeout(robotsUrl.toString(), { timeoutMs: Math.min(timeoutMs, 5000) })
    if (!res.ok) return false
    const text = await res.text()
    return checkRobotsDisallow(text, targetUrl.pathname)
  } catch {
    // If robots.txt cannot be fetched, assume not blocked
    return false
  }
}

function checkRobotsDisallow(robotsTxt: string, path: string): boolean {
  const lines = robotsTxt.split(/\r?\n/)
  let appliesToAll = false
  const disallows: string[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const [keyRaw, valueRaw] = line.split(':', 2)
    if (!keyRaw || !valueRaw) continue
    const key = keyRaw.trim().toLowerCase()
    const value = valueRaw.trim()

    if (key === 'user-agent') {
      // New agent section
      appliesToAll = value === '*' // track if we are in the * section
    } else if (key === 'disallow' && appliesToAll) {
      disallows.push(value)
    }
  }

  // Empty Disallow means allow all; non-empty patterns block by prefix
  for (const rule of disallows) {
    if (!rule) continue // empty disallow means nothing blocked
    if (path.startsWith(rule)) return true
  }
  return false
}

function normalizeText(text: string | null | undefined, maxLen: number): string {
  if (!text) return ''
  return text.replace(/\s+/g, ' ').trim().slice(0, maxLen)
}

// Removed unused isAbort function

function extractErrorInfo(err: unknown): { message: string; name: string } {
  let message = ''
  let name = ''
  if (typeof err === 'object' && err !== null) {
    const maybe = err as { message?: unknown; name?: unknown }
    if (typeof maybe.message === 'string') message = maybe.message
    if (typeof maybe.name === 'string') name = maybe.name
  }
  return { message, name }
}

export async function crawlWebsite(params: CrawlParams): Promise<CrawlData> {
  const { url, keyword = '', options: userOptions } = params
  const options: CrawlerOptions = { ...DEFAULT_OPTIONS, ...(userOptions ?? {}) }

  // Validate URL
  let target: URL
  try {
    target = new URL(url)
  } catch {
    throw new Error(ERRORS.INVALID_URL)
  }

  // Validation complete, proceed with crawling

  // robots.txt basic respect
  if (options.respectRobots) {
    const blocked = await isBlockedByRobots(target, options.timeoutMs)
    if (blocked) {
      throw new Error(ERRORS.ROBOTS_BLOCKED)
    }
  }

  const controller = new AbortController()
  let browser: Browser | null = null

  const run = async (): Promise<CrawlData> => {
    const startTime = Date.now();
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
          '--single-process',
          '--ignore-certificate-errors',
        ],
        executablePath: await puppeteer.executablePath()
      })

      const page = await browser.newPage()

      // Performance: block heavy resources
      await page.setRequestInterception(true)
      page.on('request', (req: HTTPRequest) => {
        const type = req.resourceType()
        if (type === 'image' || type === 'font' || type === 'stylesheet' || type === 'media') {
          req.abort().catch(() => {})
        } else {
          req.continue().catch(() => {})
        }
      })

      await page.setUserAgent(options.userAgent)
      await page.setViewport(options.viewport)

      // Disable dialogs
      page.on('dialog', async (dialog: Dialog) => {
        try { await dialog.dismiss() } catch { /* noop */ }
      })

      // Primary navigation attempt (faster and more tolerant)
      try {
        await page.goto(target.toString(), {
          waitUntil: 'domcontentloaded',
          timeout: options.timeoutMs,
        })
      } catch (e) {
        const { message, name } = extractErrorInfo(e)
        console.error('Crawler navigation error (domcontentloaded):', { name, message, url: target.toString() })
        // Fallback: try a more stable network state
        await page.goto(target.toString(), {
          waitUntil: 'networkidle2',
          timeout: options.timeoutMs,
        })
      }

      const raw = await page.evaluate(() => {
        const getMeta = (name: string): string | null => {
          const el = document.querySelector(`meta[name="${name}"]`)
          return el ? el.getAttribute('content') : null
        }
        const title = document.title || null
        const description = getMeta('description')
        const h1s = Array.from(document.querySelectorAll('h1')).map(h => (h.textContent || '').trim()).filter(Boolean)
        const mainContent = (document.body?.innerText || '').toString()
        const links = Array.from(document.querySelectorAll('a[href]'))
          .map(a => (a as HTMLAnchorElement).href)
          .filter(href => !!href)
        return { title, description, h1s, mainContent, links }
      })

      const data: CrawlData = {
        url: createWebsiteUrl(url),
        keyword,
        title: normalizeText(raw.title, 300),
        h1: Array.isArray(raw.h1s) && raw.h1s.length > 0 ? raw.h1s[0] : undefined,
        meta: normalizeText(raw.description, 500),
        content: normalizeText(raw.mainContent, options.maxContentChars),
        loadTime: Date.now() - startTime,
        mobileFriendly: true, // Assume mobile friendly for now
        pages: [], // For now, just crawl main page
        errors: []
      }

      return data
    } finally {
      if (browser) {
        try {
          await browser.close()
        } catch {
          // ignore
        }
      }
    }
  }

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      controller.abort()
      reject(new Error(ERRORS.TIMEOUT))
    }, options.timeoutMs)
    // Internal timeout handling only
  })

  try {
    return await Promise.race([run(), timeoutPromise])
  } catch (err: unknown) {
    const { message, name } = extractErrorInfo(err)
    if (message === ERRORS.TIMEOUT) {
      throw new Error('Laddningen tog för lång tid. Tips: prova startsidan (t.ex. https://' + target.host + '/) eller testa en annan sida.')
    }
    if (message === ERRORS.ROBOTS_BLOCKED) {
      throw new Error('Blockerad av robots.txt för denna sökväg. Tips: prova startsidan (t.ex. https://' + target.host + '/) eller en sida som får crawlas.')
    }
    if (name === 'TimeoutError') {
      throw new Error('Laddningen tog för lång tid. Tips: prova startsidan (t.ex. https://' + target.host + '/) eller testa en annan sida.')
    }
    if (message && /net::|navigation|ERR_/i.test(message)) {
      throw new Error('Kunde inte hämta sidan (' + target.toString() + '). Kontrollera att webbadressen är korrekt och att sidan är publik. Tips: prova startsidan (t.ex. https://' + target.host + '/) eller en enklare undersida.')
    }
    throw new Error('Ett fel uppstod vid hämtning av sidan. Tips: försök igen senare eller prova en annan URL.')
  }
}
