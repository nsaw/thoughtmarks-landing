# Source of Truth: Thoughtmarks Landing Page

**Project**: Thoughtmarks Marketing Landing Page  
**Version**: 2.0.0  
**Updated**: December 5, 2025  
**Primary Domain**: https://thoughtmarksapp.com

---

## What It Is

Static marketing landing page for Thoughtmarks iOS/watchOS app. Provides product information, waitlist signup, legal documentation, and support resources.

**Tech Stack**: Astro SSG + React components + TailwindCSS

---

## Deployment

### Platform
- **Host**: Cloudflare Pages
- **Project Name**: `thoughtmarks-landing`
- **Build Output**: `dist/` directory
- **Region**: Global CDN (auto-distributed)

### Deployment Commands
```bash
npm run build              # Build Astro site
npm run deploy             # Deploy to Pages (default branch)
npm run deploy:production  # Deploy to production branch
```

### Build Process
1. Astro compiles `.astro` files to static HTML
2. React components hydrated client-side (where needed)
3. TailwindCSS purged and minified
4. Assets copied from `public/` to `dist/`
5. Wrangler deploys to Cloudflare Pages CDN

---

## Domains

### Primary Domain
- **`thoughtmarksapp.com`** - Main landing page (CNAME → `thoughtmarks-landing.pages.dev`)

### Active Custom Domains
| Domain | Status | Purpose | DNS Target |
|--------|--------|---------|------------|
| `thoughtmarksapp.com` | Active | **Primary** | thoughtmarks-landing.pages.dev |
| `www.thoughtmarksapp.com` | Active | WWW variant | thoughtmarks-landing.pages.dev |
| `thoughtmarks.ai` | Active | Alternative/branding | thoughtmarks-landing.pages.dev |
| `thoughtmarks.app` | Active | **301 redirect** | thoughtmarks-landing.pages.dev |

### Cloudflare Page Rule (Redirect)
- **Pattern**: `thoughtmarks.app/*`
- **Action**: Forwarding URL (301 Permanent Redirect)
- **Target**: `https://thoughtmarksapp.com`
- **Why**: `.app` TLD triggers iOS Universal Links, causing app download prompts

### DNS Configuration
All domains managed on Cloudflare DNS:
- **Type**: CNAME
- **Target**: `thoughtmarks-landing.pages.dev`
- **Proxy**: Enabled (orange cloud)
- **SSL**: Full (strict)

---

## Technology Stack

### Core Framework
- **Astro**: ^5.8.0 (Static Site Generator)
- **Output Mode**: `static` (pre-rendered at build time)
- **Node.js**: v25.1.0 (local), v22+ (build)
- **Package Manager**: pnpm 9.15.0

### UI Layer
- **React**: ^19.1.0 (for interactive components)
- **React DOM**: ^19.1.0
- **Framer Motion**: ^12.12.2 (animations)

### Styling
- **TailwindCSS**: ^3.4.17
- **PostCSS**: ^8.5.4
- **Autoprefixer**: ^10.4.21
- **Dark Mode**: Class-based (`class` strategy)
- **Fonts**: 
  - Lato (sans-serif, display)
  - Over the Rainbow (script)
  - Merriweather (serif)

### TypeScript
- **Version**: ^5.7.3
- **Config**: `tsconfig.json` with strict settings

### Integrations
- **@astrojs/react**: ^4.2.1 (React integration)
- **@astrojs/tailwind**: ^6.0.2 (TailwindCSS integration)

---

## Page Structure

### Static Pages (Pre-rendered at Build Time)

All pages are **100% static** - no server-side rendering or dynamic content.

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Landing page (hero, features, waitlist CTA) |
| `/waitlist` | `src/pages/waitlist.astro` | Waitlist signup form |
| `/legal` | `src/pages/legal/index.astro` | Legal documents hub |
| `/legal/privacy` | `src/pages/legal/privacy.astro` | Privacy Policy |
| `/legal/terms` | `src/pages/legal/terms.astro` | Terms of Service |
| `/legal/eula` | `src/pages/legal/eula.astro` | End User License Agreement |
| `/legal/account-deletion` | `src/pages/legal/account-deletion.astro` | Account Deletion Instructions |
| `/support` | `src/pages/support/index.astro` | General support |
| `/support/watch` | `src/pages/support/watch.astro` | watchOS companion support |

