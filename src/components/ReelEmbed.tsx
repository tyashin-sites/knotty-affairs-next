'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * One Instagram reel, embedded via Instagram's OFFICIAL embed method
 * (blockquote.instagram-media upgraded by https://www.instagram.com/embed.js).
 *
 * CRITICAL: the blockquote is injected IMPERATIVELY (innerHTML on a ref),
 * never rendered by React. embed.js REPLACES that DOM with its own iframe;
 * if React owns it, the next reconciliation throws hydration/DOM errors
 * (minified React #418) and the platform's error-recovery reload turns that
 * into a reload loop. React manages only the outer shell — Instagram's DOM
 * is opaque to it.
 *
 * Injection is deferred until the card nears the viewport (reels never sit in
 * the LCP path). Until upgraded — or if Instagram is unreachable — the
 * blockquote's own content shows our branded "Watch on Instagram" link.
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
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src*="instagram.com/embed.js"]',
      );
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

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function ReelEmbed({
  href,
  caption,
}: {
  /** Canonical reel URL (https://www.instagram.com/reel/<code>/). */
  href: string;
  caption?: string;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = shellRef.current;
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
    const mount = mountRef.current;
    if (!visible || !mount || mount.childElementCount > 0) return;
    const safeHref = escapeAttr(href);
    const safeCaption = caption ? escapeAttr(caption) : '';
    // React never sees inside `mount` — Instagram is free to replace it.
    mount.innerHTML = `
      <blockquote class="instagram-media" data-instgrm-permalink="${safeHref}" data-instgrm-version="14"
        style="margin:0;width:100%;min-width:0;border:0;background:transparent;box-shadow:none">
        <a href="${safeHref}" target="_blank" rel="noopener noreferrer"
          style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;aspect-ratio:9/16;padding:16px;text-align:center;text-decoration:none">
          <span style="font-style:italic;font-size:18px;color:hsl(332 34% 57%)">Watch on Instagram</span>
          ${safeCaption ? `<span style="font-size:12px;color:hsl(326 8% 42%)">${safeCaption}</span>` : ''}
        </a>
      </blockquote>`;
    void loadEmbedJs().then(() => window.instgrm?.Embeds.process());
  }, [visible, href, caption]);

  return (
    <div
      ref={shellRef}
      className="min-h-[240px] overflow-hidden rounded-2xl border border-border bg-background shadow-rose"
    >
      <div ref={mountRef} suppressHydrationWarning />
    </div>
  );
}
