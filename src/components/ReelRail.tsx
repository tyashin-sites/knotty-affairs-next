import { Instagram } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ReelEmbed from './ReelEmbed';
import ReelSubmitForm from './ReelSubmitForm';
import { api } from '@/lib/api';
import { SITE } from '@/lib/seo';
import type { InstagramReel, InstagramReelsMeta } from '@/lib/types';

/**
 * Home-page reel rail (server component).
 *
 * Data source: the Tyashin `instagram-reels` plugin's public API — only
 * admin-APPROVED reels ever come back. When the plugin is off or nothing is
 * approved yet, we fall back to the static placeholder tiles so the section
 * never renders broken or empty.
 */
const FALLBACK = ['/reel-1.jpg', '/reel-2.jpg', '/reel-3.jpg', '/reel-4.jpg'];

export default async function ReelRail() {
  let reels: InstagramReel[] = [];
  let meta: InstagramReelsMeta = {};
  try {
    const res = await api.getReels({ placement: 'home', limit: 4 });
    reels = res.data ?? [];
    meta = (res.meta as InstagramReelsMeta) ?? {};
  } catch {
    // plugin absent / API hiccup → static fallback below
  }

  const handle = (meta.instagramHandle || SITE.instagramHandle).replace(/^@/, '');
  const profileUrl = `https://www.instagram.com/${handle}/`;

  /**
   * Campaign copy with every "@handle" mention rendered as a follow link —
   * one tap from "get featured" to following the brand. Works for the default
   * line and for custom headlines that mention the handle anywhere.
   */
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

  const campaignText = meta.campaign?.enabled
    ? meta.campaign.headline || `Tag @${handle} in your reel for a chance to get featured here`
    : null;

  return (
    <section className="bg-blush/60 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="On the reel"
          title="Follow the affair"
          subtitle={
            <>
              Fits, fabrics and behind-the-seams —{' '}
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-deep underline-offset-2 hover:underline"
              >
                @{handle}
              </a>
            </>
          }
        />

        {reels.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {reels.map((reel, i) => (
              <ReelEmbed
                key={reel._id}
                embedUrl={reel.embedUrl}
                href={reel.url}
                caption={reel.caption}
                offset={i % 2 === 1}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {FALLBACK.map((src, i) => (
              <a
                key={src}
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative aspect-[9/16] overflow-hidden rounded-2xl border-4 border-background shadow-rose ${i % 2 === 1 ? 'md:translate-y-6' : ''}`}
                aria-label={`Open Knotty Affairs on Instagram (${SITE.instagramHandle})`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Knotty Affairs look on Instagram"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <Instagram className="h-7 w-7 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </a>
            ))}
          </div>
        )}

        {campaignText && (
          <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground">
            <Instagram className="mr-1.5 inline h-4 w-4 -translate-y-px text-rose-deep" aria-hidden />
            {renderCampaignText(campaignText)}
          </p>
        )}
        {meta.campaign?.enabled && meta.campaign.allowSubmissions && <ReelSubmitForm />}
      </div>
    </section>
  );
}
