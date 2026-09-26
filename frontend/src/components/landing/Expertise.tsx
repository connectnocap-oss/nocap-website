import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { mergeServices, saveContent, useSiteContent, useText } from "@/lib/content";
import ImageEditDialog from "./ImageEditDialog";
import { cn } from "@/lib/utils";

export default function Expertise() {
  const [active, setActive] = useState(0);
  const { content, refresh, editMode } = useSiteContent();
  const t = useText();
  const services = mergeServices(content.services);

  const saveImage = async (i: number, url: string) => {
    await saveContent({ ...content, serviceImages: { ...(content.serviceImages ?? {}), [String(i)]: url } });
    refresh();
  };

  return (
    <section id="expertise" className="mx-auto max-w-[1600px] px-6 pt-10 pb-20 sm:px-10" data-testid="expertise-section">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-4xl leading-[0.95] font-bold tracking-tight uppercase sm:text-6xl"
        >
          {t("expertise.h1")} <span className="font-serif font-normal normal-case italic text-[#143D2B]">{t("expertise.accent")}</span>
        </motion.h2>
        <p className="max-w-sm text-sm leading-relaxed text-[#57534E]">{t("expertise.sub")}</p>
      </div>

      <div className="flex flex-col gap-3 lg:h-[580px] lg:flex-row">
        {services.map((service, i) => {
          const isActive = i === active;
          const imgSrc = content.serviceImages?.[String(i)] ?? service.image;
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActive(i);
                if (e.key === "ArrowRight") setActive((i + 1) % services.length);
                if (e.key === "ArrowLeft") setActive((i - 1 + services.length) % services.length);
              }}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-3xl outline-none transition-[flex-grow,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-[#143D2B]",
                isActive ? "bg-[#1E241E] text-[#FAFAF9] lg:flex-[4.4]" : "bg-[#EFECE6] text-[#292524] hover:bg-[#E7E2D8] lg:flex-1"
              )}
              data-testid={`expertise-panel-${i}`}
            >
              <div className="flex items-center gap-3 px-5 pt-5">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-70">Service</span>
                <span className="h-px flex-1 bg-current opacity-20" />
                <span className="font-mono text-[10px] tracking-[0.2em] opacity-70">
                  (0{i + 1})
                </span>
              </div>

              {isActive ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="px-5 pb-6"
                >
                  <div className="relative mt-4">
                    <img
                      src={imgSrc}
                      alt={service.title}
                      loading="lazy"
                      className="h-48 w-full rounded-2xl object-cover lg:h-56"
                    />
                    {editMode && (
                      <div className="absolute right-2 bottom-2">
                        <ImageEditDialog
                          title={`${service.title} — panel photo`}
                          current={imgSrc}
                          testId={`service-${i}-photo`}
                          onSaved={(url) => saveImage(i, url)}
                        />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#D6D3D1]">{service.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs text-[#FAFAF9]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToSection("#contact");
                    }}
                    className="group mt-5 flex cursor-pointer items-center gap-2 font-mono text-xs tracking-[0.18em] text-[#C6F24E] uppercase"
                    data-testid={`expertise-cta-${i}`}
                  >
                    Start a project
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="absolute inset-x-0 bottom-7 hidden justify-center lg:flex">
                    <span className="font-heading text-[26px] font-bold tracking-tight whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                      {service.title}
                    </span>
                  </div>
                  <div className="px-5 pt-3 pb-5 lg:hidden">
                    <span className="font-heading text-lg font-bold tracking-tight">{service.title}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