### Dynamic Endpoints
| Route | File | Type | Description |
|-------|------|------|-------------|
| `/sitemap.xml` | `src/pages/sitemap.xml.ts` | TypeScript | Programmatically generated sitemap |

### Layouts
- **`src/layouts/BaseLayout.astro`** - Main layout (header, footer, SEO)
- **`src/layouts/LegalLayout.astro`** - Legal pages layout

---

## React Components

### Interactive Components (Client-Side Hydration)
Located in `src/components/react/`:
- **`AppShowcase.tsx`** - App screenshots carousel
- **`HeroCycler.tsx`** - Hero section with cycling text
- **`MobileNav.tsx`** - Mobile navigation menu
- **`WaitlistCTA.tsx`** - Waitlist call-to-action
- **`WaitlistForm.tsx`** - Waitlist signup form with validation
- **`proxy.tsx`** - Generic component proxy/wrapper

### Static Components (No Hydration)
Located in `src/components/astro/`:
- **`Testimonial.astro`** - Customer testimonials
- **`Feature.astro`** - Feature cards
- **`FAQ.astro`** - FAQ section
- Plus 6 other Astro components

---

## Email Integration

### Email Provider
- **Provider**: SendGrid (via backend at `api.thoughtmarks.app`)
- **Email Domain**: `thoughtmarks.app` (unchanged)
- **Email Addresses**:
  - `support@thoughtmarks.app` - Support
  - `privacy@thoughtmarks.app` - Privacy inquiries
  - `hello@thoughtmarks.app` - General inquiries

### SendGrid Templates
Located in `sendgrid-templates/` (7 templates):
1. **`ai-insight.html`** - AI-generated insights notification
2. **`daily-digest.html`** - Daily summary email
3. **`launch-announcement.html`** - Product launch announcement
4. **`marketing-email.html`** - Marketing campaigns
5. **`reminder-notification.html`** - User reminders
6. **`trial-ending.html`** - Trial expiration notice
7. **`waitlist-confirmation.html`** - Waitlist signup confirmation

**Asset URLs**: All templates reference `https://thoughtmarksapp.com/assets/` for images

### Email Flow
1. User submits waitlist form → Frontend sends to backend API
2. Backend validates → Saves to database
3. Backend triggers SendGrid → Sends waitlist confirmation email
4. Templates rendered with user data → Delivered via SendGrid

---

## Redirects Configuration

### File-Based Redirects (`public/_redirects`)
Cloudflare Pages processes these at edge:

**Cross-Domain Redirects** (301 Permanent):
```
https://thoughtmarks.app/*  → https://thoughtmarksapp.com/:splat
https://thoughtmarks.ai/*   → https://thoughtmarksapp.com/:splat
https://www.thoughtmarksapp.com/* → https://thoughtmarksapp.com/:splat
```

**Legacy Path Redirects** (301 Permanent):
```
/landing → /
/landing/index.html → /
/legal/privacy.html → /legal/privacy
/legal/terms.html → /legal/terms
/legal/eula.html → /legal/eula
/support/index.html → /support
/support/watch.html → /support/watch
```

### Cloudflare Page Rule
**Enforces `thoughtmarks.app` redirect at proxy level**:
- **Pattern**: `thoughtmarks.app/*`
- **Type**: Forwarding URL
- **Status**: 301 - Permanent Redirect
- **Destination**: `https://thoughtmarksapp.com`
- **Usage**: 1 of 3 available Page Rules

---

## Security Headers (`public/_headers`)

Applied to all routes:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()
Content-Security-Policy: default-src 'self' https:; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; script-src 'self' https: 'unsafe-inline' 'unsafe-eval'; font-src 'self' https: data:; connect-src 'self' https:;
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## Assets

### Location
- **Source**: `public/assets/` (copied to `dist/assets/`)
- **Served from**: CDN at `/assets/`

