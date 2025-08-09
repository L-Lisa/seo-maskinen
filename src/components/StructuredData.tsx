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
  "areaServed": [
    {
      "@type": "Country",
      "name": "Sverige"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Sverige",
      "containedInPlace": {
        "@type": "Country",
        "name": "Sverige"
      }
    }
  ],
  "serviceType": "SEO-verktyg och webbplatsanalys",
  "slogan": "Sveriges enklaste SEO-verktyg",
  "knowsLanguage": ["sv-SE", "sv"],
  "currenciesAccepted": "SEK",
  "paymentAccepted": "Gratis",
  "memberOf": {
    "@type": "Organization",
    "name": "Svenska Digitala Företag"
  },
  "audience": {
    "@type": "BusinessAudience",
    "audienceType": "Småföretagare i Sverige",
    "geographicArea": {
      "@type": "Country", 
      "name": "Sverige"
    }
  }
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

// LocalBusiness Schema for Swedish SEO
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://seomaskinen.se/#localbusiness",
  "name": "SEO Maskinen",
  "description": "Sveriges enklaste SEO-verktyg för småföretagare. Hjälper svenska företag att förbättra sin synlighet online.",
  "url": "https://seomaskinen.se",
  "logo": "https://seomaskinen.se/logo.png",
  "image": "https://seomaskinen.se/og-image.jpg",
  "addressCountry": "SE",
  "addressRegion": "Sverige", 
  "addressLocality": "Sverige",
  "areaServed": {
    "@type": "Country",
    "name": "Sverige",
    "alternateName": "Sweden"
  },
  "knowsLanguage": ["sv-SE", "svenska"],
  "currenciesAccepted": "SEK",
  "paymentAccepted": "Gratis",
  "priceRange": "Gratis",
  "openingHours": "Mo-Su 00:00-23:59",
  "serviceArea": {
    "@type": "GeoCircle",
    "@id": "https://seomaskinen.se/#servicearea",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "62.0",
      "longitude": "15.0"
    },
    "geoRadius": "1000000"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "SEO-tjänster för svenska företag", 
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Gratis SEO-analys",
          "description": "Komplett SEO-analys av svenska webbplatser"
        },
        "price": "0",
        "priceCurrency": "SEK"
      }
    ]
  },
  "audience": {
    "@type": "BusinessAudience",
    "audienceType": "Svenska småföretagare",
    "geographicArea": {
      "@type": "Country",
      "name": "Sverige"
    }
  }
};
