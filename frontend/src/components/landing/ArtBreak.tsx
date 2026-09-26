import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { DEFAULT_ART } from "@/lib/data";
import { saveContent, useSiteContent, useText } from "@/lib/content";
import ImageEditDialog from "./ImageEditDialog";
import Starburst from "./Starburst";

export default function ArtBreak() {
  const { content, refresh, editMode } = useSiteContent();
  const t = useText();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-5%", reduce ? "0%" : "5%"]);
  const art = content.artImage ?? DEFAULT_ART;

  const saveArt = async (url: string) => {
    await saveContent({ ...content, artImage: url });
    refresh();
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0D0F0E] py-8 sm:py-12" data-testid="art-break">
      <motion.img
        src={art}
        alt="NOCAP creator collage"
        style={{ x, scale: 1.12, objectPosition: content.imagePos?.["art"] }}
        className="h-[46vh] w-full object-cover sm:h-[60vh]"
        data-testid="art-break-image"
      />
      <Starburst className="absolute -top-8 left-[6%] h-24 w-24 text-[#C6F24E] [animation:spin_26s_linear_infinite]" />
      <Starburst className="absolute -bottom-10 right-[8%] h-32 w-32 text-[#143D2B] [animation:spin_34s_linear_infinite_reverse]" />
      <div
        className="absolute bottom-6 left-6 rounded-full border border-white/25 bg-black/50 px-5 py-2 font-mono text-[11px] tracking-[0.25em] text-[#FBF8F2] uppercase backdrop-blur-md"
        data-testid="art-break-caption"
      >
        {t("art.caption")}
      </div>
      {editMode && (
        <div className="absolute top-6 right-6">
          <ImageEditDialog title="Art break banner" current={art} testId="art-break" onSaved={saveArt} />
        </div>
      )}
    </section>
  );
}
