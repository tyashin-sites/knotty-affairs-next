// Single source of truth for Knotty Affairs' per-page <head> metadata.
//
// JSON-LD (Product / BlogPosting / ItemList / BreadcrumbList + sitewide
// Organization / WebSite) is injected by the Tyashin platform edge at request
// time — do NOT hand-roll it here. THIS file owns the part the edge can't:
// per-page Open Graph / Twitter Card / canonical, all absolute via metadataBase.
//
// `domain` is the only value that changes if the customer's domain differs.
import type { Metadata } from 'next';

export const SITE = {
  name: 'Knotty Affairs by Mridul',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'knottyaffairsbymridul.com',
  // A real asset in /public (1200×630-ish). Used when a page has no better image.
  defaultOgImage: '/og-default.jpg',
  locale: 'en_IN',
  twitter: '',
  instagram: 'https://www.instagram.com/knotty_affairs_by_mridul/',
  instagramHandle: '@knotty_affairs_by_mridul',
  // Confirmed by the customer at intake (2026-08-27). Also lives in the
  // platform's store-settings.whatsappNumber / seo-copilot config.phone /
  // businessProfile.primaryPhone — keep all four in sync (4-surfaces rule).
  whatsappNumber: '917838040976',
  whatsappDisplay: '+91 78380 40976',
  founder: 'Mridul Garg',
};

/** wa.me deep link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function siteUrl(path = '/'): string {
  const base = `https://www.${SITE.domain}`;
  const p = path === '/' ? '' : `/${path.replace(/^\/+/, '')}`;
  return `${base}${p}`;
}

/** Build a complete, absolute-URL Metadata object for one page. */
export function pageMetadata(opts: {
  title?: string;
  description: string;
  path: string;
  image?: string; // absolute or root-relative; falls back to SITE.defaultOgImage
  type?: 'website' | 'article';
}): Metadata {
  const url = siteUrl(opts.path);
  const image = opts.image || SITE.defaultOgImage;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      type: opts.type || 'website',
      url,
      siteName: SITE.name,
      title: opts.title || SITE.name,
      description: opts.description,
      locale: SITE.locale,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title || SITE.name,
      description: opts.description,
      images: [image],
      ...(SITE.twitter ? { site: SITE.twitter, creator: SITE.twitter } : {}),
    },
  };
}
