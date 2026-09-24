import { useState } from "react";
import { motion } from "motion/react";
import { Pencil, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_BRANDS, type Brand } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "nocap-brand-names";

function loadBrands(): Brand[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as string[] | null;
    if (Array.isArray(saved) && saved.length === DEFAULT_BRANDS.length) {
      return DEFAULT_BRANDS.map((b, i) => ({ ...b, name: saved[i] || b.name }));
    }
  } catch {
    /* fall through to defaults */
  }
  return DEFAULT_BRANDS;
}

export default function LogoWall() {
  const [brands, setBrands] = useState<Brand[]>(loadBrands);
  const [draft, setDraft] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const save = () => {
    const next = DEFAULT_BRANDS.map((b, i) => ({ ...b, name: draft[i]?.trim() || b.name }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.map((b) => b.name)));
    setBrands(next);
    setOpen(false);
    toast.success("Logo wall updated.");
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBrands(DEFAULT_BRANDS);
    setDraft(DEFAULT_BRANDS.map((b) => b.name));
    toast.success("Back to the original lineup.");
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-20 sm:px-10" data-testid="brand-logo-wall">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-xs tracking-[0.25em] text-[#57534E] uppercase"
        >
          Some brands we've had fun with.
        </motion.p>
        <button
          onClick={() => {
            setDraft(brands.map((b) => b.name));
            setOpen(true);
          }}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-[#143D2B]/25 px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-[#143D2B] uppercase transition-colors duration-300 hover:bg-[#143D2B] hover:text-[#FBF8F2]"
          data-testid="logo-wall-edit-button"
        >
          <Pencil size={12} /> Replace logos
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {brands.map((brand, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 7) * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-12 items-center justify-center text-center text-[#121212] opacity-80 transition-opacity duration-300 hover:opacity-100"
            data-testid={`brand-slot-${i}`}
          >
            <span className={brand.className}>{brand.name}</span>
          </motion.div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl" data-testid="logo-wall-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading tracking-tight">Replace brand logos</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#57534E]">
            Fourteen slots. Swap any name for your own client — saved on this device.
          </p>
          <div className="grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {DEFAULT_BRANDS.map((b, i) => (
              <div key={i} className="space-y-1.5">
                <Label htmlFor={`logo-${i}`} className="font-mono text-[10px] tracking-[0.15em] uppercase">
                  Slot {String(i + 1).padStart(2, "0")}
                </Label>
                <Input
                  id={`logo-${i}`}
                  value={draft[i] ?? ""}
                  placeholder={b.name}
                  onChange={(e) => setDraft((d) => d.map((v, j) => (j === i ? e.target.value : v)))}
                  data-testid={`logo-input-${i}`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button variant="ghost" onClick={reset} data-testid="logo-wall-reset-button">
              <RotateCcw size={14} /> Reset
            </Button>
            <Button onClick={save} data-testid="logo-wall-save-button">
              Save lineup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
