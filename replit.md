# gutrootz — Herbal Nootropics Website

## Overview
A fully static, single-page website for **gutrootz** — a herbal nootropics brand built around the gut–brain axis. No build system, no framework. Pure HTML/CSS/JS served via Python HTTP server.

## Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Fonts**: Inter (body) + Playfair Display (headings) + Space Grotesk (labels/numbers) via Google Fonts
- **Server**: `python3 -m http.server 5000 --bind 0.0.0.0`
- **Deployment**: Static, publicDir "."

## Key Files
| File | Purpose |
|------|---------|
| `index.html` | Complete single-page app (~700 lines) |
| `styles.css` | All styling with CSS variables, glassmorphism, animations (~1000 lines) |
| `script.js` | All interactivity: cart, typing, particles, reveal, tilt, parallax |
| `logo.png` | Actual brand logo (transparent PNG) — used for navbar + favicon |

## Design System
- **Primary green**: `#1e6e46`
- **Rust accent**: `#b84a2e`
- **Background**: `#f5f0e8` (warm parchment)
- **Glassmorphism**: `backdrop-filter: blur(20px) saturate(1.4)` + semi-transparent white bg

## Features
- Scroll progress bar (top of page)
- Connected-dot particle canvas (background)
- Typing animation on hero h1 (cycling phrases)
- Glassmorphism navbar with active link highlighting
- Animated counter stats (intersection observer)
- 3D card tilt effect on product/shop cards
- Hero parallax on mesh background
- Floating hero visual cards with CSS keyframe animation
- Staggered scroll-reveal animations (reveal, reveal-left, reveal-right)
- Cart system: FAB + nav button, drawer with qty controls, toast notifications
- Shop filter (gut/brain/stress/immunity/kitchen/bundle)
- FAQ accordion
- Nutrition tile expand/collapse
- Diet package tabs (6 packages)
- Scroll-to-top button
- Cursor glow effect (desktop only)
- Mobile-responsive hamburger menu

## Sections
1. Hero (typing animation + floating cards)
2. Stats Banner (animated counters)
3. Featured Products (9 cards)
4. Nootropics Science (dark section)
5. What Is Gut-Brain Axis
6. Pathways (6 cards)
7. Conditions
8. Nutrition Guide (4 expandable tiles)
9. Daily Ritual (timeline)
10. Shop (12 products + filter)
11. Testimonials (3 cards)
12. Quality Promise (6 items)
13. Diet Packages (6 tabbed panels)
14. FAQ (6 items accordion)
15. CTA Banner
16. Footer

## Workflow
- Name: "Start application"
- Command: `python3 -m http.server 5000 --bind 0.0.0.0`
- Port: 5000
