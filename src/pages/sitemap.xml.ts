// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';

const SITE_URL = 'https://thoughtmarksapp.com';

// Static pages with their priorities and change frequencies
const pages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/waitlist', priority: 0.9, changefreq: 'weekly' },
  
  // Comparison pages (high-intent SEO)
  { url: '/vs/voicenotes', priority: 0.8, changefreq: 'monthly' },
  { url: '/vs/notion', priority: 0.8, changefreq: 'monthly' },
  { url: '/vs/otter', priority: 0.8, changefreq: 'monthly' },
  { url: '/vs/obsidian', priority: 0.8, changefreq: 'monthly' },
  
  // Use case pages (persona-specific)
  { url: '/for/adhd', priority: 0.8, changefreq: 'monthly' },
  { url: '/for/creatives', priority: 0.8, changefreq: 'monthly' },
  { url: '/for/students', priority: 0.8, changefreq: 'monthly' },
  { url: '/for/entrepreneurs', priority: 0.8, changefreq: 'monthly' },
  
  // Feature pages
  { url: '/features/voice-capture', priority: 0.7, changefreq: 'monthly' },
  { url: '/features/ai-organization', priority: 0.7, changefreq: 'monthly' },
  { url: '/features/semantic-search', priority: 0.7, changefreq: 'monthly' },
  { url: '/features/apple-watch', priority: 0.7, changefreq: 'monthly' },
  
  // Blog
  { url: '/blog', priority: 0.7, changefreq: 'weekly' },
  { url: '/blog/capturing-ideas-complete-guide', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/second-brain-apps-compared', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/voice-notes-vs-typing', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/adhd-productivity-tools', priority: 0.6, changefreq: 'monthly' },
  { url: '/blog/ai-changing-note-taking', priority: 0.6, changefreq: 'monthly' },
  
  // Alternatives (SEO capture)
  { url: '/alternatives/notion', priority: 0.6, changefreq: 'monthly' },
  { url: '/alternatives/voice-notes', priority: 0.6, changefreq: 'monthly' },
  { url: '/alternatives/forgetful', priority: 0.6, changefreq: 'monthly' },
  
  // Legal & support
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
