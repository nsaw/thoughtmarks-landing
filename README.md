# Thoughtmarks Landing Page

> **Capture ideas at the speed of life.** Voice-first note capture with AI organization. Never forget to remember again.

A modern, performant marketing landing page for the Thoughtmarks iOS/watchOS app. Built with Astro for optimal performance and SEO, featuring React components for interactive elements.

**Live Site**: [https://thoughtmarksapp.com](https://thoughtmarksapp.com)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v22+ (v25.1.0 recommended)
- **Package Manager**: pnpm 9.15.0
- **Cloudflare Account**: For deployment (optional for local dev)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

The development server will start at `http://localhost:4321`.

---

## 📋 Project Overview

This is a **100% static site** built with Astro, pre-rendered at build time for optimal performance. The site serves as the marketing frontend for Thoughtmarks, providing:

- Product information and features
- Waitlist signup functionality
- Legal documentation (Privacy Policy, Terms, EULA)
- Support resources
- SEO-optimized content pages

### Key Features

- ⚡ **Static Site Generation (SSG)** - All pages pre-rendered at build time
- 🎨 **Modern UI** - TailwindCSS with custom design system
- ⚛️ **React Integration** - Interactive components with selective hydration
- 🔒 **Security First** - Comprehensive security headers and HTTPS enforcement
- 🌍 **Multi-Domain Support** - Handles 4+ domains with smart redirects
- 📱 **Mobile Optimized** - Responsive design with mobile-first approach
- 🚀 **CDN Optimized** - Deployed on Cloudflare Pages with global edge distribution

---

## 🛠️ Technology Stack

### Core Framework
- **Astro**: ^5.8.0 (Static Site Generator)
- **Node.js**: v25.1.0 (local), v22+ (build)
- **TypeScript**: ^5.7.3

### UI & Styling
- **React**: ^19.1.0 (for interactive components)
- **TailwindCSS**: ^3.4.17 (utility-first CSS)
- **Framer Motion**: ^12.12.2 (animations)
- **PostCSS**: ^8.5.4 with Autoprefixer

### Integrations
- **@astrojs/react**: ^4.2.1 (React integration)
- **@astrojs/tailwind**: ^6.0.2 (TailwindCSS integration)

### Deployment
- **Cloudflare Pages**: Static site hosting
- **Cloudflare Workers**: Domain redirect handling
- **Wrangler**: ^3.0.0 (Cloudflare CLI)

---

## 📁 Project Structure

```
Thoughtmarks-landing/
├── src/
│   ├── pages/              # Route pages (Astro)
│   │   ├── index.astro     # Landing page
│   │   ├── waitlist.astro   # Waitlist signup
│   │   ├── legal/           # Legal pages (5 files)
│   │   ├── support/         # Support pages (2 files)
│   │   ├── blog/            # Blog posts
│   │   ├── features/        # Feature pages
│   │   └── sitemap.xml.ts   # Dynamic sitemap generator
│   ├── components/
│   │   ├── astro/           # Static Astro components (13 files)
│   │   └── react/           # Interactive React components (8 files)
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Main layout
│   │   └── LegalLayout.astro   # Legal pages layout
│   └── styles/
│       ├── global.css       # Global styles
│       └── fonts.css        # Font definitions
├── public/                  # Static assets (copied to dist/)
│   ├── _headers             # Cloudflare security headers
│   ├── _redirects           # Cloudflare redirect rules
│   ├── robots.txt           # SEO crawler instructions
│   └── assets/              # Public assets (images, fonts, docs)
├── sendgrid-templates/      # Email templates (7 files)
├── worker/                  # Cloudflare Worker for redirects
│   ├── index.ts             # Worker entry point
│   └── wrangler.toml        # Worker configuration
├── dist/                    # Build output (deployed to Cloudflare)
├── astro.config.mjs         # Astro configuration
├── wrangler.toml            # Cloudflare Pages config
├── tailwind.config.ts       # TailwindCSS config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

---

## 🎨 Pages & Routes

### Static Pages (Pre-rendered)

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

### Content Pages

- **Blog**: `/blog/*` - SEO-optimized blog posts
- **Features**: `/features/*` - Feature deep-dives
- **Use Cases**: `/for/*` - Target audience pages
- **Comparisons**: `/vs/*` - Competitive comparisons
- **Alternatives**: `/alternatives/*` - Alternative solutions

### Dynamic Endpoints

- **`/sitemap.xml`** - Programmatically generated sitemap (`src/pages/sitemap.xml.ts`)

---

## 🧩 Components

### React Components (Client-Side Hydration)

Located in `src/components/react/`:
- **`AppShowcase.tsx`** - App screenshots carousel
- **`HeroCycler.tsx`** - Hero section with cycling text
- **`MobileNav.tsx`** - Mobile navigation menu
- **`WaitlistCTA.tsx`** - Waitlist call-to-action
- **`WaitlistForm.tsx`** - Waitlist signup form with validation
- **`WaitlistModal.tsx`** - Modal waitlist form
- **`StickyCTA.tsx`** - Sticky bottom CTA bar
- **`ExitIntent.tsx`** - Exit intent detection

### Astro Components (Static)

Located in `src/components/astro/`:
- **`Nav.astro`** - Navigation header
- **`Hero.astro`** - Hero section
- **`Features.astro`** - Features grid
- **`SocialProof.astro`** - Testimonials
- **`HowItWorks.astro`** - Process explanation
- **`FAQ.astro`** - Frequently asked questions
- **`Footer.astro`** - Site footer
- Plus 6 other components

---

## ⚙️ Configuration

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

### TailwindCSS Config (`tailwind.config.ts`)

- **Content**: `./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}`
- **Dark Mode**: Class-based (`class` strategy)
- **Custom Colors**: bg, text, accent, brand (yellow #FEFF00)
- **Custom Animations**: fade-in, fade-up, scale-in, float
- **Custom Shadows**: glow variants, card shadows

### TypeScript Config (`tsconfig.json`)

- **Strict Mode**: Enabled
- **Target**: ES2020+
- **Module**: ESNext
- **JSX**: react-jsx

---

## 🌐 Domains & Deployment

### Primary Domain
- **`thoughtmarksapp.com`** - Main landing page

### Active Custom Domains

| Domain | Status | Purpose | DNS Target |
|--------|--------|---------|------------|
| `thoughtmarksapp.com` | Active | **Primary** | thoughtmarks-landing.pages.dev |
| `www.thoughtmarksapp.com` | Active | WWW variant | thoughtmarks-landing.pages.dev |
| `thoughtmarks.ai` | Active | Alternative/branding | thoughtmarks-landing.pages.dev |
| `thoughtmarks.app` | Active | **301 redirect** | thoughtmarks-landing.pages.dev |

### Cloudflare Worker Redirects

Additional domains handled via Cloudflare Worker:
- `dontforgetthisapp.com` → `thoughtmarksapp.com`
- `iforgottoremember.com` → `thoughtmarksapp.com`

### Deployment Commands

```bash
# Build and deploy to default branch
pnpm deploy

# Build and deploy to production branch
pnpm deploy:production

# Deploy Cloudflare Worker (for redirects)
pnpm worker:deploy
```

### Build Process

1. Astro compiles `.astro` files to static HTML
2. React components hydrated client-side (where needed)
3. TailwindCSS purged and minified
4. Assets copied from `public/` to `dist/`
5. Wrangler deploys to Cloudflare Pages CDN

---

## 🔒 Security

### Security Headers (`public/_headers`)

Applied to all routes:
- `X-Frame-Options: DENY` - Clickjacking protection
- `X-Content-Type-Options: nosniff` - MIME sniffing protection
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Restricts camera, mic, geolocation
- `Content-Security-Policy` - Restrictive policy (self + https only)
- `Strict-Transport-Security` - HSTS with preload

### SSL/TLS
- **Provider**: Cloudflare Universal SSL
- **Status**: Active on all domains
- **Mode**: Full (strict)
- **HSTS**: Enabled (max-age=63072000, includeSubDomains, preload)

---

## 🔄 Redirects

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
/legal/privacy.html → /legal/privacy
/legal/terms.html → /legal/terms
/support/index.html → /support
```

**App Store Redirect**:
```
/download → https://apps.apple.com/app/id6746895453
```

---

## 📧 Email Integration

### Email Provider
- **Provider**: SendGrid (via backend at `api.thoughtmarks.app`)
- **Email Domain**: `thoughtmarks.app`
- **Email Addresses**:
  - `support@thoughtmarks.app` - Support
  - `privacy@thoughtmarks.app` - Privacy inquiries
  - `hello@thoughtmarks.app` - General inquiries

### SendGrid Templates

Located in `sendgrid-templates/` (7 templates):
1. `ai-insight.html` - AI-generated insights notification
2. `daily-digest.html` - Daily summary email
3. `launch-announcement.html` - Product launch announcement
4. `marketing-email.html` - Marketing campaigns
5. `reminder-notification.html` - User reminders
6. `trial-ending.html` - Trial expiration notice
7. `waitlist-confirmation.html` - Waitlist signup confirmation

**Asset URLs**: All templates reference `https://thoughtmarksapp.com/assets/` for images

---

## 🔌 Backend Integration

### API Endpoints (External)

Landing page is **frontend-only**. Backend services hosted separately:
- **Backend URL**: `api.thoughtmarks.app`
- **Backend Platform**: Fly.io (separate deployment)

### API Calls from Landing Page

- **Waitlist Signup**: POST to `https://api.thoughtmarks.app/api/waitlist`
  - Payload: `{ email, name?, source? }`
  - Response: Success/error confirmation (HTTP 201)
  - Triggers SendGrid confirmation email (fire-and-forget)
  - **CORS**: Configured to allow `thoughtmarksapp.com`, `thoughtmarks.ai`, all subdomains

---

## 📊 SEO Configuration

### Sitemap
- **Generated at**: `/sitemap.xml`
- **Source**: `src/pages/sitemap.xml.ts` (programmatic generation)
- **Base URL**: `https://thoughtmarksapp.com`
- **Last Modified**: Dynamically generated at build time

### Robots.txt
- **Location**: `public/robots.txt`
- **Policy**: Allow all crawlers
- **Sitemap**: Points to `https://thoughtmarksapp.com/sitemap.xml`

### Meta Tags
- Configured in `BaseLayout.astro`
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs

---

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server (http://localhost:4321)
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Linting
pnpm lint             # Run ESLint
pnpm lint:guard       # Run ESLint with zero warnings allowed

# Deployment
pnpm deploy           # Build and deploy to Cloudflare Pages
pnpm deploy:production # Deploy to production branch
pnpm worker:deploy     # Deploy Cloudflare Worker
pnpm worker:dev       # Run Worker locally
```

### Development Workflow

1. Make changes in `src/`
2. Test locally with `pnpm dev`
3. Build and preview with `pnpm build && pnpm preview`
4. Deploy with `pnpm deploy:production`

---

## 📦 Dependencies

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
  "wrangler": "^3.0.0",
  "eslint": "^8.57.1",
  "husky": "^9.1.7"
}
```

---

## 🎯 Performance

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

## 🐛 Troubleshooting

### Cache-Busting

If Cloudflare caches the HTML SPA fallback for a missing asset path, the CDN can serve `text/html` at that asset URL even after the file exists.

**Fix**: Bump the cache-bust version used by the site (e.g. `?cb=v4`) so clients request a fresh URL.
- **Images**: `src/components/astro/PhoneMockup.astro` appends `cb` automatically
- **Fonts**: `src/styles/fonts.css` includes `?cb=` on `@font-face` URLs

### Build Issues

```bash
# Clear build cache
rm -rf dist/ .astro/

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

---

## 📝 License

Copyright © 2025 Thoughtmarks. All rights reserved.

---

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---
sequenceDiagram
    participant Dev as Developer
    participant README as README.md
    participant Repo as Repository
    participant User as New User/Contributor
    
    Dev->>README: Create comprehensive documentation
    Note over README: Quick Start section
    Note over README: Technology Stack
    Note over README: Project Structure
    Note over README: Configuration details
    Note over README: Deployment instructions
    Note over README: Security configuration
    Note over README: Troubleshooting guide
    
    Dev->>Repo: Commit README.md
    User->>Repo: Clone repository
    User->>README: Read documentation
    README->>User: Understand project setup
    README->>User: Learn tech stack
    README->>User: Follow deployment process
    README->>User: Configure security
    README->>User: Troubleshoot issues

---

## 📚 Additional Resources

- **Source of Truth**: See `sot-landing.md` for detailed project documentation
- **Astro Docs**: [https://docs.astro.build](https://docs.astro.build)
- **TailwindCSS Docs**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Cloudflare Pages**: [https://developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)

---

**Last Updated**: December 2025  
**Version**: 2.0.0  
**Status**: ✅ Production-ready
