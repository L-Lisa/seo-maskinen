// SEO Maskinen - Frontend SEO Analysis Tool

import type { WebsiteData, SeoAnalysisResult, SeoMetric } from '@/types/seo';
import { createWebsiteUrl } from '@/types/seo';

/**
 * Note: Website fetching is now handled server-side with Puppeteer 
 * for GDPR-compliant crawling. This function is deprecated.
 */

/**
 * Note: Mock data function removed to prevent misleading SEO analysis.
 * Real website data must be fetched to provide accurate SEO insights.
 */

/**
 * Note: HTML parsing is now handled server-side by Puppeteer
 * for more reliable and GDPR-compliant data extraction.
 */

/**
 * Analyzes website data and returns SEO metrics
 */
export function analyzeSeoMetrics(websiteData: WebsiteData, keyword: string): SeoAnalysisResult {
  const url = createWebsiteUrl(websiteData.url);
  
  // Analyze title
  const titleMetric = analyzeTitleTag(websiteData.title || '', keyword);
  
  // Analyze meta description
  const metaMetric = analyzeMetaDescription(websiteData.metaDescription || '', keyword);
  
  // Analyze heading structure
  const headingMetric = analyzeHeadingStructure(websiteData.headings, keyword);
  
  // Analyze keyword density
  const keywordMetric = analyzeKeywordDensity(websiteData.content || '', keyword);
  
  // Analyze URL structure
  const urlMetric = analyzeUrlStructure(websiteData.url, keyword);
  
  // Calculate overall score
  const metrics = {
    title: titleMetric,
    metaDescription: metaMetric,
    headingStructure: headingMetric,
    keywordDensity: keywordMetric,
    urlStructure: urlMetric,
  };
  
  const totalScore = Object.values(metrics).reduce((sum, metric) => sum + metric.score, 0);
  const maxScore = Object.values(metrics).reduce((sum, metric) => sum + metric.maxScore, 0);
  const overallScore = Math.round((totalScore / maxScore) * 100);
  
  // Generate improvements
  const improvements = generateImprovements(metrics);
  
  return {
    url,
    keyword,
    overallScore,
    metrics,
    improvements,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Analyzes title tag optimization
 */
function analyzeTitleTag(title: string, keyword: string): SeoMetric {
  let score = 0;
  const maxScore = 100;
  const suggestions: string[] = [];
  
  // Check title presence first
  if (title.length === 0) {
    suggestions.push('⚠️ Saknar titel - lägg till en title-tag för bättre SEO');
    score = 0;
  } else {
    // Give credit for having a title
    score += 40;
    suggestions.push('✅ Bra! Du har en titel på sidan');
    
    // Check title length (optimal 30-60 characters)
    if (title.length < 30) {
      suggestions.push('💡 Titeln kunde vara lite längre (sikta på 30-60 tecken för optimal visning)');
      score += 20;
    } else if (title.length > 60) {
      suggestions.push('✂️ Titeln är lite för lång - försök korta ner den till 30-60 tecken');
      score += 30;
    } else {
      suggestions.push('🎯 Perfekt längd på titeln! (30-60 tecken)');
      score += 40;
    }
    
    // Check keyword presence
    if (keyword && title.toLowerCase().includes(keyword.toLowerCase())) {
      score += 20;
      suggestions.push(`🌟 Fantastiskt! Ditt nyckelord "${keyword}" finns redan i titeln`);
    } else if (keyword) {
      suggestions.push(`💭 Tips: Överväg att inkludera "${keyword}" i titeln för ännu bättre SEO`);
    }
  }
  
  return {
    name: 'Title Tag',
    score: Math.min(score, maxScore),
    maxScore,
    description: title ? `"${title}"` : 'Ingen titel hittades',
    suggestions,
  };
}

/**
 * Analyzes meta description optimization
 */
function analyzeMetaDescription(metaDesc: string, keyword: string): SeoMetric {
  let score = 0;
  const maxScore = 100;
  const suggestions: string[] = [];
  
  // Check meta description presence first
  if (metaDesc.length === 0) {
    suggestions.push('⚠️ Saknar meta description - lägg till en för bättre klickfrekvens i sökresultat');
    score = 0;
  } else {
    // Give credit for having a meta description
    score += 40;
    suggestions.push('✅ Toppen! Du har en meta description');
    
    // Check meta description length (optimal 150-160 characters)
    if (metaDesc.length < 120) {
      suggestions.push('📏 Beskrivningen kunde vara längre (sikta på 150-160 tecken för bästa resultat)');
      score += 20;
    } else if (metaDesc.length > 160) {
      suggestions.push('✂️ Beskrivningen är lite för lång - korta ner till 150-160 tecken så den inte klipps av');
      score += 30;
    } else {
      suggestions.push('🎯 Perfekt längd på beskrivningen! (150-160 tecken)');
      score += 40;
    }
    
    // Check keyword presence
    if (keyword && metaDesc.toLowerCase().includes(keyword.toLowerCase())) {
      score += 20;
      suggestions.push(`🌟 Utmärkt! Ditt nyckelord "${keyword}" finns redan i beskrivningen`);
    } else if (keyword) {
      suggestions.push(`💭 Förslag: Lägg till "${keyword}" i beskrivningen för att förstärka relevansen`);
    }
  }
  
  return {
    name: 'Meta Description',
    score: Math.min(score, maxScore),
    maxScore,
    description: metaDesc ? `"${metaDesc}"` : 'Ingen meta description hittades',
    suggestions,
  };
}

/**
 * Analyzes heading structure
 */
function analyzeHeadingStructure(headings: { h1: string[]; h2: string[]; h3: string[] }, keyword: string): SeoMetric {
  let score = 0;
  const maxScore = 100;
  const suggestions: string[] = [];
  
  // Check H1 presence and count
  if (headings.h1.length === 0) {
    suggestions.push('⚠️ Saknar H1-rubrik - lägg till en huvudrubrik för sidan');
    score = 0;
  } else if (headings.h1.length > 1) {
    suggestions.push('🤔 Du har flera H1-rubriker - använd bara en per sida för bästa SEO');
    score += 40;
  } else {
    score += 50;
    suggestions.push('✅ Perfekt! Du har exakt en H1-rubrik');
    
    // Check keyword in H1
    if (keyword && headings.h1[0].toLowerCase().includes(keyword.toLowerCase())) {
      score += 20;
      suggestions.push(`🌟 Fantastiskt! "${keyword}" finns redan i H1-rubriken`);
    } else if (keyword) {
      suggestions.push(`💭 Tips: Överväg att inkludera "${keyword}" i H1-rubriken för starkare fokus`);
    }
  }
  
  // Check heading hierarchy
  if (headings.h2.length > 0) {
    score += 15;
    suggestions.push(`✅ Bra struktur! Sidan har ${headings.h2.length} H2-rubriker`);
  } else {
    suggestions.push('📝 Lägg till H2-rubriker för att organisera innehållet bättre');
  }
  
  if (headings.h3.length > 0) {
    score += 15;
    suggestions.push(`✅ Utmärkt hierarki! ${headings.h3.length} H3-rubriker ger bra struktur`);
  } else {
    suggestions.push('🔗 H3-rubriker kan hjälpa till att dela upp längre avsnitt');
  }
  
  return {
    name: 'Rubrikstruktur',
    score: Math.min(score, maxScore),
    maxScore,
    description: `H1: ${headings.h1.length}, H2: ${headings.h2.length}, H3: ${headings.h3.length}`,
    suggestions,
  };
}

/**
 * Analyzes keyword density
 */
function analyzeKeywordDensity(content: string, keyword: string): SeoMetric {
  let score = 50; // Default score
  const maxScore = 100;
  const suggestions: string[] = [];
  
  if (!keyword || !content) {
    return {
      name: 'Nyckelordsdensitet',
      score,
      maxScore,
      description: 'Kunde inte analysera nyckelordsdensitet',
      suggestions: ['💡 Ange ett nyckelord för att få en komplett analys'],
    };
  }
  
  const words = content.toLowerCase().split(/\s+/);
  const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
  const density = (keywordCount / words.length) * 100;
  
  // Optimal density is 1-3%
  if (density === 0) {
    suggestions.push(`🔍 Nyckelordet "${keyword}" hittades inte i innehållet`);
    suggestions.push('💭 Försök inkludera det naturligt i texten för bättre relevans');
    score = 10;
  } else if (density < 1) {
    suggestions.push(`📈 Bra start! "${keyword}" förekommer ${keywordCount} gång${keywordCount > 1 ? 'er' : ''}`);
    suggestions.push('💡 Du kan använda det lite oftare för starkare signaler (sikta på 1-3%)');
    score = 60;
  } else if (density > 3) {
    suggestions.push(`⚠️ "${keyword}" används ganska ofta (${density.toFixed(1)}%)`);
    suggestions.push('🎯 Minska lite för att undvika att det känns onaturligt (1-3% är optimalt)');
    score = 70;
  } else {
    suggestions.push(`🌟 Perfekt balans! "${keyword}" används lagom ofta (${density.toFixed(1)}%)`);
    suggestions.push('✅ Bra nyckelordsdensitet som känns naturlig');
    score = 100;
  }
  
  return {
    name: 'Nyckelordsdensitet',
    score,
    maxScore,
    description: `${density.toFixed(1)}% (${keywordCount} förekomster)`,
    suggestions,
  };
}

/**
 * Analyzes URL structure
 */
function analyzeUrlStructure(url: string, keyword: string): SeoMetric {
  let score = 0;
  const maxScore = 100;
  const suggestions: string[] = [];
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Give basic points for having a URL
    score += 30;
    suggestions.push('✅ URL:en är tillgänglig och fungerande');
    
    // Check URL length
    if (pathname.length > 100) {
      suggestions.push('📏 URL:en är lite lång - kortare URL:er är ofta bättre för SEO');
      score += 20;
    } else {
      suggestions.push('🎯 Bra URL-längd som är lätt att komma ihåg och dela');
      score += 40;
    }
    
    // Check for keyword in URL
    if (keyword && pathname.toLowerCase().includes(keyword.toLowerCase())) {
      score += 30;
      suggestions.push(`🌟 Fantastiskt! "${keyword}" finns redan i URL:en`);
    } else if (keyword) {
      suggestions.push(`💭 Tips: Om möjligt, inkludera "${keyword}" i URL:en för extra relevans`);
    }
    
    // Check for hyphens vs underscores
    if (pathname.includes('_')) {
      suggestions.push('🔧 Bindestreck (-) är bättre än understreck (_) för SEO');
    } else if (pathname.includes('-')) {
      suggestions.push('✅ Bra! Använder bindestreck för tydlig ord-separation');
    } else if (pathname === '/' || pathname === '') {
      suggestions.push('🏠 Det här är startsidan - överväg beskrivande URL:er för undersidor');
    }
    
  } catch {
    suggestions.push('⚠️ Kunde inte analysera URL-formatet');
    score = 20;
  }
  
  return {
    name: 'URL-struktur',
    score: Math.min(score, maxScore),
    maxScore,
    description: url,
    suggestions,
  };
}

/**
 * Generates improvement suggestions based on all metrics
 */
function generateImprovements(metrics: Record<string, SeoMetric>): string[] {
  const improvements: string[] = [];
  
  // Collect actionable suggestions from metrics with room for improvement
  Object.values(metrics).forEach(metric => {
    metric.suggestions.forEach(suggestion => {
      // Skip positive feedback (✅, 🌟, etc.) and focus on actionable items
      if (!suggestion.match(/^[✅🌟🎯📈]/)) {
        const cleanSuggestion = suggestion.replace(/^[⚠️🔍💭📏✂️🤔📝🔗⚙️🔧💡]/g, '').trim();
        if (!improvements.includes(cleanSuggestion)) {
          improvements.push(cleanSuggestion);
        }
      }
    });
  });
  
  // Add encouraging summary if good performance
  const averageScore = Object.values(metrics).reduce((sum, metric) => sum + metric.score, 0) / Object.values(metrics).length;
  
  if (improvements.length === 0 || averageScore >= 80) {
    improvements.unshift('🎉 Fantastiskt! Din webbplats har redan en stark SEO-grund.');
    if (improvements.length === 1) {
      improvements.push('Fortsätt skapa kvalitativt innehåll som dina besökare älskar!');
    }
  } else if (averageScore >= 60) {
    improvements.unshift('👍 Bra start! Några små justeringar kan göra stor skillnad.');
  }
  
  return improvements.slice(0, 6); // Limit to 6 improvements
}
