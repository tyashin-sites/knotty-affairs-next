'use client';

import { useState } from 'react';

/**
 * One Instagram reel embed in a 9:16 phone frame.
 *
 * Loads Instagram's public embed page in an iframe, lazily (reels always sit
 * below the fold — keep them off the LCP path). If Instagram refuses/breaks
 * the embed (deleted reel, network), the frame collapses to a branded tile
 * linking out — never a broken grey box.
 */
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

  return (
    <div
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
        <iframe
          src={embedUrl}
          title={caption || 'Instagram reel'}
          className="h-full w-full border-0"
          loading="lazy"
          allow="encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-popups"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
