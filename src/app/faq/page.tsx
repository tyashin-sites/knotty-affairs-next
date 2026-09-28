import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'FAQ',
  description: 'Frequently asked questions about Knotty Affairs orders, sizing, shipping and returns.',
  path: '/faq',
});

interface FaqEntry {
  _id: string;
  question: string;
  /** HTML answer (admin RTE). The public route names it `body`, not `answer`. */
  body: string;
  category?: string;
  order?: number;
}

const PROJECT_ID = process.env.PROJECT_ID || '6a9107c55814a1e374bebf28';
const API_URL = process.env.TYASHIN_API_URL || 'https://website-api.tyashin.com';

async function loadFaqs(): Promise<FaqEntry[]> {
  try {
    // The FAQ store is the e-commerce FAQ collection; its public route lives
    // under /public/ecommerce/faq (project resolved from the API key) and
    // returns { entries, grouped }. `/public/faq` does not exist (404).
    const res = await fetch(`${API_URL}/api/v1/public/ecommerce/faq?projectId=${PROJECT_ID}`, {
      headers: { 'X-API-Key': process.env.TYASHIN_API_KEY || '' },
      next: { revalidate: 300 },
    });
    const json = (await res.json()) as { success: boolean; data?: { entries?: FaqEntry[] } | FaqEntry[] };
    if (!json.success || !json.data) return [];
    return Array.isArray(json.data) ? json.data : (json.data.entries ?? []);
  } catch (err) {
    console.error('[faq]', err);
    return [];
  }
}

export default async function FaqPage() {
  const faqs = await loadFaqs();

  // FAQPage schema.org JSON-LD — AEO/GEO bait for ChatGPT/Perplexity citations.
  const jsonLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() },
        })),
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-cream py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Frequently Asked Questions</h1>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container mx-auto max-w-3xl px-4">
            {faqs.length === 0 ? (
              <p className="text-center text-muted-foreground">
                We&apos;re putting together a comprehensive FAQ. In the meantime, WhatsApp us at{' '}
                <a
                  className="text-rose-deep hover:underline"
                  href="https://wa.me/917838040976"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 78380 40976
                </a>
                .
              </p>
            ) : (
              <div className="space-y-4">
                {faqs.map((f) => (
                  <details
                    key={f._id}
                    className="group rounded-lg border border-border bg-background p-5 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="cursor-pointer text-base font-semibold text-foreground">
                      {f.question}
                    </summary>
                    <div
                      className="mt-3 text-sm leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: f.body }}
                    />
                  </details>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
    </div>
  );
}
