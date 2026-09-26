import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { mergeClients, saveContent, useSiteContent, useText } from "@/lib/content";
import ImageEditDialog from "./ImageEditDialog";

export default function ClientsLead() {
  const { content, refresh, editMode } = useSiteContent();
  const t = useText();
  const clients = mergeClients(content.clients);

  const saveImage = async (i: number, url: string) => {
    await saveContent({ ...content, clientImages: { ...(content.clientImages ?? {}), [String(i)]: url } });
    refresh();
  };

  return (
    <section id="work" className="mx-auto max-w-[1600px] px-6 pt-10 pb-16 sm:px-10" data-testid="clients-lead-section">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="self-start lg:sticky lg:top-28">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl leading-[0.95] font-bold tracking-tight uppercase sm:text-6xl"
          >
            {t("clients.h1")}
            <br />
            {t("clients.h2")} <span className="font-serif font-normal normal-case italic text-[#143D2B]">{t("clients.accent")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-6 max-w-md text-sm leading-relaxed text-[#57534E] sm:text-base"
          >
            {t("clients.body")}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.25, duration: 0.7 }}
            onClick={() => scrollToSection("#expertise")}
            className="mt-8 flex cursor-pointer items-center gap-2 rounded-full bg-[#C6F24E] px-6 py-3 font-mono text-xs font-semibold tracking-[0.15em] text-[#0F172A] uppercase transition-transform duration-300 hover:scale-[1.03]"
            data-testid="clients-cta-button"
          >
            {t("clients.cta")} <Plus size={14} />
          </motion.button>
        </div>

        <div className="space-y-6">
          {clients.map((c, i) => {
            const imgSrc = content.clientImages?.[String(i)] ?? c.image;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col gap-6 rounded-3xl bg-[#F3EFE6] p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,61,43,0.10)] sm:flex-row sm:p-8"
                data-testid={`client-card-${i}`}
              >
                <div className="flex-1">
                  <p className="font-mono text-sm text-[#121212]">{c.client}</p>
                  <p className="mt-0.5 text-xs text-[#57534E]">{c.sub}</p>
                  <div className="mt-5 grid grid-cols-2 gap-6 border-t border-dashed border-[#121212]/20 pt-5">
                    {c.stats.map(([value, label]) => (
                      <div key={label}>
                        <p className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">{value}</p>
                        <p className="mt-2 max-w-[16ch] text-xs leading-snug text-[#57534E]">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-dashed border-[#121212]/20 pt-5">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#121212]/25 px-3.5 py-1.5 text-xs text-[#121212] transition-colors duration-300 group-hover:border-[#143D2B]/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative w-full sm:w-40 lg:w-48">
                  <img
                    src={imgSrc}
                    alt={c.client}
                    loading="lazy"
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                  {editMode && (
                    <div className="absolute right-2 bottom-2">
                      <ImageEditDialog
                        title={`${c.client} — card photo`}
                        current={imgSrc}
                        testId={`client-${i}-photo`}
                        onSaved={(url) => saveImage(i, url)}
                      />
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
