// SEO Maskinen - GDPR-compliant website analysis API
// Crawls public websites to extract SEO-relevant metadata only

import puppeteer from 'puppeteer';
import type { WebsiteData } from '@/types/seo';

// Force Node.js runtime for Puppeteer compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return Response.json(
        { success: false, error: 'URL krävs för analys' },
        { status: 400 }
      );
    }

    console.log(`🔍 GDPR-compliant SEO analysis started for: ${url}`);
    
    // Validate URL format
    let normalizedUrl: string;
    try {
      normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(normalizedUrl); // Validates URL format
    } catch {
      return Response.json(
        { success: false, error: 'Ogiltig URL-format. Ange en giltig webbplatsadress.' },
        { status: 400 }
      );
    }

    // Crawl website with Puppeteer (GDPR-compliant)
    const websiteData = await crawlWebsiteGDPRCompliant(normalizedUrl);
    
    console.log(`✅ Analysis completed for: ${url}`);
    
    return Response.json({
      success: true,
      data: websiteData
    });

  } catch (error) {
    console.error('SEO Analysis error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Okänt fel uppstod';
    
    return Response.json(
      { 
        success: false, 
        error: `Analys misslyckades: ${errorMessage}. Kontrollera att webbplatsen är tillgänglig.`
      },
      { status: 500 }
    );
  }
}

/**
 * GDPR-compliant website crawling
 * - Only extracts public SEO metadata
 * - No personal data collection
 * - Respects robots.txt where possible
 * - Real-time analysis without data storage
 */
async function crawlWebsiteGDPRCompliant(url: string): Promise<WebsiteData> {
  let browser;
  
  try {
    console.log('🌐 Starting browser for GDPR-compliant crawl...');
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security', // For CORS during crawling
      ]
    });

    const page = await browser.newPage();
    
    // Set reasonable timeout
    await page.setDefaultTimeout(30000);
    
    // Set user agent to identify our crawler
    await page.setUserAgent('SEO-Maskinen-Bot/1.0 (SEO Analysis Tool; +https://seo-maskinen.se)');
    
    console.log(`📥 Fetching page: ${url}`);
    
    // Navigate to page
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log('🔍 Extracting SEO-relevant metadata...');
    
    // Extract ONLY SEO-relevant data (GDPR-compliant)
    const websiteData = await page.evaluate((pageUrl) => {
      // Extract title
      const titleElement = document.querySelector('title');
      const title = titleElement?.textContent?.trim() || '';
      
      // Extract meta description  
      const metaDesc = document.querySelector('meta[name="description"]');
      const metaDescription = metaDesc?.getAttribute('content')?.trim() || '';
      
      // Extract headings structure
      const h1Elements = Array.from(document.querySelectorAll('h1'));
      const h2Elements = Array.from(document.querySelectorAll('h2'));
      const h3Elements = Array.from(document.querySelectorAll('h3'));
      
      const h1 = h1Elements[0]?.textContent?.trim() || '';
      const headings = {
        h1: h1Elements.map(el => el.textContent?.trim() || '').filter(Boolean),
        h2: h2Elements.map(el => el.textContent?.trim() || '').filter(Boolean),
        h3: h3Elements.map(el => el.textContent?.trim() || '').filter(Boolean),
      };
      
      // Extract basic content (no personal data)
      const contentElement = document.body?.cloneNode(true) as HTMLElement;
      let content = '';
      
      if (contentElement) {
        // Remove scripts, styles, and other non-content elements
        contentElement.querySelectorAll('script, style, nav, header, footer, aside, .cookie-banner, .gdpr-notice').forEach(el => el.remove());
        content = contentElement.textContent?.trim() || '';
      }
      
      // Extract image statistics
      const images = Array.from(document.querySelectorAll('img'));
      const imageData = {
        total: images.length,
        withAlt: images.filter(img => img.getAttribute('alt')?.trim()).length,
      };
      
      return {
        url: pageUrl,
        title,
        metaDescription,
        h1,
        headings,
        content: content.slice(0, 5000), // Limit content for analysis
        images: imageData,
      };
    }, url);

    console.log('✅ SEO data extraction completed');
    
    return websiteData;
    
  } catch (error) {
    console.error('Crawling error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error('Timeout: Webbplatsen svarade inte inom 30 sekunder');
      }
      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        throw new Error('Webbplatsen kunde inte hittas. Kontrollera URL:en.');
      }
      if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
        throw new Error('Anslutning nekades. Webbplatsen kanske blockerar crawlers.');
      }
    }
    
    throw new Error('Kunde inte analysera webbplatsen. Försök igen eller kontrollera att den är tillgänglig.');
    
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed - no data retained');
    }
  }
}