### Asset Types
- **Images**: PNG, JPG, SVG (mockups, logos, icons, testimonials)
- **Fonts**: Lato (TTF), Over the Rainbow (TTF)
- **Branding**: Brand guide, style guide, color palette
- **Reference Docs**: Legal docs, user guides, runbooks

### Key Assets
- **`AppIcon.png`** / **`AppIcon-round.png`** - App icons
- **`Logo-iOS-Default-*.png`** - iOS adaptive icons
- **`LogoRound-watchOS-Default-*.png`** - watchOS icons
- **`MAIN-mockup-page-*.png`** - App screenshots (5 screens)
- **`Watch-companion-*.png`** - watchOS screenshots
- **`testimonial-memojis/*.png`** - Testimonial avatars (6 files)
- **`social-share-*.png`** - Social media share cards

---

## Build Configuration

### Astro Config (`astro.config.mjs`)
```javascript
{
  site: 'https://thoughtmarksapp.com',
  output: 'static',
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  build: { assets: 'assets' },
  vite: { build: { cssMinify: true } }
}
```

### Wrangler Config (`wrangler.toml`)
```toml
name = "thoughtmarks-landing"
pages_build_output_dir = "dist"
compatibility_date = "2025-10-24"
```

### TailwindCSS Config (`tailwind.config.ts`)
- **Content**: `./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}`
- **Dark Mode**: Class-based
- **Custom Colors**: bg, text, accent, brand (yellow #FEFF00)
- **Custom Animations**: fade-in, fade-up, scale-in, float
- **Custom Shadows**: glow variants, card shadows

### TypeScript Config (`tsconfig.json`)
- **Strict Mode**: Enabled
- **Target**: ES2020+
- **Module**: ESNext
- **JSX**: react-jsx

### PostCSS Config (`postcss.config.cjs`)
- **Plugins**: TailwindCSS, Autoprefixer

---

## SEO Configuration

### Sitemap
- **Generated at**: `/sitemap.xml`
- **Source**: `src/pages/sitemap.xml.ts` (programmatic generation)
- **Base URL**: `https://thoughtmarksapp.com`
- **Last Modified**: Dynamically generated at build time
- **Priority**: All pages priority 1.0 (equal)

### Robots.txt
- **Location**: `public/robots.txt`
- **Policy**: Allow all crawlers
- **Sitemap**: Points to `https://thoughtmarksapp.com/sitemap.xml`
- **Disallow**: `/api/` (when backend is integrated)

### Meta Tags
- Configured in `BaseLayout.astro`
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs

---

## Static vs Dynamic Content

### 100% Static (No Server-Side Rendering)
**All pages pre-rendered at build time**:
- Landing page (`/`)
- Legal pages (`/legal/*`)
- Support pages (`/support/*`)
- Waitlist page (`/waitlist`)

### Client-Side Interactivity
**React components with hydration**:
- Waitlist form submission (client-side validation, API POST to backend)
- Mobile navigation (toggle menu)
- Hero text cycler (animation)
- App showcase carousel (touch/swipe)

### No Server-Side Code
- No API routes in Astro
- No SSR pages
- No database queries at request time
- All content fetched from static files

---

## Backend Integration

### API Endpoints (External)
Landing page is **frontend-only**. Backend services hosted separately:
- **Backend URL**: `api.thoughtmarks.app`
- **Backend Platform**: Fly.io (separate deployment)
- **Backend Repo**: `/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/backend`

### API Calls from Landing Page
- **Waitlist Signup**: POST to `https://api.thoughtmarks.app/api/waitlist`
  - Payload: `{ email, firstName?, lastName?, referralSource? }`
  - Response: Success/error confirmation
  - Triggers SendGrid confirmation email

---

## Dependencies

### Runtime Dependencies
```json
{
  "astro": "^5.8.0",
  "@astrojs/react": "^4.2.1",
  "@astrojs/tailwind": "^6.0.2",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "framer-motion": "^12.12.2"
}
```

### Dev Dependencies
```json
{
  "typescript": "^5.7.3",
  "tailwindcss": "^3.4.17",
  "postcss": "^8.5.4",
  "autoprefixer": "^10.4.21",
  "@types/react": "^19.1.6",
  "@types/react-dom": "^19.1.6",
  "husky": "^9.1.7"
}
```

---

## Directory Structure

```
Thoughtmarks-landing/
├── src/
│   ├── pages/              # Route pages (Astro)
│   │   ├── index.astro     # Landing page
│   │   ├── waitlist.astro  # Waitlist signup
│   │   ├── sitemap.xml.ts  # Sitemap generator
│   │   ├── legal/          # Legal pages (5 files)
│   │   └── support/        # Support pages (2 files)
│   ├── components/
│   │   ├── astro/          # Static Astro components (9 files)
│   │   └── react/          # Interactive React components (6 files)
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Main layout
│   │   └── LegalLayout.astro   # Legal pages layout
│   ├── styles/
│   │   ├── global.css      # Global styles
│   │   └── fonts.css       # Font definitions
│   └── assets/
│       └── images/         # Source images
├── public/                 # Static assets (copied to dist/)
│   ├── _headers            # Cloudflare security headers
│   ├── _redirects          # Cloudflare redirect rules
│   ├── robots.txt          # SEO crawler instructions
│   └── assets/             # Public assets (images, fonts, docs)
├── sendgrid-templates/     # Email templates (7 files)
├── dist/                   # Build output (deployed to Cloudflare)
├── astro.config.mjs        # Astro configuration
├── wrangler.toml           # Cloudflare Pages config
├── tailwind.config.ts      # TailwindCSS config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

---

## Git and Version Control

- **Remote**: GitHub (assumed)
- **Branch**: `main`
- **Working Tree**: Clean (all changes committed)
- **Pre-commit Hooks**: Husky (^9.1.7)

---

## Configuration Files

### `astro.config.mjs`
```javascript
{
  site: 'https://thoughtmarksapp.com',  // Canonical URL
  output: 'static',                      // SSG mode
  integrations: [react(), tailwind()],
  build: { assets: 'assets' },
  vite: { build: { cssMinify: true } }
}
```

### `wrangler.toml`
```toml
name = "thoughtmarks-landing"
pages_build_output_dir = "dist"
compatibility_date = "2025-10-24"
```

### `tailwind.config.ts`
- **Content Glob**: `./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}`
- **Dark Mode**: `class` (manual toggle)
- **Custom Theme**: Extended colors, fonts, animations
- **Plugins**: None (using core only)

---

## Email Templates

### Template Files
Located in `sendgrid-templates/` (HTML format):
1. `ai-insight.html` - AI-generated insights
2. `daily-digest.html` - Daily summary
3. `launch-announcement.html` - Product launch
4. `marketing-email.html` - Marketing campaigns
5. `reminder-notification.html` - Reminders
6. `trial-ending.html` - Trial expiration
7. `waitlist-confirmation.html` - Waitlist signup confirmation

### Asset References
All templates use: `https://thoughtmarksapp.com/assets/` for images

