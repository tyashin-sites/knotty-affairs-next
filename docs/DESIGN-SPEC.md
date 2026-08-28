# Knotty Affairs — Design Spec (single source of truth; deviations are bugs)

## Thesis
**"Romance, tailored for the city."** An editorial, boutique-fashion storefront — soft romance (the logo's script + hearts) held in tension with sharp urban restraint (ink typography, generous whitespace, disciplined grid). It should feel like a designer's lookbook that happens to be shoppable, never like a template store.

**Anti-goals:** no bargain-bin energy (no red sale starbursts, no countdown timers), no gradient-heavy "AI slop" look, no stock-photo lifestyle collages, no more than ONE script/italic accent per screen, no carousel autoplay under 6s, no fake urgency or fake social proof.

## Color system (tokens in `globals.css`, raw HSL triples — never wrapped, CLAUDE.md §5)
| Token | HSL | Hex ≈ | Usage |
|---|---|---|---|
| `--ivory` | `30 33% 98%` | #FBF9F6 | Page background (~60%) |
| `--blush` | `335 39% 94%` | #F6E9EF | Tinted section bands, card hover |
| `--rose` | `335 43% 74%` | #D9A0B8 | Primary accent — CTAs, links, hearts (from logo) |
| `--rose-deep` | `332 34% 57%` | #B76E93 | Hover/active accent, eyebrow text |
| `--ink` | `326 12% 10%` | #1D1519 | Text, footer bg, buttons (~30%) |
| `--plum` | `326 28% 27%` | #58324A | Deep secondary, About band |
| `--gold` | `40 44% 58%` | #C3A265 | Fine rules, badges, stars — garnish only (<3%) |

**FORBIDDEN:** pure `#000`/`#fff` surfaces; saturated red/orange/green accents; neon; blue links; more than one gold element per viewport; gradients except a ≤6% ivory→blush wash.

## Typography
- Display: **Cormorant Garamond** (500/600 + *italic* for the romance beat) via `next/font` — hero, section titles, PDP name.
- Body/UI: **Jost** (300–600) via `next/font` — nav, body, buttons (buttons: 500, tracked +0.08em, uppercase).
- Scale: hero `clamp(2.6rem,6vw,4.6rem)`; section `clamp(1.9rem,3.4vw,2.8rem)`; body 1rem/1.7.
- **Text budgets (hard):** hero headline ≤ 9 words; hero sub ≤ 18; section intro ≤ 22; card blurb ≤ 14; About paragraphs ≤ 70 each.

## Space, grid, surfaces
Section padding `py-20 md:py-28`; container `max-w-7xl`; product grid 2/3/4 cols (16px/24px gaps); radius `0.75rem` cards, pill buttons; shadows only on hover (soft, rose-tinted `hsl(335 43% 60% / .18)`).

## Motion (tier 2 of 3 max)
CSS-only reveals (fade+8px rise, staggered ≤3), marquee ticker 28s linear, image zoom-on-hover 1.05/700ms. `prefers-reduced-motion`: all off. **Banned:** parallax, cursor followers, autoplaying video with sound, scroll-jacking.

## Imagery
Editorial: single garment, clean backdrop, warm light. Portrait 3:4 for product cards, 4:5/16:9 crops for hero tiles. **All launch imagery is AI-generated placeholder — tracked in ASSET-DEBT, replaced by real product photography before ads/press push.** Founder photo (real, supplied) only on About.

## Signature components
1. **Hero editorial split** — oversized Cormorant italic headline + layered image tiles (one tall, one offset small) with a floating heart accent.
2. **Marquee ticker** — ivory-on-ink strip: "New drops · Tailored for the Indian silhouette · Shipping across India".
3. **Category tiles** — 6 tiles, image + italic label, gold hairline on hover.
4. **Bestseller cards** — 3:4 image, name in Cormorant, price in Jost, "heart" wishlist affordance.
5. **Reel rail** — Instagram section: 9:16 phone-shaped frames linking to the real IG.
6. **Promise strip** — 3 quiet value props (fabric-first, tailored fits, all occasions) with thin gold icons.

## Page blueprints (one intent per URL)
- `/` — convert to catalog: hero → ticker → categories → bestsellers → editorial About teaser (founder pull-quote) → featured co-ords band → reel rail → promise strip → newsletter.
- `/products`, `/category/[slug]` — browse: filter row, grid, crawlable pagination.
- `/products/[slug]` — decide: gallery, price, size row, WhatsApp ask-to-order + add-to-cart, fabric/fit accordion, reviews, related.
- `/about` — trust: founder story (real photo), vision, motto; no commerce clutter, one CTA to `/products`.
- `/contact` — reach: WhatsApp-first + IG + form. `/faq`, legal = platform-standard.
- `/blog` — SEO surface; index here, posts platform-owned.

## UX laws
One primary CTA per viewport; every link resolves (no `href="#"`); breadcrumbs on PDP; footer carries ALL categories + legal + recent posts; WCAG AA contrast (rose is accent-on-ink or ink-on-rose only — never rose text on ivory below 18px); 5-second test: "designer womenswear, India, shop now" must land.

## Performance budget (design constraint)
LCP image `priority` + ≤180KB; fonts subset latin; no client JS for decoration (marquee/reveals are CSS); home ≤ 90KB route JS. If an idea breaks the budget, the idea loses.
