# Chuyan Development Worklog

## 2026-01-30

### 13:30 - Initial website setup
- Created Next.js 14 project with TypeScript and Tailwind CSS
- Built Three.js animated particle background component
- Created landing page with logo placeholder, tagline, email signup
- Configured for static export (Cloudflare Pages deployment)
- Set up wrangler.toml for Cloudflare
- Dev server tested and running at localhost:3000

### 14:05 - Logo integration and purple accent theme
- Added actual logo (p11.jpg - glowing icosahedral circuit design)
- Updated color palette to include purple/violet accents matching logo
- Modified particle animation to include purple particles
- Updated button and UI elements with purple glow effects
- Rebuilt for production

### 15:15 - Deployment to Cloudflare Pages
- Pushed to GitHub (Symbiomancer/chuyan)
- Deployed to Cloudflare Pages
- Configured custom domain: chuyan.co
- Updated metadata with chuyan.co URLs

## 2026-02-02

### 18:29 - Comprehensive website review
- Reviewed site structure, UI components, pages/content, and deployment config via 4 explore agents

### 18:35 - Fixed invisible animations
- Diagnosed live site had low-opacity orbs (10-20%) making animations invisible
- Committed and pushed opacity increase (30-60%) to make animations visible

### 18:42 - Boosted animation visibility further
- Increased orb opacity to 50-70%, reduced blur for sharper edges
- Softened radial overlay (70% → 90%) that was obscuring orbs

### 18:48 - Made animations dramatically visible
- Increased movement from 30-50px to 100-200px translations
- Faster animation cycles (7-12s vs 12-20s)
- Reduced blur (30-50px vs 50-100px) for sharper, more visible orbs
- Boosted opacity to 60-80%

### 19:05 - Fixed Tailwind CSS purging issue
- Discovered Tailwind was purging arbitrary opacity/blur values from compiled CSS
- Switched to inline styles for backgroundColor and filter properties
- Rebuilt and redeployed to Cloudflare Pages

### 19:45 - Replaced with hyperspace starfield
- Scrapped orb animations (not working despite correct CSS)
- Implemented Star Wars hyperspace effect with 150 stars
- Stars radiate from center, stretch as they travel outward
- Purple/violet color accents

### 20:15 - Fixed CSS animation root cause
- Discovered CSS custom properties don't animate inside @keyframes
- Fix: nested elements (parent rotates, child animates translateX)
- Removed all var() from keyframes, hardcoded values only

### 21:00 - Fixed z-index visibility issue
- Body had bg-chuyan-black (opaque) at z-index 0
- AnimatedBackground at z-index -10 was behind it, completely hidden
- Removed body background, changed AnimatedBackground to z-0
- Stars finally visible!

### 21:05 - Randomized star pattern
- Changed from golden angle (spiral) to random angles
- More natural hyperspace effect

### 21:30 - Switched to twinkling night sky
- Replaced hyperspace (too chaotic) with fixed twinkling stars
- 120 stars with random sizes, positions avoiding center content
- Gentle pulse animation - looks great!

## 2026-02-13

### 16:48 - Comprehensive website review (4 agents)
- Ran 4 explore agents covering: architecture, content/messaging, UI/UX styling, code quality/issues
- Key findings: 4 high-severity npm vulns, 5 unused packages (three/tsparticles), oversized logos, missing prefers-reduced-motion, no sitemap/robots.txt, stale build output

### 17:59 - Added Maelstrom Memory Core product page
- Created /maelstrom route with cinematic three-phase reveal animation (blur→clear network, ability-unlock title, content fade-in)
- New components: MaelstromBackground.tsx (150-node purple network), maelstrom/page.tsx, maelstrom/layout.tsx
- Added clickable product card on homepage linking to /maelstrom
- New CSS keyframes: maelstromReveal, maelstromTitleReveal
- Content: persistent memory, world-state awareness, autonomous evolution for LLMs
- Build verified: static export generates maelstrom.html successfully

## 2026-02-24

### 01:42 - Rebrand from Galdria to Chuyan
- Renamed all instances of Galdria/galdria/GALDRIA to Chuyan/chuyan/CHUYAN across entire codebase
- Updated: tailwind.config.ts, package.json, package-lock.json, wrangler.toml, app/page.tsx, app/layout.tsx, app/maelstrom/layout.tsx, app/maelstrom/page.tsx, components/EmailSignup.tsx, WORKLOG.md, features/website-launch.md, features/maelstrom-page.md
- Tailwind color palette prefix changed from galdria-* to chuyan-*
- All metadata, SEO tags, and domain references updated

### 02:00 - Added flame spark eruptions to Maelstrom background
- ~10 random "spark origin" nodes periodically erupt with red/orange fire bursts
- Connected edges flash with flame-colored spread, neighbor nodes glow ember-red
- 3 new CSS keyframes: sparkErupt, flameSpread, emberGlow (all 8s cycle, staggered delays)
- Pure CSS animation, no runtime JS loop — matches existing architecture

### 02:10 - Added 初焰 hanzi fire ignition to homepage background
- Large centered 初焰 characters ignite one by one behind homepage content
- 初 fires first, 焰 follows 2s later, on a 14s repeating cycle
- Animation: invisible → ember glow → bright orange/red blaze → fade to embers → invisible
- Added Noto Serif SC (weight 900) via next/font/google for proper CJK rendering