'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * One Instagram reel, embedded via Instagram's OFFICIAL embed method:
 * a `blockquote.instagram-media` that https://www.instagram.com/embed.js
 * upgrades into a properly-laid-out card. The raw `/embed/` iframe endpoint
 * renders its own header broken at arbitrary widths — the official script is
 * how embeds are meant to ship, and it handles layout/height itself.
 *
 * Cards are designed for a ~330px column (Instagram's minimum is 326px) —
 * parents give each embed a fixed ~330px slot (flex-wrap / snap-scroll), not
 * a fluid grid cell. Until the script upgrades it (and if Instagram is
 * unreachable), the blockquote shows our branded fallback link.
 */
declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let embedJsPromise: Promise<void> | null = null;
function loadEmbedJs(): Promise<void> {
  if (!embedJsPromise) {
    embedJsPromise = new Promise((resolve) => {
      const existing = document.querySelector<HTMLScriptElement>('script[src*="instagram.com/embed.js"]');
      if (existing) {
        if (window.instgrm) resolve();
        else existing.addEventListener('load', () => resolve());
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://www.instagram.com/embed.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => resolve(); // fallback link inside the blockquote still works
      document.body.appendChild(s);
    });
  }
  return embedJsPromise;
}

export default function ReelEmbed({
  href,
  caption,
  offset = false,
}: {
  /** Canonical reel URL (https://www.instagram.com/reel/<code>/). */
  href: string;
  caption?: string;
  offset?: boolean;
  /** @deprecated kept for call-site compatibility; embed.js derives everything from href. */
  embedUrl?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Defer the third-party script until the card approaches the viewport —
  // reels never sit in the LCP path.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    void loadEmbedJs().then(() => window.instgrm?.Embeds.process());
  }, [visible]);

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-2xl border border-border bg-background shadow-rose ${
        offset ? 'md:translate-y-6' : ''
      }`}
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={href}
        data-instgrm-version="14"
        style={{ margin: 0, minWidth: 0, width: '100%', border: 0, background: 'transparent' }}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-2 p-4 text-center"
        >
          <span className="font-display text-lg italic text-rose-deep">Watch on Instagram</span>
          {caption && <span className="line-clamp-3 text-xs text-muted-foreground">{caption}</span>}
        </a>
      </blockquote>
    </div>
  );
}
