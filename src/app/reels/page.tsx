import { notFound } from 'next/navigation';
import { Instagram } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReelEmbed from '@/components/ReelEmbed';
import ReelSubmitForm from '@/components/ReelSubmitForm';
import { api } from '@/lib/api';
import { pageMetadata, SITE } from '@/lib/seo';
import type { InstagramReel, InstagramReelsMeta } from '@/lib/types';

export const metadata = pageMetadata({
  title: 'Reels',
  description:
    'Reels from Knotty Affairs by Mridul on Instagram — fits, fabrics and behind-the-seams from the studio.',
  path: '/reels',
});

/**
 * Site-native /reels gallery — the full library of approved reels from the
 * instagram-reels plugin, rendered inside the site's own chrome (header,
 * footer, theme) like every other page. The platform's themed fallback page
 * for this path is ownership-flipped to `storefront` so this one wins.
 *
 * Gated on the plugin's Reels Page toggle: when it's off this route 404s,
 * matching the conditional footer/rail links (no ghost surfaces).
 *
 * NOTE for sitemaps: /reels is deliberately NOT in src/lib/site-routes.ts —
 * the platform's /sitemap-content.xml already lists it conditionally (only
 * while enabled + populated), which a static route list can't express.
 */
export default async function ReelsPage() {
  let reels: InstagramReel[] = [];
  let meta: InstagramReelsMeta = {};
  try {
    const res = await api.getReels({ placement: 'all', limit: 48 });
    reels = res.data ?? [];
    meta = (res.meta as InstagramReelsMeta) ?? {};
  } catch {
    notFound();
  }
  if (!meta.reelsPageEnabled) notFound();

  const handle = (meta.instagramHandle || SITE.instagramHandle).replace(/^@/, '');
  const profileUrl = `https://www.instagram.com/${handle}/`;

  const campaignText = meta.campaign?.enabled
    ? meta.campaign.headline || `Tag @${handle} in your reel for a chance to get featured here`
    : null;

  const renderCampaignText = (text: string) => {
    const token = `@${handle}`;
    const parts = text.split(token);
    if (parts.length === 1) return text;
    return parts.flatMap((part, i) =>
      i === 0
        ? [part]
        : [
            <a
              key={i}
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-rose-deep underline-offset-2 hover:underline"
            >
              {token}
            </a>,
            part,
          ],
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-blush/60 py-14 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-rose-deep">
              On the reel
            </p>
            <h1 className="font-display text-4xl font-medium text-foreground md:text-5xl">Reels</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              From our Instagram —{' '}
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-deep underline-offset-2 hover:underline"
              >
                @{handle}
              </a>
            </p>
            <div className="hairline-gold mx-auto mt-6 w-24" aria-hidden />
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {reels.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                Nothing here yet — new reels are on the way. Meanwhile, find us on{' '}
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-deep underline-offset-2 hover:underline"
                >
                  Instagram
                </a>
                .
              </p>
            ) : (
              <div className="flex flex-wrap items-start justify-center gap-6">
                {reels.map((reel) => (
                  <div key={reel._id} className="w-[min(92vw,540px)]">
                    <ReelEmbed href={reel.url} caption={reel.caption} />
                  </div>
                ))}
              </div>
            )}

            {campaignText && (
              <p className="mx-auto mt-14 max-w-xl text-center text-sm text-muted-foreground">
                <Instagram
                  className="mr-1.5 inline h-4 w-4 -translate-y-px text-rose-deep"
                  aria-hidden
                />
                {renderCampaignText(campaignText)}
              </p>
            )}
            {meta.campaign?.enabled && meta.campaign.allowSubmissions && <ReelSubmitForm />}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
