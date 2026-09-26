import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ImagePlus, LoaderCircle, Pencil, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_BRANDS, type Brand } from "@/lib/data";
import { saveContent, uploadImage, useSiteContent, useText, type BrandLogoEntry } from "@/lib/content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DraftSlot {
  name: string;
  image?: string;
  file?: File;
}

export default function LogoWall() {
  const { content, refresh, editMode } = useSiteContent();
  const t = useText();
  const brands: (Brand & { image?: string })[] = DEFAULT_BRANDS.map((b, i) => {
    const override = content.brandLogos?.[i];
    return { ...b, name: override?.name || b.name, image: override?.image };
  });
  const [draft, setDraft] = useState<DraftSlot[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const openEditor = () => {
    setDraft(brands.map((b) => ({ name: b.name, image: b.image })));
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const entries: BrandLogoEntry[] = [];
      for (const slot of draft) {
        const image = slot.file ? await uploadImage(slot.file) : slot.image;
        entries.push({
          name: slot.name.trim() || DEFAULT_BRANDS[entries.length].name,
          ...(image ? { image } : {}),
        });
      }
      await saveContent({ ...content, brandLogos: entries });
      refresh();
      setOpen(false);
      toast.success("Logo wall updated.");
    } catch {
      toast.error("Couldn't save. Log in via /admin first.");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    try {
      await saveContent({ ...content, brandLogos: DEFAULT_BRANDS.map((b) => ({ name: b.name })) });
      refresh();
      setDraft(DEFAULT_BRANDS.map((b) => ({ name: b.name })));
      toast.success("Back to the original lineup.");
    } catch {
      toast.error("Couldn't reset right now.");
    }
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 pt-16 pb-10 sm:px-10" data-testid="brand-logo-wall">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-xs tracking-[0.25em] text-[#57534E] uppercase"
        >
          {t("logos.heading")}
        </motion.p>
        {editMode && (
          <button
            onClick={openEditor}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-[#143D2B]/25 px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-[#143D2B] uppercase transition-colors duration-300 hover:bg-[#143D2B] hover:text-[#FBF8F2]"
            data-testid="logo-wall-edit-button"
          >
            <Pencil size={12} /> Replace logos
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {brands.map((brand, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 7) * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-16 items-center justify-center text-center text-[#121212] opacity-80 transition-opacity duration-300 hover:opacity-100"
            data-testid={`brand-slot-${i}`}
          >
            {brand.image ? (
              <img src={brand.image} alt={brand.name} className="max-h-16 w-auto max-w-full object-contain" />
            ) : (
              <span className={brand.className}>{brand.name}</span>
            )}
          </motion.div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl" data-testid="logo-wall-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading tracking-tight">Replace brand logos</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#57534E]">
            Fourteen slots. Type a name, or upload a real logo image — saved permanently for every visitor.
          </p>
          <div className="grid max-h-[50vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
            {draft.map((slot, i) => (
              <div key={i} className="space-y-2 rounded-2xl border border-[#E7E2D8] p-3">
                <Label htmlFor={`logo-${i}`} className="font-mono text-[10px] tracking-[0.15em] uppercase">
                  Slot {String(i + 1).padStart(2, "0")}
                </Label>
                <div className="flex h-12 items-center justify-center rounded-lg bg-[#F3EFE6] px-2">
                  {slot.file ? (
                    <img src={URL.createObjectURL(slot.file)} alt="New logo" className="max-h-10 object-contain" />
                  ) : slot.image ? (
                    <img src={slot.image} alt={slot.name} className="max-h-10 object-contain" />
                  ) : (
                    <span className="max-w-full truncate text-xs text-[#57534E]">{slot.name}</span>
                  )}
                </div>
                <Input
                  id={`logo-${i}`}
                  value={slot.name}
                  placeholder={DEFAULT_BRANDS[i].name}
                  onChange={(e) => setDraft((d) => d.map((v, j) => (j === i ? { ...v, name: e.target.value } : v)))}
                  data-testid={`logo-input-${i}`}
                />
                <input
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  data-testid={`logo-file-${i}`}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setDraft((d) => d.map((v, j) => (j === i ? { ...v, file: f } : v)));
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => inputs.current[i]?.click()}
                  data-testid={`logo-choose-${i}`}
                >
                  <ImagePlus size={13} /> {slot.file ? "Logo selected" : slot.image ? "Swap image" : "Upload logo image"}
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button variant="ghost" onClick={reset} data-testid="logo-wall-reset-button">
              <RotateCcw size={14} /> Reset
            </Button>
            <Button onClick={save} disabled={saving} data-testid="logo-wall-save-button">
              {saving ? <LoaderCircle size={14} className="animate-spin" /> : null} Save lineup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
