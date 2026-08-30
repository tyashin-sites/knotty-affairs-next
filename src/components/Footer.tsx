'use client';

import Link from 'next/link';
import { Instagram, Heart } from 'lucide-react';
import { useCategories, useReelsPageEnabled } from './Providers';
import { getCategoryLandingHref } from '@/lib/category-routing';
import { SITE, whatsappLink } from '@/lib/seo';

/**
 * Footer is a client component so it can read the live category list from the
 * Providers context. The footer-bar (copyright strip) is rendered by Tyashin's
 * platform layer (see `projects.legalPages.footerBarTheme` and the injected
 * tyashin-runtime), so we don't duplicate it here.
 *
 * Contact: WhatsApp + Instagram only — the customer has not supplied a business
 * email or public address yet (docs/ASSET-DEBT.md #5/#6). Never invent one.
 */
export default function Footer() {
  const { categories } = useCategories();
  const reelsPageEnabled = useReelsPageEnabled();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-3xl font-semibold italic">
              Knotty Affairs
              <Heart className="ml-1.5 inline h-3.5 w-3.5 -translate-y-2 fill-rose text-rose" aria-hidden />
            </p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.24em] opacity-70">
              by Mridul
            </p>
            <p className="mt-4 text-sm leading-relaxed opacity-80">
              Sustainable designer womenswear, tailored for the modern Indian
              silhouette. Comfort, fashion and quality fabrics — no compromises.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Explore</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop All', href: '/products' },
                { label: 'Our Story', href: '/about' },
                { label: 'Blog', href: '/blog' },
                // Platform-served /reels gallery — linked only while enabled
                // (no ghost links when the admin switches it off).
                ...(reelsPageEnabled ? [{ label: 'Reels', href: '/reels' }] : []),
                { label: 'Contact', href: '/contact' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms & Conditions', href: '/terms-and-conditions' },
                { label: 'Return Policy', href: '/return-policy' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm opacity-80 transition-opacity hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Shop by Category</h4>
            <nav className="flex flex-col gap-2">
              {/* ALL categories, on their canonical /category/<slug> landing
                  pages (not the ?category= query twin) — the footer is the
                  site-wide inbound-link safety net for category SEO. */}
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={getCategoryLandingHref(cat.slug)}
                  className="text-sm opacity-80 transition-opacity hover:opacity-100"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold">Say Hello</h4>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappLink('Hi Knotty Affairs! I have a question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm opacity-80 transition-opacity hover:opacity-100"
              >
                {/* WhatsApp glyph (lucide has no brand icon) */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.1 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 4 2.2.9 2.7.7 3.2.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.2-.2-.5-.3l-1.8-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L10 8.2c-.2-.4-.4-.4-.6-.4h-.5Z" />
                </svg>
                WhatsApp {SITE.whatsappDisplay}
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm opacity-80 transition-opacity hover:opacity-100"
              >
                <Instagram className="h-4 w-4 shrink-0" /> {SITE.instagramHandle}
              </a>
              <span className="text-sm opacity-80">Shipping across India</span>
            </div>
          </div>
        </div>

        {/* Platform attribution (Tyashin addendum §3f). Lives here, NOT in
            LegalFooterBar — on dispatched hosts the runtime re-injects that bar
            and would drop anything we add to it. */}
        <div className="mt-10 border-t border-primary-foreground/15 pt-6 text-center">
          <p className="text-xs opacity-70">
            Powered by{' '}
            <a
              href="https://tyashin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              Tyashin
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
