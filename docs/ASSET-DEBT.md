# Asset debt — placeholders awaiting real inputs

> Only a REAL asset clears a row. Lorem/AI content never counts as done.
> Customer: Knotty Affairs by Mridul (founder: Mridul Garg). Confirmed real facts so far:
> WhatsApp **+91 78380 40976**, Instagram **@knotty_affairs_by_mridul**, domain **knottyaffairsbymridul.com**,
> logo + founder photo (supplied), ships across India. Everything else product/commerce-side is placeholder.

| # | Placeholder | Real input needed | Blocks |
|---|---|---|---|
| 1 | ~~12 placeholder products~~ RETIRED to draft 2026-09-27 — 16 REAL products created from Mridul's 18 studio/lookbook photos (Drive folder). Names/colours are ours (creative, from the photos); descriptions describe only what is visible | Confirm names; fabric composition; size run; SKUs if the brand has its own | Product-page detail |
| 2 | Prices unknown → all 16 real products carry **price 0 = "Price on request"** (card + PDP show WhatsApp enquiry, no add-to-cart, no ₹0 schema Offer) | Real price list from Mridul → set `price` per product and the cart/checkout path re-enables automatically | Online ordering |
| 3 | Payment gateway not configured (WhatsApp/COD ordering only) | Razorpay keys + COD policy decision | Online card/UPI payments |
| 4 | Shipping zones/rates defaulted (free-shipping copy avoided) | Real shipping rates & dispatch SLA | Checkout accuracy |
| 5 | Business email absent from site (WhatsApp/IG only) | Real business email | Contact page email, schema |
| 6 | Business/registered address not shown | Registered address + GST (if to be displayed) | Invoices, LocalBusiness schema completeness |
| 7 | Tyashin account login provisioned by agency | Customer's own email on the account | Account handover |
| 8 | About-page story written from the brief only | Founder's own origin-story details, quotes | Deeper About content |
| 9 | No real testimonials shown (by design — No-Faking) | Real customer reviews once orders flow | Social-proof sections |
| 10 | ~~Hero/reel-fallback/OG imagery~~ — DONE 2026-09-27: all crops of the real lookbook photos (Mira, Ahana, Suhani, Naina, Diya, Anaya, Ishani) | — | — |
| 10b | ~~Non-Indian-model stock placeholders~~ — resolved by retiring all placeholder products (draft) on 2026-09-27 | — | — |
| 11 | Size guide generic (XS–3XL ranges) | Brand's real measurement chart | Size-guide accuracy |
| 12 | ~~Domain DNS~~ — DONE: www.knottyaffairsbymridul.com live on the platform (cut over ~2026-08-31) | SEO Co-Pilot install with `config.phone` if not yet done | SEO surface |

## DNS records for go-live (add in Hostinger hPanel → DNS)

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | `sites.tyashin.com` |
| CNAME | `@` (apex) | `sites.tyashin.com` (Hostinger/Cloudflare DNS flattens CNAME-at-root; if refused, use their URL-forwarding to 301 apex → `https://www.knottyaffairsbymridul.com/`) |
| TXT | `_cf-custom-hostname.www` | `625aa10e-8729-4180-9da4-971d89176cb0` |
| TXT | `_cf-custom-hostname` | `1b1b5cfc-79cc-4620-910c-a010f75982c7` |

Delete the existing parked-page A/CNAME records for `@` and `www` first. SSL issues
automatically once the records resolve (platform polls). After the domain shows
`active`: install SEO Co-Pilot with `config.phone = +917838040976`.

| 13 | Pants category set inactive (no real pants in the catalog yet); 2 Drive files are Sony `.ARW` raws (DSC06543, DSC06592) with no preview — not usable as-is | Pants products / JPEG exports of the two raws | Pants category, 2 more looks |
