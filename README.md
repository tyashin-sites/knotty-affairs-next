# Knotty Affairs by Mridul — Next.js storefront

Tyashin-managed Next.js (App Router) storefront for **Knotty Affairs by Mridul**
(designer womenswear — tops, shirts, co-ord sets, dresses, blazers, pants),
running on Cloudflare Workers via OpenNext.

- Design system: `docs/DESIGN-SPEC.md` (single source of truth — deviations are bugs)
- Placeholder inventory: `docs/ASSET-DEBT.md` (all products/prices/imagery are
  placeholders until the customer supplies the real catalog)
- The site owns NO product data — catalog lives in Tyashin (Mongo) and every
  page reads the public e-commerce API with `X-API-Key`.
- Deploy: push to `main` → GitHub Actions (installed by `POST /github/:projectId/adopt`).
  Never hand-edit `.github/workflows/deploy.yml`.

Local dev: `npm install && npm run dev` (uses production Tyashin API read-only).
