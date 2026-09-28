'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Menu, X, Heart, ChevronDown } from 'lucide-react';
import { useCart, useCategories } from './Providers';
import { getCategoryLandingHref } from '@/lib/category-routing';

/**
 * Header navigation. "Shop" carries EVERY active category (from the live
 * Providers list, same source as the footer) — never a hand-picked subset,
 * so the menu stays uniform as the catalog changes. Desktop: hover/focus
 * dropdown under Shop; mobile: categories listed under Shop.
 */
const PAGE_LINKS = [
  { label: 'Our Story', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const { categories } = useCategories();

  const desktopLink =
    'text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-rose-deep';
  const mobileLink =
    'px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-blush hover:text-rose-deep';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        {/* Wordmark rendered as type (the supplied logo is a white-background
            JPEG; on the ivory page it would show as a box). Cormorant italic
            mirrors the script mark; the rose heart quotes the logo's hearts. */}
        <Link href="/" className="group flex items-baseline gap-1.5" aria-label="Knotty Affairs by Mridul — home">
          <span className="font-display text-2xl font-semibold italic tracking-tight text-foreground md:text-3xl">
            Knotty Affairs
          </span>
          <Heart
            className="h-3 w-3 -translate-y-2 fill-rose text-rose transition-transform group-hover:scale-125"
            aria-hidden
          />
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            by Mridul
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <div className="group/shop relative">
            <Link href="/products" className={`${desktopLink} inline-flex items-center gap-1`}>
              Shop
              {categories.length > 0 && (
                <ChevronDown
                  className="h-3.5 w-3.5 transition-transform group-hover/shop:rotate-180 group-focus-within/shop:rotate-180"
                  aria-hidden
                />
              )}
            </Link>
            {categories.length > 0 && (
              <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all group-hover/shop:visible group-hover/shop:opacity-100 group-focus-within/shop:visible group-focus-within/shop:opacity-100">
                <div className="min-w-[220px] rounded-lg border border-border bg-background p-2 shadow-rose">
                  <Link
                    href="/products"
                    className="block rounded-md px-4 py-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-blush hover:text-rose-deep"
                  >
                    All Products
                  </Link>
                  <div className="my-1 border-t border-border" />
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={getCategoryLandingHref(cat.slug)}
                      className="block rounded-md px-4 py-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-blush hover:text-rose-deep"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {PAGE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={desktopLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 text-muted-foreground transition-colors hover:text-rose-deep"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-deep text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="p-2 text-muted-foreground md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col py-4">
            <Link href="/products" onClick={() => setMobileOpen(false)} className={mobileLink}>
              Shop All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={getCategoryLandingHref(cat.slug)}
                onClick={() => setMobileOpen(false)}
                className={`${mobileLink} pl-10 normal-case tracking-normal`}
              >
                {cat.name}
              </Link>
            ))}
            {PAGE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={mobileLink}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
