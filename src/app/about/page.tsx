import Link from 'next/link';
import { Heart, Leaf, Scissors, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pageMetadata, SITE, whatsappLink } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Our Story',
  description:
    'The story of Knotty Affairs by Mridul — fashion designer Mridul Garg on sustainable designer womenswear tailored for the modern Indian silhouette.',
  path: '/about',
});

/**
 * Our Story — trust page (DESIGN-SPEC blueprint). All narrative here derives
 * from the founder's own intake brief; no invented history, awards or dates.
 */
export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Title band */}
        <section className="bg-blush/60 py-14 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-rose-deep">
              Our Story
            </p>
            <h1 className="font-display text-4xl font-medium text-foreground md:text-5xl">
              An affair with <em className="text-rose-deep">good design</em>
            </h1>
            <div className="hairline-gold mx-auto mt-6 w-24" aria-hidden />
          </div>
        </section>

        {/* Founder split */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto grid grid-cols-1 items-start gap-12 px-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/founder-mridul.jpeg"
                    alt="Mridul Garg, founder and designer of Knotty Affairs"
                    className="w-full object-cover"
                  />
                </div>
                <Heart className="absolute -right-3 -top-3 h-8 w-8 rotate-12 fill-rose text-rose" aria-hidden />
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Mridul Garg — founder &amp; designer
              </p>
            </div>

            <div className="space-y-6 leading-relaxed text-foreground/85 lg:col-span-7">
              <p>
                <strong className="text-foreground">Knotty Affairs</strong> is the work of fashion
                designer <strong className="text-foreground">Mridul Garg</strong> — a label built on
                one conviction: a woman should never have to choose between comfort, fashion and
                quality fabric. She should get the best of all worlds, in every piece.
              </p>
              <p>
                Mridul designs sustainable fashion with a modern urban vibe, created specially for
                the silhouette of the modern Indian woman. Every top, shirt and co-ord set is cut in
                shapes that complement the Indian body type — clothes that move with your day, from
                work mornings to late dinners, and make you feel confident in your own body.
              </p>
              <p>
                You will find trendy tops, shirts and co-ord sets for all occasions and every budget
                at Knotty Affairs — each one an exceptional, unique design in fabric you will want
                to live in.
              </p>

              <h2 className="pt-2 font-display text-2xl font-semibold text-foreground">The vision</h2>
              <p>
                To make women feel confident in their bodies. Not by asking them to fit the clothes —
                by cutting the clothes to fit them.
              </p>

              <h2 className="pt-2 font-display text-2xl font-semibold text-foreground">The motto</h2>
              <p>
                Exceptional, unique designs in high-quality fabrics — for the woman who does not
                compromise on either.
              </p>
            </div>
          </div>
        </section>

        {/* Values strip */}
        <section className="bg-cream py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
              {[
                {
                  Icon: Leaf,
                  title: 'Sustainable by design',
                  desc: 'Considered fabrics and small, intentional drops — fashion that lasts past the season.',
                },
                {
                  Icon: Scissors,
                  title: 'Cut for real bodies',
                  desc: 'Silhouettes designed around the modern Indian woman — not the other way round.',
                },
                {
                  Icon: Sparkles,
                  title: 'Every budget, every occasion',
                  desc: 'Designer-level pieces across a range of price points — no compromise required.',
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

        {/* Single CTA (one intent per URL) */}
        <section className="py-16 text-center md:py-20">
          <div className="container mx-auto max-w-xl px-4">
            <h2 className="font-display text-3xl font-medium md:text-4xl">
              Find the piece that fits your story
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-primary px-9 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-plum"
              >
                Shop the Collection
              </Link>
              <a
                href={whatsappLink('Hi Mridul! I would love to know more about Knotty Affairs.')}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-primary px-9 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Say Hello on WhatsApp
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Follow the affair on{' '}
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-deep underline-offset-2 hover:underline"
              >
                Instagram {SITE.instagramHandle}
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
