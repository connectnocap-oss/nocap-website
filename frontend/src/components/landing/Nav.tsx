import { scrollToSection } from "@/lib/scroll";
import LogoMark from "./LogoMark";

const LINKS: [string, string, string][] = [
  ["Home", "#top", "home"],
  ["Our Work", "#work", "our-work"],
  ["Services", "#expertise", "services"],
];

export default function Nav() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-[#FBF8F2]/90 backdrop-blur-md"
      data-testid="main-nav"
    >
      <nav className="relative mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => scrollToSection("#top")}
          className="cursor-pointer"
          data-testid="nav-logo"
          aria-label="NOCAP home"
        >
          <LogoMark height={26} />
        </button>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          {LINKS.map(([label, hash, id]) => (
            <button
              key={hash}
              onClick={() => scrollToSection(hash)}
              className="cursor-pointer text-sm font-medium text-[#121212]/70 transition-colors duration-300 hover:text-[#121212]"
              data-testid={`nav-link-${id}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollToSection("#contact")}
          className="cursor-pointer rounded-full bg-[#C6F24E] px-6 py-2.5 font-mono text-xs font-semibold tracking-[0.18em] text-[#0F172A] uppercase transition-transform duration-300 hover:scale-[1.04]"
          data-testid="nav-cta-button"
        >
          Pull Up
        </button>
      </nav>
    </header>
  );
}
