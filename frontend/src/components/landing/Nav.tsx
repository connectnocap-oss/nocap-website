import { scrollToSection } from "@/lib/scroll";
import LogoMark from "./LogoMark";

const LINKS: [string, string][] = [
  ["Work", "#work"],
  ["Numbers", "#numbers"],
  ["Expertise", "#expertise"],
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 sm:px-6">
      <nav
        className="mx-auto mt-3 flex max-w-7xl items-center justify-between rounded-full border border-black/10 bg-[#FBF8F2]/85 py-2.5 pr-2.5 pl-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-md"
        data-testid="main-nav"
      >
        <button
          onClick={() => scrollToSection("#top")}
          className="cursor-pointer"
          data-testid="nav-logo"
          aria-label="Back to top"
        >
          <LogoMark />
        </button>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map(([label, hash]) => (
            <button
              key={hash}
              onClick={() => scrollToSection(hash)}
              className="cursor-pointer font-mono text-xs tracking-[0.18em] text-[#57534E] uppercase transition-colors duration-300 hover:text-[#121212]"
              data-testid={`nav-link-${label.toLowerCase()}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollToSection("#contact")}
          className="group flex cursor-pointer items-center gap-2.5 rounded-full bg-[#143D2B] py-2.5 pr-6 pl-4 font-mono text-xs tracking-[0.15em] text-[#FBF8F2] uppercase transition-colors duration-300 hover:bg-[#0F2E20]"
          data-testid="nav-cta-button"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C6F24E] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C6F24E]" />
          </span>
          Start Something
        </button>
      </nav>
    </header>
  );
}
