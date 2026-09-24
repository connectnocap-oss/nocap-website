import { Asterisk } from "lucide-react";

const WORDS = ["Strategy", "Culture", "Content", "Influence", "Events", "Partnerships", "No Cap"];

export default function Marquee() {
  return (
    <div className="mt-6 overflow-hidden border-y border-[#E7E2D8] py-5" data-testid="editorial-marquee">
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {WORDS.map((w) => (
              <span
                key={`${copy}-${w}`}
                className="flex items-center gap-10 pr-10 font-heading text-lg font-semibold tracking-[0.25em] text-[#143D2B] uppercase"
              >
                {w}
                <Asterisk size={16} className="text-[#C6F24E] drop-shadow-[0_0_1px_#143D2B]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
