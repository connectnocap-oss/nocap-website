import { motion } from "motion/react";

const WEEKS: [string, string][] = [
  ["Week 1", "We look at your numbers. I'm gonna be honest, they're not good."],
  ["Week 2", "Doesn't matter. We already fixed it."],
  ["Week 3", "The brands start calling you instead of the other way around."],
  ["Week 4", "You're thanking us. We're already onto the next thing."],
];

export default function Process() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-10" data-testid="process-section">
      <div className="rounded-3xl bg-[#143D2B] p-8 text-[#FBF8F2] sm:p-14">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-5 font-mono text-xs tracking-[0.25em] text-[#C6F24E] uppercase"
        >
          Our social media process
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 font-heading text-4xl leading-[0.98] font-bold tracking-tight uppercase sm:text-5xl"
        >
          From audit <span className="font-serif font-normal normal-case italic text-[#C6F24E]">to reporting.</span>
        </motion.h2>
        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {WEEKS.map(([week, text], i) => (
            <motion.div
              key={week}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-[#143D2B] p-7 transition-colors duration-500 hover:bg-[#1A4A35]"
              data-testid={`process-week-${i}`}
            >
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[11px] tracking-[0.25em] text-[#C6F24E] uppercase">{week}</p>
                <span className="font-heading text-3xl font-bold text-white/10 transition-colors duration-500 group-hover:text-[#C6F24E]/30">
                  0{i + 1}
                </span>
              </div>
              <p className="mt-8 text-lg leading-snug font-medium">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
