const WORDS = ["Social Media", "Influencer Marketing", "Brand Deals", "Content", "Strategy", "NOCAP", "Growth"];

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-[#141414] py-4" data-testid="editorial-marquee">
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {WORDS.map((w) => (
              <span key={`${copy}-${w}`} className="flex items-center gap-8 pr-8 font-mono text-xs tracking-[0.25em] uppercase">
                <span className={w === "NOCAP" ? "font-semibold text-[#C6F24E]" : "text-[#FBF8F2]/80"}>{w}</span>
                <span className="text-[#C6F24E]/50">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
