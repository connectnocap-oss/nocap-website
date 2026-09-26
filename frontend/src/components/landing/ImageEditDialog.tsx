import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  current: string;
  onSaved: (url: string) => Promise<void> | void;
  testId: string;
}

export default function ImageEditDialog({ title, current, onSaved, testId }: Props) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const save = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const url = await uploadImage(file);
      await onSaved(url);
      toast.success("Photo updated.");
      setOpen(false);
      setFile(null);
    } catch {
      toast.error("Upload failed. Try a smaller image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#121212]/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-white uppercase backdrop-blur-sm transition-colors duration-300 hover:bg-[#143D2B]"
        data-testid={`${testId}-edit-button`}
        aria-label={`Replace photo: ${title}`}
      >
        <ImagePlus size={12} /> Replace
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md" data-testid={`${testId}-dialog`}>
          <DialogHeader>
            <DialogTitle className="font-heading tracking-tight">{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={file ? URL.createObjectURL(file) : current}
              alt={title}
              className="h-44 w-full rounded-2xl bg-[#F3EFE6] object-cover"
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              data-testid={`${testId}-file-input`}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => inputRef.current?.click()}
              data-testid={`${testId}-choose-button`}
            >
              <ImagePlus size={14} /> {file ? file.name : "Choose a photo"}
            </Button>
            <Button className="w-full" disabled={!file || saving} onClick={save} data-testid={`${testId}-save-button`}>
              {saving ? <LoaderCircle size={14} className="animate-spin" /> : null} Save photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
