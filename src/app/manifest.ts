import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SEO Maskinen - Sveriges enklaste SEO-verktyg',
    short_name: 'SEO Maskinen',
    description: 'Förbättra din hemsidas synlighet med AI-drivet SEO-verktyg. Perfekt för svenska småföretagare.',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#10B981',
    orientation: 'portrait',
    lang: 'sv-SE',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icon-512.png', 
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
    ],
    categories: ['business', 'productivity', 'utilities'],
    shortcuts: [
      {
        name: 'SEO-analys',
        short_name: 'Analys',
        description: 'Starta en ny SEO-analys',
        url: '/login',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
