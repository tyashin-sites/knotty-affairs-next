import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';
import { Instagram, Truck } from 'lucide-react';
import { pageMetadata, SITE, whatsappLink } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with Knotty Affairs by Mridul — WhatsApp, Instagram or the contact form. Sizing help, order questions and styling advice.',
  path: '/contact',
});

/**
 * Contact — WhatsApp-first (the brand's real, confirmed channel). No email or
 * street address is shown because the customer has not supplied one
 * (docs/ASSET-DEBT.md #5/#6) — never invent contact facts.
 */
const CONTACT_INFO = [
  {
    label: 'WhatsApp',
    value: SITE.whatsappDisplay,
    href: whatsappLink('Hi Knotty Affairs!'),
    Icon: null,
  },
  {
    label: 'Instagram',
    value: SITE.instagramHandle,
    href: SITE.instagram,
    Icon: Instagram,
  },
  { label: 'Shipping', value: 'All across India', Icon: Truck },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-blush/60 py-14 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-rose-deep">
              Contact
            </p>
            <h1 className="font-display text-4xl font-medium text-foreground md:text-5xl">
              We&apos;d love to hear from you
            </h1>
            <div className="hairline-gold mx-auto mt-6 w-24" aria-hidden />
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold text-foreground">
                  Get in touch
                </h2>
                <div className="space-y-5">
                  {CONTACT_INFO.map(({ Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush">
                        {Icon ? (
                          <Icon className="h-4 w-4 text-rose-deep" />
                        ) : (
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-rose-deep" aria-hidden>
                            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.1 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.1 4c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 4 2.2.9 2.7.7 3.2.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.2-.2-.5-.3l-1.8-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L10 8.2c-.2-.4-.4-.4-.6-.4h-.5Z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-foreground transition-colors hover:text-rose-deep"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm text-foreground">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-xl border border-rose/40 bg-blush/40 p-6">
                  <p className="mb-2 font-display text-lg font-semibold text-foreground">
                    Sizing &amp; styling help
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Unsure between two sizes, or want to style a co-ord for an occasion? Message us —
                    we answer personally.
                  </p>
                  <a
                    href={whatsappLink('Hi Knotty Affairs! I need help with sizing/styling.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-rose-deep hover:underline"
                  >
                    Chat on WhatsApp →
                  </a>
                </div>
              </div>

              <div>
                <h2 className="mb-6 font-display text-2xl font-semibold text-foreground">
                  Send a message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
