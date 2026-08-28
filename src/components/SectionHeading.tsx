interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-rose-deep">
        {eyebrow}
      </p>
      <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.8rem)] font-medium text-foreground">
        {title}
      </h2>
      {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{subtitle}</p>}
      <div className="hairline-gold mx-auto mt-5 w-24" aria-hidden />
    </div>
  );
}
