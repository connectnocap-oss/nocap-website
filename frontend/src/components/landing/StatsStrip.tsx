import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "motion/react";
import { STRIP_STATS, type StripStat } from "@/lib/data";

function CountUp({ stat }: { stat: StripStat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, stat.value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${stat.prefix ?? ""}${Math.round(v)}${stat.suffix ?? ""}`;
      },
    });
    return () => controls.stop();
  }, [inView, stat]);

  return (
    <span ref={ref} className="font-heading text-5xl font-bold tracking-tight sm:text-6xl">
      {stat.prefix ?? ""}0{stat.suffix ?? ""}
    </span>
  );
}

export default function StatsStrip() {
  return (
    <section id="numbers" className="border-y border-[#E7E2D8]" data-testid="stats-strip">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STRIP_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="border-[#E7E2D8] px-8 py-14 sm:px-10 lg:border-l lg:first:border-l-0"
            data-testid={`strip-stat-${i}`}
          >
            <CountUp stat={stat} />
            <p className="mt-3 text-sm text-[#57534E]">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
