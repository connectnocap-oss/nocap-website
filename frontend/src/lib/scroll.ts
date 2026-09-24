import Lenis from "lenis";

let lenis: Lenis | null = null;

export function initLenis(): () => void {
  lenis = new Lenis({ lerp: 0.09 });
  let raf = 0;
  const loop = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToSection(hash: string) {
  if (lenis) {
    lenis.scrollTo(hash, { offset: -88, duration: 1.4 });
  } else {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }
}
