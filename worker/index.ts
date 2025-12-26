/**
 * Cloudflare Worker for domain redirect
 * Redirects multiple domains to thoughtmarksapp.com with 301 permanent redirect
 * 
 * Supported domains:
 * - dontforgetthisapp.com (and www.dontforgetthisapp.com)
 * - iforgottoremember.com (and www.iforgottoremember.com)
 * 
 * This worker handles all requests to these domains and redirects them
 * to thoughtmarksapp.com while preserving the path and query parameters.
 */

// List of domains that should redirect to thoughtmarksapp.com
const REDIRECT_DOMAINS = [
  'dontforgetthisapp.com',
  'www.dontforgetthisapp.com',
  'iforgottoremember.com',
  'www.iforgottoremember.com',
];

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const hostname = url.hostname.toLowerCase();
      
      // Check if the request is for one of the redirect domains
      if (REDIRECT_DOMAINS.includes(hostname)) {
        // Preserve the path and query string
        const path = url.pathname || '/';
        const search = url.search || '';
        const redirectUrl = `https://thoughtmarksapp.com${path}${search}`;
        
        // Return 301 permanent redirect
        return Response.redirect(redirectUrl, 301);
      }
      
      // If not the redirect domain, return 404 (shouldn't happen if routing is correct)
      return new Response('Not Found', { status: 404 });
    } catch (error) {
      // Handle any errors gracefully
      console.error('Redirect error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

type Env = Record<string, never>;

