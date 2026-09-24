export default function LogoMark({ accent = "#143D2B", className = "" }: { accent?: string; className?: string }) {
  return (
    <span className={`font-heading text-xl font-black uppercase tracking-tighter ${className}`}>
      N<span style={{ color: accent }}>Ø</span>CAP
      <span className="align-super text-[0.5em] tracking-normal" style={{ color: accent }}>®</span>
    </span>
  );
}
