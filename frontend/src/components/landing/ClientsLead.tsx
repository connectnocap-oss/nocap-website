import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { CLIENT_RESULTS } from "@/lib/data";
import { scrollToSection } from "@/lib/scroll";

export default function ClientsLead() {
  return (
    <section id="work" className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10" data-testid="clients-lead-section">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="self-start lg:sticky lg:top-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mb-5 font-mono text-xs tracking-[0.25em] text-[#143D2B] uppercase"
          >
            Selected outcomes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl leading-[0.95] font-bold tracking-tight uppercase sm:text-6xl"
          >
            Our clients
            <br />
            in the <span className="font-serif font-normal normal-case italic text-[#143D2B]">lead.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-6 max-w-md text-sm leading-relaxed text-[#57534E] sm:text-base"
          >
            Case studies from the brands we've built — each one engineered to pull attention,
            convert it, and keep it.
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
            See how we do it <Plus size={14} />
          </motion.button>
        </div>

        <div className="space-y-6">
          {CLIENT_RESULTS.map((c, i) => (
            <motion.article
              key={c.client}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col gap-6 rounded-3xl bg-[#F3EFE6] p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,61,43,0.10)] sm:flex-row sm:p-8"
              data-testid={`client-card-${i}`}
            >
              <div className="flex-1">
                <p className="font-mono text-sm text-[#57534E]">{c.client}</p>
                <div className="mt-5 grid grid-cols-2 gap-6 border-t border-dashed border-[#121212]/20 pt-5">
                  {c.stats.map(([value, label]) => (
                    <div key={label}>
                      <p className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">{value}</p>
                      <p className="mt-2 max-w-[16ch] text-xs leading-snug text-[#57534E]">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-dashed border-[#121212]/20 pt-5">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#121212]/25 px-3.5 py-1.5 text-xs text-[#121212] transition-colors duration-300 group-hover:border-[#143D2B]/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <img
                src={c.image}
                alt={c.client}
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover sm:w-40 lg:w-48"
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