### Email Addresses (On `thoughtmarks.app`)
- `support@thoughtmarks.app`
- `privacy@thoughtmarks.app`
- `hello@thoughtmarks.app`

### Integration
- **Backend**: Templates stored in SendGrid dashboard
- **Trigger**: Backend API calls SendGrid API
- **Variables**: Dynamic content injected by backend
- **Delivery**: SendGrid handles SMTP/delivery

---

## Security

### SSL/TLS
- **Provider**: Cloudflare Universal SSL
- **Status**: Active on all 4 domains
- **Mode**: Full (strict)
- **HSTS**: Enabled (max-age=63072000, includeSubDomains, preload)

### Security Headers
- **X-Frame-Options**: DENY (clickjacking protection)
- **X-Content-Type-Options**: nosniff (MIME sniffing protection)
- **Referrer-Policy**: strict-origin-when-cross-origin
- **CSP**: Restrictive policy (self + https only)
- **Permissions-Policy**: Camera, mic, geolocation disabled

### HTTPS Enforcement
- All HTTP traffic redirected to HTTPS (Cloudflare automatic)
- HSTS preload enabled

---

## Performance

### Build Output
- **HTML**: Minified
- **CSS**: Minified + purged (TailwindCSS)
- **JavaScript**: Minified (Vite)
- **Images**: Optimized manually (pre-build)

