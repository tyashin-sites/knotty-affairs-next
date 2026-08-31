import ReelEmbed from './ReelEmbed';
import { api } from '@/lib/api';
import type { InstagramReel } from '@/lib/types';

/**
 * PDP UGC section — approved Instagram reels linked to THIS product via the
 * `instagram-reels` plugin. Renders nothing at all when the product has no
 * approved reels (no empty-state clutter on the PDP).
 */
export default async function ProductReels({ productId }: { productId: string }) {
  let reels: InstagramReel[] = [];
  try {
    const res = await api.getReels({ placement: 'product', product: productId, limit: 4 });
    reels = res.data ?? [];
  } catch {
    return null;
  }
  if (reels.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12">
      <p className="mb-2 text-center text-xs font-medium uppercase tracking-[0.3em] text-rose-deep">
        Seen on Instagram
      </p>
      <h2 className="mb-8 text-center font-display text-2xl font-medium md:text-3xl">
        How it&apos;s really worn
      </h2>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {reels.map((reel) => (
          <div key={reel._id} className="w-[330px]">
            <ReelEmbed href={reel.url} caption={reel.caption} />
          </div>
        ))}
      </div>
    </section>
  );
}
