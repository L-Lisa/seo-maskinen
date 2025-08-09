import Script from 'next/script';

interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Website Schema for homepage
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SEO Maskinen",
  "alternateName": "Sveriges enklaste SEO-verktyg",
  "url": "https://seomaskinen.se",
  "description": "Förbättra din hemsidas synlighet med AI-drivet SEO-verktyg. Perfekt för svenska småföretagare som vill optimera sin webbplats själva.",
  "inLanguage": "sv-SE",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://seomaskinen.se/login?url={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Småföretagare",
    "geographicArea": {
      "@type": "Country",
      "name": "Sverige"
    }
  }
};

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization", 
  "name": "SEO Maskinen",
  "url": "https://seomaskinen.se",
  "logo": "https://seomaskinen.se/logo.png",
  "description": "Sveriges enklaste SEO-verktyg för småföretagare",
  "foundingDate": "2024",
  "founder": {
    "@type": "Organization",
    "name": "SEO Maskinen Team"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Sverige"
  },
  "serviceType": "SEO-verktyg och webbplatsanalys",
  "slogan": "Sveriges enklaste SEO-verktyg"
};

// SoftwareApplication Schema for the SEO tool
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SEO Maskinen",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "SEO Tool",
  "operatingSystem": "Web Browser",
  "softwareVersion": "1.0",
  "description": "AI-drivet SEO-verktyg som hjälper småföretagare att förbättra sin webbplats synlighet i sökmotorer.",
  "url": "https://seomaskinen.se",
  "downloadUrl": "https://seomaskinen.se/login",
  "screenshot": "https://seomaskinen.se/screenshot.jpg",
  "featureList": [
    "SEO-analys av webbplatser",
    "Title tag optimering",
    "Meta description analys", 
    "Nyckelordsanalys",
    "Heading struktur granskning",
    "URL struktur bedömning"
  ],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK",
    "availability": "https://schema.org/InStock",
    "description": "Gratis SEO-analys för alla användare"
  },
  "author": {
    "@type": "Organization",
    "name": "SEO Maskinen Team"
  },
  "inLanguage": "sv-SE",
  "audience": {
    "@type": "Audience", 
    "audienceType": "Småföretagare"
  }
};

// Service Schema for SEO Analysis
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Gratis SEO-analys",
  "description": "Komplett SEO-analys av din webbplats med konkreta förbättringsförslag på svenska.",
  "provider": {
    "@type": "Organization",
    "name": "SEO Maskinen"
  },
  "areaServed": {
    "@type": "Country", 
    "name": "Sverige"
  },
  "availableLanguage": "sv-SE",
  "serviceType": "SEO-analys",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK",
    "availability": "https://schema.org/InStock"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "SEO-tjänster",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Title Tag Analys",
          "description": "Analys av din webbplats title tags för bättre SEO"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Meta Description Granskning",
          "description": "Granskning av meta descriptions för förbättrad klickfrekvens"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Nyckelordsanalys",
          "description": "Analys av nyckelordsdensitet och placering"
        }
      }
    ]
  }
};
