'use client';

import { useEffect, useMemo, useState } from 'react';
import { whatsappLink } from '@/lib/seo';

/**
 * "Find my fit" size guide — Mridul's official chart (2026-10-23 brief).
 * The full chart is visible the moment the sheet opens (zero typing needed);
 * the measurement-based recommender is an optional, collapsed extra.
 * All values in inches; cm is a display conversion only.
 */

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] as const;
type Size = (typeof SIZES)[number];

const TOPS: { label: string; key: 'chest' | 'waist' | 'hip' | 'shoulder'; values: number[] }[] = [
  { label: 'Chest', key: 'chest', values: [34, 36, 38, 40, 42, 44, 46] },
  { label: 'Waist', key: 'waist', values: [30, 32, 34, 36, 38, 40, 42] },
  { label: 'Hip', key: 'hip', values: [38, 40, 42, 44, 46, 48, 50] },
  { label: 'Shoulder', key: 'shoulder', values: [14, 14, 14.5, 15, 15.5, 16, 16.5] },
];
const TOPS_LENGTH = 'XS–S 26" · M–L 28" · XL–3XL 30"';

const PANTS: { label: string; key: 'waist' | 'hip' | 'length'; values: number[] }[] = [
  { label: 'Waist', key: 'waist', values: [28, 30, 32, 34, 36, 38, 40] },
  { label: 'Hip', key: 'hip', values: [40, 42, 44, 46, 48, 50, 52] },
  { label: 'Length', key: 'length', values: [38, 38, 38, 38, 38, 38, 38] },
];

export type GarmentKind = 'tops' | 'pants' | 'coord';

/** Category slug/name → which chart(s) apply. Co-ords show top + bottom. */
export function garmentKindFor(category?: string): GarmentKind {
  const c = (category || '').toLowerCase();
  if (/co-?ord|set/.test(c)) return 'coord';
  if (/pant|salwar|trouser|bottom|palazzo/.test(c)) return 'pants';
  return 'tops';
}

type Measurements = { bust: string; waist: string; hip: string };
const FIT_KEY = 'ka-fit-v1';

function readFit(): { top?: Size; bottom?: Size; m?: Measurements } {
  try {
    return JSON.parse(localStorage.getItem(FIT_KEY) || '{}');
  } catch {
    return {};
  }
}
function writeFit(v: { top?: Size; bottom?: Size; m?: Measurements }) {
  try {
    localStorage.setItem(FIT_KEY, JSON.stringify(v));
  } catch {
    /* private mode — the guide still works, it just won't remember */
  }
}

/** Smallest size whose garment measure ≥ body measure on every entered dimension. */
function recommend(
  rows: { key: string; values: number[] }[],
  body: Record<string, number | undefined>,
): Size | 'custom' | null {
  const dims = Object.entries(body).filter(([, v]) => v && v > 0) as [string, number][];
  if (dims.length === 0) return null;
  for (let i = 0; i < SIZES.length; i++) {
    const fits = dims.every(([k, v]) => {
      const row = rows.find((r) => r.key === k);
      return !row || row.values[i] >= v;
    });
    if (fits) return SIZES[i];
  }
  return 'custom';
}

const fmt = (inches: number, unit: 'in' | 'cm') =>
  unit === 'in' ? String(inches) : String(Math.round(inches * 2.54));

