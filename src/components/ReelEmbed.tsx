'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * One Instagram reel embed in a 9:16 phone frame.
 *
 * Instagram's embed page lays itself out for ~330px+ of width — narrower and
 * its own header (avatar / username / "View profile") starts overlapping.
 * So the iframe always renders at a fixed EMBED_WIDTH and is CSS-scaled to
 * fill whatever the card actually measures: IG sees a width it likes at every
 * card size, from a 170px mobile grid cell to a 500px desktop card.
 *
 * Loads lazily (reels always sit below the fold — keep them off the LCP
 * path). If Instagram refuses/breaks the embed, the frame collapses to a
 * branded tile linking out — never a broken grey box.
 */
const EMBED_WIDTH = 330;

export default function ReelEmbed({
  embedUrl,
  href,
  caption,
  offset = false,
}: {
  embedUrl: string;
  href: string;
  caption?: string;
  offset?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setBox({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = box ? box.w / EMBED_WIDTH : 1;

  return (
    <div
      ref={frameRef}
      className={`relative aspect-[9/16] overflow-hidden rounded-2xl border-4 border-background bg-blush shadow-rose ${
        offset ? 'md:translate-y-6' : ''
      }`}
    >
      {failed ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center"
        >
          <span className="font-display text-lg italic text-rose-deep">Watch on Instagram</span>
          {caption && <span className="line-clamp-3 text-xs text-muted-foreground">{caption}</span>}
        </a>
      ) : (
        box && (
          <iframe
            src={embedUrl}
            title={caption || 'Instagram reel'}
            className="border-0"
            style={{
              width: EMBED_WIDTH,
              height: box.h / scale,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            loading="lazy"
            allow="encrypted-media"
            sandbox="allow-scripts allow-same-origin allow-popups"
            onError={() => setFailed(true)}
          />
        )
      )}
    </div>
  );
}
