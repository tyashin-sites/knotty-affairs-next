import Link from 'next/link';
import { Heart, Scissors, Leaf, Sparkles, Instagram } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import ProductCard from '@/components/ProductCard';
import { api } from '@/lib/api';
import { getCategoryLandingHref } from '@/lib/category-routing';
import { SITE, whatsappLink } from '@/lib/seo';
import type { ApiCategory, ApiProduct } from '@/lib/types';

const TICKER = [
  'New drops every season',
  'Tailored for the Indian silhouette',
  'Fabric-first, always',
  'Shipping across India',
  'Designed by Mridul Garg',
];

/** Home page — server-rendered. Catalog reads are cached 60s by the API client. */
export default async function HomePage() {
  let categories: ApiCategory[] = [];
  let bestsellers: ApiProduct[] = [];
  let featured: ApiProduct[] = [];
  try {
    // With a young catalog soldCount ties at 0 and both lists collapse onto the
    // same newest products — split by creation order instead so every piece
    // gets one slot on the home page (8 "bestsellers" + 4 "new in", no dupes).
    const [c, b, f] = await Promise.all([
      api.getCategories(),
      api.getProducts({ limit: 8, sortBy: 'createdAt', sortOrder: 'asc' }),
      api.getProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' }),
    ]);
    categories = c.data ?? [];
    bestsellers = b.data ?? [];
    featured = f.data ?? [];
  } catch (err) {
    console.error('[home]', err);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* ── Hero: editorial split (signature #1) ─────────────────────── */}
        <section className="relative overflow-hidden">
          {/* soft ivory→blush wash, ≤6% per DESIGN-SPEC */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-blush/60" aria-hidden />
          <div className="container relative mx-auto grid grid-cols-1 items-center gap-10 px-4 py-16 md:py-20 lg:grid-cols-12 lg:gap-6 lg:py-24">
            <div className="reveal reveal-1 lg:col-span-6">
              <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-rose-deep">
                Knotty Affairs by Mridul
                <span className="hairline-gold w-16" aria-hidden />
              </p>
              <h1 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-medium leading-[1.05] text-foreground">
                Romance,
                <br />
                <em className="text-rose-deep">tailored</em> for the city.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                Designer tops, shirts and co-ord sets cut for the modern Indian
                silhouette — comfort, fashion and quality fabric in one.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="rounded-full bg-primary px-8 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-plum"
                >
                  Shop the Edit
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-foreground"
                >
                  Our Story
                  <span className="h-px w-8 bg-foreground transition-all group-hover:w-12 group-hover:bg-rose-deep" aria-hidden />
                </Link>
              </div>
            </div>

            {/* Layered image tiles */}
            <div className="relative lg:col-span-6">
              <div className="reveal reveal-2 relative ml-auto aspect-[3/4] w-4/5 overflow-hidden rounded-2xl md:w-3/5 lg:w-[68%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-1.jpg"
                  alt="Knotty Affairs signature look — designer top in soft rose"
                  className="h-full w-full object-cover"
                  width={900}
                  height={1200}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="reveal reveal-3 absolute -bottom-8 left-0 hidden aspect-[4/5] w-2/5 overflow-hidden rounded-2xl border-4 border-background shadow-rose md:block lg:w-[38%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-2.jpg"
                  alt="Co-ord set detail"
                  className="h-full w-full object-cover"
                  width={600}
                  height={750}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <Heart
                className="absolute -top-3 right-6 h-7 w-7 rotate-12 fill-rose text-rose md:right-10"
                aria-hidden
              />
            </div>
          </div>
        </section>

        {/* ── Marquee ticker (signature #2) ────────────────────────────── */}
        <section className="overflow-hidden bg-primary py-3.5 text-primary-foreground" aria-hidden>
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {TICKER.map((t) => (
                  <span key={`${copy}-${t}`} className="flex items-center whitespace-nowrap px-6 text-[13px] uppercase tracking-[0.22em]">
                    {t}
                    <Heart className="ml-12 h-3 w-3 fill-rose text-rose" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── Categories (signature #3) ────────────────────────────────── */}
        {categories.length > 0 && (
          <section className="bg-background py-20 md:py-28">
            <div className="container mx-auto px-4">
              <SectionHeading eyebrow="Wardrobe" title="Shop by Category" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={getCategoryLandingHref(cat.slug)}
                    className="group relative aspect-[4/5] overflow-hidden rounded-xl"
                  >
                    {cat.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blush">
                        <span className="font-display text-3xl italic text-rose-deep">{cat.name[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <h3 className="font-display text-xl font-medium italic text-white md:text-2xl">
                        {cat.name}
                      </h3>
                      <span className="hairline-gold mt-2 block w-0 transition-all duration-500 group-hover:w-24" aria-hidden />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Bestsellers ──────────────────────────────────────────────── */}
        {bestsellers.length > 0 && (
          <section className="bg-cream py-20 md:py-28">
            <div className="container mx-auto px-4">
              <SectionHeading eyebrow="Most loved" title="Bestsellers" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {bestsellers.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href="/products"
                  className="inline-block rounded-full border border-primary px-9 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  View All
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── About teaser — the brand promise ─────────────────────────── */}
        <section className="bg-plum py-20 text-primary-foreground md:py-28">
          <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-4 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-rose">
                The Knotty Affairs promise
              </p>
              <p className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-medium italic leading-snug">
                Clothes that love you back — cut for real bodies, real days, and
                the best of all worlds.
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed opacity-80">
                Founder Mridul Garg designs sustainable fashion with a modern
                urban vibe, in silhouettes that complement the Indian body type —
                so you never choose between comfort, fashion and fabric.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-block rounded-full border border-primary-foreground/40 px-8 py-3 text-sm font-medium uppercase tracking-[0.14em] transition-colors hover:bg-primary-foreground/10"
              >
                Meet Mridul
              </Link>
            </div>
            <div className="hidden lg:col-span-5 lg:block">
              <div className="relative mx-auto aspect-[4/5] w-4/5 overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/founder-mridul.jpeg"
                  alt="Mridul Garg, founder of Knotty Affairs"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── New in ───────────────────────────────────────────────────── */}
        {featured.length > 0 && (
          <section className="bg-background py-20 md:py-28">
            <div className="container mx-auto px-4">
              <SectionHeading eyebrow="Fresh off the rack" title="New In" />
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
                {featured.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Reel rail (signature #5) ─────────────────────────────────── */}
        <section className="bg-blush/60 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="On the reel"
              title="Follow the affair"
              subtitle={`Fits, fabrics and behind-the-seams — ${SITE.instagramHandle}`}
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {['/reel-1.jpg', '/reel-2.jpg', '/reel-3.jpg', '/reel-4.jpg'].map((src, i) => (
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
          </div>
        </section>

        {/* ── Promise strip (signature #6) ─────────────────────────────── */}
        <section className="border-t border-border bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
              {[
                {
                  Icon: Leaf,
                  title: 'Fabric first',
                  desc: 'Sustainable, breathable fabrics you will want on your skin all day.',
                },
                {
                  Icon: Scissors,
                  title: 'Tailored for you',
                  desc: 'Silhouettes cut to complement the modern Indian body type.',
                },
                {
                  Icon: Sparkles,
                  title: 'Every occasion',
                  desc: 'Work mornings to wedding evenings — one wardrobe, no compromises.',
                },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50">
                    <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-xl font-medium">{title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA — WhatsApp ───────────────────────────────────── */}
        <section className="bg-cream py-20 md:py-24">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <Heart className="mx-auto mb-5 h-6 w-6 fill-rose text-rose" aria-hidden />
            <h2 className="font-display text-3xl font-medium md:text-4xl">
              Not sure of your size or style?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Message us on WhatsApp — we will help you find the fit that feels
              like it was made for you.
            </p>
            <a
              href={whatsappLink('Hi Knotty Affairs! Help me find my fit.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-primary px-9 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-plum"
            >
              Chat with Us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
