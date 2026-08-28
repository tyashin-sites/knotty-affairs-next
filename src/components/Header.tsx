'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useCart } from './Providers';

const NAV_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Co-ord Sets', href: '/category/co-ord-sets' },
  { label: 'Our Story', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-rose-deep"
            >
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
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-blush hover:text-rose-deep"
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
