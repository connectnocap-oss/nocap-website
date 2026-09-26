import { useRef, useState, type ReactNode } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#E7E2D8] bg-white p-6 sm:p-8">
      <h2 className="mb-6 font-heading text-xl font-bold tracking-tight uppercase">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

interface TxtProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  testId?: string;
}

export function Txt({ label, value, onChange, multiline, testId }: TxtProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-[#57534E]">{label}</Label>
      {multiline ? (
        <Textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} data-testid={testId} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} data-testid={testId} />
      )}
    </div>
  );
}

interface ImgFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  testId?: string;
  pos?: string;
  onPosChange?: (pos: string) => void;
}

const POS_GRID = ["0% 0%", "50% 0%", "100% 0%", "0% 50%", "50% 50%", "100% 50%", "0% 100%", "50% 100%", "100% 100%"];

export function ImgField({ label, value, onChange, testId, pos, onPosChange }: ImgFieldProps) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Uploaded — hit Save all changes to keep it.");
    } catch {
      toast.error("Upload failed. Log in again if your session expired.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-[#57534E]">{label}</Label>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt={label}
            style={{ objectPosition: pos ?? "50% 50%" }}
            className="h-12 w-16 rounded-lg bg-[#F3EFE6] object-cover"
          />
        ) : (
          <div className="h-12 w-16 rounded-lg bg-[#F3EFE6]" />
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          data-testid={testId ? `${testId}-input` : undefined}
          onChange={(e) => {
            void pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          data-testid={testId ? `${testId}-button` : undefined}
        >
          {busy ? <LoaderCircle size={13} className="animate-spin" /> : <ImagePlus size={13} />}
          {value ? "Replace" : "Upload"}
        </Button>
        {onPosChange && (
          <div className="flex items-center gap-2" title="Adjust which part of the picture shows">
            <span className="font-mono text-[10px] tracking-[0.1em] text-[#57534E] uppercase">Focus</span>
            <div className="grid grid-cols-3 gap-1" data-testid={testId ? `${testId}-pos` : undefined}>
              {POS_GRID.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-label={`Focus ${v}`}
                  onClick={() => onPosChange(v)}
                  className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-colors duration-200 ${
                    (pos ?? "50% 50%") === v ? "bg-[#143D2B] ring-2 ring-[#C6F24E]" : "bg-[#E7E2D8] hover:bg-[#C6F24E]"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
