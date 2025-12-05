// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';

const SITE_URL = 'https://thoughtmarksapp.com';

// Static pages with their priorities and change frequencies
const pages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/waitlist', priority: 0.9, changefreq: 'weekly' },
  { url: '/blog', priority: 0.7, changefreq: 'weekly' },
  { url: '/legal/privacy', priority: 0.3, changefreq: 'monthly' },
  { url: '/legal/terms', priority: 0.3, changefreq: 'monthly' },
  { url: '/legal/eula', priority: 0.3, changefreq: 'monthly' },
  { url: '/legal', priority: 0.3, changefreq: 'monthly' },
  { url: '/support', priority: 0.5, changefreq: 'monthly' },
  { url: '/support/watch', priority: 0.4, changefreq: 'monthly' },
];

export const GET: APIRoute = async () => {
  const lastmod = new Date().toISOString().split('T')[0];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

