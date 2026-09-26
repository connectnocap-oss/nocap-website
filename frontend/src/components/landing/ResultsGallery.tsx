import { motion } from "motion/react";
import { Eye, Heart } from "lucide-react";
import { mergeResults, saveContent, useSiteContent, useText } from "@/lib/content";
import ImageEditDialog from "./ImageEditDialog";
import Starburst from "./Starburst";

const PLACEMENTS = [
  "left-[1%] top-[12%] w-28 sm:w-44 -rotate-6",
  "left-[21%] top-[40%] w-32 sm:w-52 rotate-3",
  "left-[42%] top-[2%] w-36 sm:w-60 -rotate-2 z-10",
  "left-[64%] top-[38%] w-32 sm:w-52 rotate-6",
  "right-[1%] top-[10%] w-28 sm:w-44 -rotate-3",
];

export default function ResultsGallery() {
  const { content, refresh, editMode } = useSiteContent();
  const t = useText();
  const results = mergeResults(content.results);

  const saveImage = async (i: number, url: string) => {
    await saveContent({ ...content, resultImages: { ...(content.resultImages ?? {}), [String(i)]: url } });
    refresh();
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10" data-testid="results-gallery">
      <div className="relative overflow-hidden rounded-3xl bg-[#EFECE6] px-6 py-14 sm:px-14">
        <Starburst className="absolute -top-10 -right-10 h-36 w-36 text-[#C6F24E] [animation:spin_30s_linear_infinite]" />
        <Starburst className="absolute -bottom-8 -left-8 h-24 w-24 text-[#143D2B]/20 [animation:spin_38s_linear_infinite_reverse]" />
        <div className="relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl font-bold tracking-tight uppercase sm:text-6xl"
          >
            {t("results.h1")}{" "}
            <span className="font-serif font-normal normal-case italic text-[#143D2B]">{t("results.accent")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#57534E]"
          >
            {t("results.sub")}
          </motion.p>
        </div>

        <div className="relative mt-12 h-[400px] sm:h-[560px]">
          {results.map((r, i) => {
            const img = content.resultImages?.[String(i)] ?? r.image;
            return (
              <motion.div
                key={i}
                className={`absolute ${PLACEMENTS[i]}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.06, rotate: 0, zIndex: 30 }}
                data-testid={`result-card-${i}`}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className="relative overflow-hidden rounded-2xl bg-black shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
                >
                  <img
                    src={img}
                    alt={`Reel result ${i + 1}`}
                    loading="lazy"
                    style={{ objectPosition: content.imagePos?.[`results.${i}`] }}
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
                    <Eye size={11} /> {r.views}
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
                    <Heart size={11} /> {r.likes}
                  </div>
                  {editMode && (
                    <div className="absolute top-2 right-2">
                      <ImageEditDialog
                        title={`Result card ${i + 1}`}
                        current={img}
                        testId={`result-${i}`}
                        onSaved={(url) => saveImage(i, url)}
                      />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
