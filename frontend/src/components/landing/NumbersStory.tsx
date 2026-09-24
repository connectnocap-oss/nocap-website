import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { STORY_STATS } from "@/lib/data";
import { scrollToSection } from "@/lib/scroll";

export default function NumbersStory() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10" data-testid="numbers-story-section">
      <div className="grid gap-14 rounded-3xl bg-[#F3EFE6] p-8 sm:p-14 lg:grid-cols-[1.1fr_1.6fr] lg:gap-20">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mb-6 font-mono text-xs tracking-[0.25em] text-[#57534E] uppercase"
          >
            The work speaks.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl leading-[1.05] tracking-tight text-[#121212] sm:text-5xl"
          >
            Numbers mean more when they <em className="text-[#143D2B]">tell a story.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 max-w-sm text-sm leading-relaxed text-[#57534E]"
          >
            Here's what happens when the right idea meets the right execution.
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.3, duration: 0.7 }}
            onClick={() => scrollToSection("#contact")}
            className="mt-8 flex cursor-pointer items-center gap-2 font-mono text-xs tracking-[0.2em] text-[#143D2B] uppercase underline-offset-4 hover:underline"
            data-testid="numbers-story-cta"
          >
            Not just numbers <ArrowUpRight size={14} />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#E7E2D8] sm:grid-cols-3">
          {STORY_STATS.map(([value, label], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between bg-[#FBF8F2] p-6 sm:p-7"
              data-testid={`story-stat-${i}`}
            >
              <p className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{value}</p>
              <p className="mt-6 text-xs leading-snug text-[#57534E]">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