### CDN
- **Global Distribution**: Cloudflare's 300+ edge locations
- **Cache Strategy**: `public, max-age=0, must-revalidate`
- **Asset Caching**: Long-lived (via Cloudflare)

### Lighthouse Targets
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

---

## Development Workflow

### Local Development
```bash
npm run dev        # Start dev server (http://localhost:4321)
npm run build      # Build for production
npm run preview    # Preview build locally
```

### Deployment Workflow
```bash
npm run build                  # 1. Build Astro site
npm run deploy:production      # 2. Deploy to Cloudflare Pages
# Auto-deploys to all 4 custom domains
```

### Build Output Verification
```bash
ls -lh dist/       # Check build artifacts
du -sh dist/       # Check total size
```

---

## Monitoring and Analytics

### Current Setup
- **Analytics**: Not yet integrated (TODO)
- **Error Tracking**: Not yet integrated (TODO)
- **Performance Monitoring**: Cloudflare Web Analytics (available)

### Available Integrations
- Google Analytics (via Astro integration)
- PostHog (analytics + session replay)
- Cloudflare Web Analytics (privacy-friendly)

---

## Known Limitations

### Static Only
- No server-side rendering (SSR)
- No API routes in Astro
- No real-time data
- No user authentication on landing page

### Cloudflare Pages Free Plan
- **Page Rules**: 1 of 3 used
- **Custom Domains**: 4 configured (no hard limit on Free plan)
- **Build Minutes**: Unlimited
- **Bandwidth**: Unlimited

---

## What Stays on `thoughtmarks.app`

### Email Domain
- All email addresses remain on `thoughtmarks.app`
- SendGrid domain verification unchanged
- DKIM/SPF records unchanged

### API Endpoints
- `api.thoughtmarks.app` - Backend API
- `dev.thoughtmarks.app` - Dev environment
- `expo.thoughtmarks.app` - Expo updates (if applicable)

### iOS App Configuration
- Associated domains in iOS app unchanged
- Universal Links config unchanged
- App Store listing (when available)

---

## Maintenance

### Update Checklist
When making changes:
1. Update source files in `src/`
2. Update SendGrid templates if asset URLs change
3. Run `npm run build` to verify
4. Deploy with `npm run deploy:production`
5. Verify all 4 domains still resolve
6. Check redirect functionality

### Regular Tasks
- Monitor domain SSL certificate expiration (auto-renewed by Cloudflare)
- Update dependencies quarterly
- Review security headers annually
- Update legal docs as needed

---

## Migration History

### December 5, 2025 - Domain Migration
- **From**: `thoughtmarks.app` (primary)
- **To**: `thoughtmarksapp.com` (primary)
- **Reason**: `.app` TLD causing iOS Universal Links app download prompts
- **Action**: Configured 301 redirect via Cloudflare Page Rule
- **Result**: All domains active, redirect working

---

## Quick Reference

| Item | Value |
|------|-------|
| **Primary Domain** | https://thoughtmarksapp.com |
| **CDN Provider** | Cloudflare Pages |
| **Framework** | Astro 5.8.0 (SSG) |
| **React Version** | 19.1.0 |
| **Styling** | TailwindCSS 3.4.17 |
| **TypeScript** | 5.7.3 |
| **Package Manager** | pnpm 9.15.0 |
| **Node Version** | 25.1.0 (local) |
| **Build Output** | dist/ (static HTML/CSS/JS) |
| **Deploy Command** | `npm run deploy:production` |
| **Email Provider** | SendGrid (via backend) |
| **Email Domain** | thoughtmarks.app |
| **Active Domains** | 4 (1 redirect, 3 serve content) |
| **SSL Status** | Active on all domains |
| **Static/Dynamic** | 100% static (pre-rendered) |

---

**Last Updated**: December 5, 2025  
**Document Version**: 1.0  
**Status**: ✅ Production-ready

