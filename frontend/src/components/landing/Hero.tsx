import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Images, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { HERO_SLIDES, type Slide } from "@/lib/data";
import { scrollToSection } from "@/lib/scroll";
import { saveContent, uploadImage, useSiteContent } from "@/lib/content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const HOOK_LINES = [
  { text: "YOU DIDN'T FIND US.", serif: false },
  { text: "WE LET YOU.", serif: false },
  { text: "Everyone else is trying. We're just better.", serif: true },
];

function HeroPhotoEditor({ slides }: { slides: Slide[] }) {
  const { content, refresh } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Record<number, File>>({});
  const [saving, setSaving] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const save = async () => {
    setSaving(true);
    try {
      const uploaded: Record<string, string> = { ...(content.heroImages ?? {}) };
      for (const [i, f] of Object.entries(pending)) {
        uploaded[i] = await uploadImage(f);
      }
      await saveContent({ ...content, heroImages: uploaded });
      refresh();
      setPending({});
      setOpen(false);
      toast.success("Hero photos updated.");
    } catch {
      toast.error("Upload failed. Try smaller images.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.15em] text-white uppercase backdrop-blur-md transition-colors duration-300 hover:bg-white/25"
        data-testid="hero-edit-photos-button"
      >
        <Images size={12} /> Replace photos
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg" data-testid="hero-edit-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading tracking-tight">Replace hero photos</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#57534E]">Four slots in the slider. Pick a new photo for any of them.</p>
          <div className="grid max-h-[55vh] grid-cols-2 gap-4 overflow-y-auto pr-1">
            {slides.map((s, i) => (
              <div key={i} className="space-y-2">
                <img
                  src={pending[i] ? URL.createObjectURL(pending[i]) : s.src}
                  alt={s.tag}
                  className="h-24 w-full rounded-xl bg-[#F3EFE6] object-cover"
                />
                <input
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  data-testid={`hero-slide-input-${i}`}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setPending((p) => ({ ...p, [i]: f }));
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => inputs.current[i]?.click()}
                  data-testid={`hero-slide-choose-${i}`}
                >
                  {pending[i] ? "Photo selected" : `Slide ${i + 1}`}
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={save}
            disabled={saving || Object.keys(pending).length === 0}
            className="w-full"
            data-testid="hero-edit-save-button"
          >
            {saving ? <LoaderCircle size={14} className="animate-spin" /> : null} Save photos
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Hero() {
  const { content } = useSiteContent();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);

  const slides = HERO_SLIDES.map((s, i) => ({ ...s, src: content.heroImages?.[String(i)] ?? s.src }));

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5200);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const slide = slides[index];

  return (
    <section id="top" className="px-3 pt-20 sm:px-6" data-testid="hero-section">
      <div
        ref={ref}
        className="relative mx-auto h-[86vh] min-h-[560px] max-w-[1600px] overflow-hidden rounded-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div style={{ y }} className="absolute -top-[10%] inset-x-0 h-[120%]">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={slide.src}
              src={slide.src}
              alt={slide.title}
              initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
              data-testid="hero-slide-image"
            />
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

        <div className="absolute top-5 left-5 flex items-center gap-3 sm:top-7 sm:left-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-mono text-[11px] tracking-[0.2em] text-white uppercase backdrop-blur-md"
              data-testid="hero-slide-tag"
            >
              {slide.tag}
            </motion.div>
          </AnimatePresence>
          <span className="font-mono text-[11px] tracking-[0.2em] text-white/70">
            0{index + 1} / 0{slides.length}
          </span>
        </div>

        <div className="absolute top-5 right-5 sm:top-7 sm:right-7">
          <HeroPhotoEditor slides={slides} />
        </div>

        <div className="absolute right-5 bottom-5 flex items-center gap-2 sm:right-7 sm:bottom-7">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-500 ${i === index ? "w-8 bg-[#C6F24E]" : "w-3 bg-white/40 hover:bg-white/70"}`}
              data-testid={`hero-dot-${i}`}
            />
          ))}
          <button
            onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="ml-3 cursor-pointer rounded-full border border-white/25 bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/25"
            data-testid="hero-prev-button"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIndex((index + 1) % slides.length)}
            aria-label="Next slide"
            className="cursor-pointer rounded-full border border-white/25 bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/25"
            data-testid="hero-next-button"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="absolute bottom-5 left-5 max-w-xl rounded-3xl bg-[#FBF8F2] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.25)] sm:bottom-7 sm:left-7 sm:p-9">
          <h1 className="font-heading text-3xl leading-[1.02] font-bold tracking-tight text-[#121212] sm:text-5xl">
            {HOOK_LINES.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.35 + i * 0.16, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={`block ${line.serif ? "font-serif text-2xl font-normal italic text-[#143D2B] sm:text-4xl" : ""}`}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-4 text-sm leading-relaxed text-[#57534E] sm:text-base"
          >
            Strategy. Deals. Attention. Because that's just what happens when we're involved.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => scrollToSection("#contact")}
            className="group mt-6 flex cursor-pointer items-center gap-3 rounded-full bg-[#143D2B] px-7 py-3.5 font-mono text-xs tracking-[0.18em] text-[#FBF8F2] uppercase transition-colors duration-300 hover:bg-[#0F2E20]"
            data-testid="hero-cta-button"
          >
            Pull Up
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