function Chart({
  title,
  rows,
  highlight,
  unit,
  footnote,
}: {
  title: string;
  rows: { label: string; values: number[] }[];
  highlight: Size | null;
  unit: 'in' | 'cm';
  footnote?: string;
}) {
  const hi = highlight ? SIZES.indexOf(highlight) : -1;
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full table-fixed text-center text-xs sm:text-sm">
          <caption className="sr-only">
            {title} size chart in {unit === 'in' ? 'inches' : 'centimetres'}
          </caption>
          <thead>
            <tr className="bg-cream">
              <th scope="col" className="w-[4.5rem] px-2 py-2 text-left font-medium text-muted-foreground sm:w-24">
                {unit === 'in' ? 'inches' : 'cm'}
              </th>
              {SIZES.map((s, i) => (
                <th
                  key={s}
                  scope="col"
                  className={`px-0.5 py-2 font-semibold transition-colors duration-300 ${
                    i === hi ? 'bg-primary text-primary-foreground' : 'text-foreground'
                  }`}
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-border">
                <th scope="row" className="px-2 py-2 text-left font-medium text-foreground">
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td
                    key={i}
                    className={`px-0.5 py-2 tabular-nums transition-colors duration-300 ${
                      i === hi ? 'bg-primary/15 font-semibold text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {fmt(v, unit)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote && <p className="mt-2 text-xs text-muted-foreground">{footnote}</p>}
    </div>
  );
}

/** Line-art figure; the active measurement's tape line draws itself in. */
function MeasureFigure({ active }: { active: keyof Measurements | null }) {
  const line = (k: keyof Measurements, y: number, w: number) => (
    <ellipse
      key={k}
      cx="50"
      cy={y}
      rx={w}
      ry="3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeDasharray="80"
      strokeDashoffset={active === k ? 0 : 80}
      className={`transition-[stroke-dashoffset] duration-700 ${active === k ? 'text-sage' : 'text-transparent'}`}
    />
  );
  return (
    <svg viewBox="0 0 100 150" className="h-36 w-24 shrink-0 text-muted-foreground" aria-hidden="true">
      <circle cx="50" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M41 30 Q50 34 59 30 L72 40 L66 52 L63 47 L62 60 Q58 70 60 80 Q66 96 66 112 L56 112 L50 92 L44 112 L34 112 Q34 96 40 80 Q42 70 38 60 L37 47 L34 52 L28 40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {line('bust', 50, 13)}
      {line('waist', 68, 10)}
      {line('hip', 84, 14)}
    </svg>
  );
}

const TIPS: Record<keyof Measurements, string> = {
  bust: 'Around the fullest part of your bust, tape level across your back.',
  waist: 'Around your natural waist — the narrowest part of your torso.',
  hip: 'Around the fullest part of your hips, feet together.',
};

export default function SizeGuide({
  productName,
  categoryName,
}: {
  productName: string;
  categoryName?: string;
}) {
  const kind = garmentKindFor(categoryName);
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [tab, setTab] = useState<'tops' | 'pants'>(kind === 'pants' ? 'pants' : 'tops');
  const [finder, setFinder] = useState(false);
  const [m, setM] = useState<Measurements>({ bust: '', waist: '', hip: '' });
  const [focus, setFocus] = useState<keyof Measurements | null>(null);
  const [saved, setSaved] = useState<{ top?: Size; bottom?: Size }>({});

  // Restore a fit found on an earlier product (client-only, after mount).
  useEffect(() => {
    const f = readFit();
    setSaved({ top: f.top, bottom: f.bottom });
    if (f.m) setM(f.m);
  }, []);

  // Close on Escape; lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Inputs are in the selected unit; the chart maths is in inches.
  const toIn = (s: string) => {
    const n = parseFloat(s);
    if (!Number.isFinite(n) || n <= 0) return undefined;
    return unit === 'cm' ? n / 2.54 : n;
  };
  const body = { chest: toIn(m.bust), waist: toIn(m.waist), hip: toIn(m.hip) };
  const topRec = useMemo(() => recommend(TOPS, body), [m.bust, m.waist, m.hip, unit]);
  const bottomRec = useMemo(
    () => recommend(PANTS, { waist: body.waist, hip: body.hip }),
    [m.waist, m.hip, unit],
  );

  // Persist whatever the finder lands on so the next product pre-knows it.
  useEffect(() => {
    if (!finder) return;
    const top = topRec && topRec !== 'custom' ? topRec : undefined;
    const bottom = bottomRec && bottomRec !== 'custom' ? bottomRec : undefined;
    if (!top && !bottom) return;
    writeFit({ top, bottom, m });
    setSaved({ top, bottom });
  }, [finder, topRec, bottomRec, m]);

  const highlightTop = finder ? (topRec !== 'custom' ? topRec : null) : saved.top ?? null;
  const highlightBottom = finder ? (bottomRec !== 'custom' ? bottomRec : null) : saved.bottom ?? null;

  const savedLabel =
    kind === 'coord' && saved.top && saved.bottom && saved.top !== saved.bottom
      ? `Top ${saved.top} · Bottom ${saved.bottom}`
      : kind === 'pants'
        ? saved.bottom
        : saved.top;

  const verdict = (() => {
    if (!finder) return null;
    const t = topRec, b = bottomRec;
    if (kind === 'pants') {
      if (!b) return null;
      return b === 'custom' ? 'custom' : `You're a ${b} in pants & salwars.`;
    }
    if (!t) return null;
    if (t === 'custom' || (kind === 'coord' && b === 'custom')) return 'custom';
    if (kind === 'coord' && b && b !== t) return `Top ${t} · Bottom ${b} — co-ords can be mixed.`;
    return `You're a ${t}${kind === 'coord' ? ' in this set' : ' in tops & shirts'}.`;
  })();

  const customMsg = (() => {
    const parts = [
      m.bust && `Bust ${m.bust}`,
      m.waist && `Waist ${m.waist}`,
      m.hip && `Hip ${m.hip}`,
    ].filter(Boolean);
    const meas = parts.length ? ` My measurements (${unit === 'in' ? 'inches' : 'cm'}): ${parts.join(', ')}.` : '';
    return `Hi, I really love the Knotty Affairs by Mridul Collection. I'd like "${productName}" in custom measurements.${meas}`;
  })();

  const showTops = kind === 'coord' || tab === 'tops';
  const showPants = kind === 'coord' || tab === 'pants';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-sage"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="2" y="8" width="20" height="8" rx="1.5" />
          <path d="M6 8v3M10 8v4M14 8v3M18 8v4" />
        </svg>
        Size guide
        {savedLabel && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs no-underline text-foreground">
            Your fit: {savedLabel}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Size guide">
          <button
            type="button"
            aria-label="Close size guide"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40 ka-fade-in"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-background p-5 shadow-2xl ka-sheet-in md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[520px] md:rounded-none md:rounded-l-3xl md:p-8">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border md:hidden" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Size guide</p>
                <h2 className="mt-1 font-display text-2xl text-foreground">Find your fit</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-full border border-border p-0.5 text-xs" role="group" aria-label="Units">
                  {(['in', 'cm'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      aria-pressed={unit === u}
                      onClick={() => setUnit(u)}
                      className={`rounded-full px-3 py-1 transition-colors ${
                        unit === u ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-lg hover:bg-cream"
                >
                  ×
                </button>
              </div>
            </div>

            {kind !== 'coord' && (
              <div className="mt-5 flex gap-2" role="tablist">
                {(
                  [
                    ['tops', 'Tops & shirts'],
                    ['pants', 'Pants & salwars'],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={tab === k}
                    onClick={() => setTab(k)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      tab === k
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-foreground hover:border-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {showTops && (
              <Chart
                title={kind === 'coord' ? 'Top' : 'Tops & shirts'}
                rows={TOPS}
                highlight={highlightTop}
                unit={unit}
                footnote={`Standard length: ${TOPS_LENGTH}${unit === 'cm' ? ' (inches)' : ''}`}
              />
            )}
            {showPants && (
              <Chart
                title={kind === 'coord' ? 'Bottom' : 'Pants & salwars'}
                rows={PANTS}
                highlight={highlightBottom}
                unit={unit}
              />
            )}

            {/* Optional: measurement-based recommendation. Closed by default —
                the chart above already answers the question without typing. */}
            <div className="mt-6 rounded-2xl border border-border">
              <button
                type="button"
                aria-expanded={finder}
                onClick={() => setFinder((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground"
              >
                <span>Not sure? Find my size from my measurements</span>
                <span className={`transition-transform duration-300 ${finder ? 'rotate-45' : ''}`}>+</span>
              </button>
              {finder && (
                <div className="flex gap-4 border-t border-border px-4 pb-4 pt-3">
                  <MeasureFigure active={focus} />
                  <div className="flex-1">
                    {(['bust', 'waist', 'hip'] as const).map((k) => (
                      <label key={k} className="mb-2 block">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {k} ({unit})
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          value={m[k]}
                          onFocus={() => setFocus(k)}
                          onBlur={() => setFocus(null)}
                          onChange={(e) => setM((p) => ({ ...p, [k]: e.target.value }))}
                          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                        />
                      </label>
                    ))}
                    <p className="min-h-[2.5rem] text-xs text-muted-foreground">
                      {focus ? TIPS[focus] : 'Fill in any one — more gives a closer match.'}
                    </p>
                  </div>
                </div>
              )}
              {verdict && (
                <div className="border-t border-border px-4 py-3 text-sm" aria-live="polite">
                  {verdict === 'custom' ? (
                    <span>
                      You&apos;re between our standard sizes — Mridul can tailor this piece to you.
                    </span>
                  ) : (
                    <span className="font-semibold text-foreground">✿ {verdict}</span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-cream p-4 text-sm">
              <p className="font-semibold text-foreground">Custom measurements</p>
              <p className="mt-1 text-muted-foreground">
                Want it made to your measurements? We can do that — extra charges apply.
              </p>
              <a
                href={whatsappLink(customMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded-full border border-sage px-4 py-2 text-xs font-semibold uppercase tracking-wider text-sage transition-colors hover:bg-sage hover:text-primary-foreground"
              >
                Ask for custom fit on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
