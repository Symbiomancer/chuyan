# Maelstrom Memory Core - Product Page

## Status: Complete

## Description
First product page for Chuyan. Showcases the Maelstrom Memory Core technology — persistent memory/state for LLMs enabling world-awareness and autonomous evolution.

## Files Added/Modified
- `app/globals.css` — Added maelstromReveal, maelstromTitleReveal keyframes and utility classes
- `components/MaelstromBackground.tsx` — Dense purple network background with blur-to-clear reveal animation
- `app/maelstrom/page.tsx` — Product page with three-phase cinematic reveal
- `app/maelstrom/layout.tsx` — SEO metadata for the maelstrom route
- `app/page.tsx` — Added clickable "Maelstrom Memory Core" card on homepage

## Animation Sequence
1. 0-4s: Network background materializes from blur/fog (blur 30px → 0)
2. 3-5.5s: "MAELSTROM" title appears with glow flash and letter-spacing contraction
3. 4.5-7s: "Memory Core" subtitle and content cards fade in

## Route
`/maelstrom` — Static export generates `out/maelstrom/index.html`

## Future Enhancements
- [ ] Interactive network (hover effects on nodes)
- [ ] Technical deep-dive section
- [ ] Demo or video embed
- [ ] API documentation link
