import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { SiInstagram } from "@icons-pack/react-simple-icons";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import type { Enquiry } from "@/lib/data";
import { scrollToSection } from "@/lib/scroll";
import { useText } from "@/lib/content";
import LogoMark from "./LogoMark";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const EMPTY = { name: "", email: "", brand: "", message: "" };

export default function Footer() {
  const t = useText();
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await apiPost<Enquiry>("/enquiries", { ...form, brand: form.brand || null });
      toast.success("Brief received. Expect a call within 24 hours — no cap.");
      setForm(EMPTY);
    } catch {
      toast.error("Couldn't send that. Try again in a moment.");
    } finally {
      setSending(false);
    }
  };

  const set = (key: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <footer id="contact" className="mt-4 rounded-t-[2.5rem] bg-[#0D0F0E] text-[#FBF8F2]" data-testid="footer-section">
      <div className="mx-auto max-w-[1600px] px-6 pt-24 sm:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="mb-5 font-mono text-xs tracking-[0.25em] text-[#C6F24E] uppercase"
            >
              {t("footer.eyebrow")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-5xl leading-[0.95] font-bold tracking-tight uppercase sm:text-7xl"
            >
              {t("footer.h1")}
              <br />
              <span className="font-serif font-normal normal-case italic text-[#C6F24E]">{t("footer.accent")}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mt-6 max-w-md text-sm leading-relaxed text-[#A1A1AA] sm:text-base"
            >
              {t("footer.body")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <button
                onClick={() => document.getElementById("contact-name")?.focus()}
                className="group flex cursor-pointer items-center gap-2.5 rounded-full bg-[#C6F24E] px-7 py-3.5 font-mono text-xs font-semibold tracking-[0.18em] text-[#0F172A] uppercase transition-transform duration-300 hover:scale-[1.03]"
                data-testid="footer-lets-talk-button"
              >
                {t("footer.ctaPrimary")}
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollToSection("#top")}
                className="cursor-pointer rounded-full border border-white/20 px-7 py-3.5 font-mono text-xs tracking-[0.18em] text-[#A1A1AA] uppercase transition-colors duration-300 hover:border-[#C6F24E] hover:text-[#C6F24E]"
                data-testid="footer-or-dont-button"
              >
                {t("footer.ctaSecondary")}
              </button>
            </motion.div>
            <div className="mt-10 space-y-2 font-mono text-xs tracking-[0.15em] text-[#A1A1AA] uppercase">
              <a
                href={`mailto:${t("footer.email")}`}
                className="block transition-colors duration-300 hover:text-[#C6F24E]"
                data-testid="footer-email"
              >
                {t("footer.email")}
              </a>
              <p>{t("footer.hubs")}</p>
            </div>
            <div className="mt-8 flex gap-3">
              <a
                href={t("social.instagram")}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-white/15 p-3 text-[#A1A1AA] transition-colors duration-300 hover:border-[#C6F24E] hover:text-[#C6F24E]"
                data-testid="footer-social-instagram"
              >
                <SiInstagram size={16} />
              </a>
              <a
                href={`mailto:${t("footer.email")}`}
                aria-label="Email"
                className="rounded-full border border-white/15 p-3 text-[#A1A1AA] transition-colors duration-300 hover:border-[#C6F24E] hover:text-[#C6F24E]"
                data-testid="footer-social-email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-9"
            data-testid="contact-form"
          >
            <p className="font-mono text-xs tracking-[0.25em] text-[#C6F24E] uppercase">Start something</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-xs text-[#A1A1AA]">Your name</Label>
                <Input
                  id="contact-name"
                  required
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Asha Kapoor"
                  className="border-white/15 bg-transparent text-[#FBF8F2] placeholder:text-[#A1A1AA]/50"
                  data-testid="contact-name-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-xs text-[#A1A1AA]">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="asha@brand.com"
                  className="border-white/15 bg-transparent text-[#FBF8F2] placeholder:text-[#A1A1AA]/50"
                  data-testid="contact-email-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-brand" className="text-xs text-[#A1A1AA]">Brand (optional)</Label>
              <Input
                id="contact-brand"
                value={form.brand}
                onChange={set("brand")}
                placeholder="Your brand's name"
                className="border-white/15 bg-transparent text-[#FBF8F2] placeholder:text-[#A1A1AA]/50"
                data-testid="contact-brand-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message" className="text-xs text-[#A1A1AA]">What are we solving?</Label>
              <Textarea
                id="contact-message"
                required
                rows={4}
                value={form.message}
                onChange={set("message")}
                placeholder="Launching in 3 cities, need the internet to care."
                className="border-white/15 bg-transparent text-[#FBF8F2] placeholder:text-[#A1A1AA]/50"
                data-testid="contact-message-input"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#C6F24E] py-4 font-mono text-xs font-semibold tracking-[0.2em] text-[#0F172A] uppercase transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
              data-testid="contact-submit-button"
            >
              {sending ? <LoaderCircle size={15} className="animate-spin" /> : <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />}
              {sending ? "Sending" : "Send the brief"}
            </button>
          </motion.form>
        </div>

        <div className="mt-16 overflow-hidden">
          <button
            onClick={() => scrollToSection("#top")}
            className="mx-auto block w-full max-w-sm cursor-pointer"
            aria-label="Back to top"
            data-testid="footer-wordmark"
          >
            <LogoMark color="#C6F24E" fill />
          </button>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 font-mono text-[11px] tracking-[0.15em] text-[#A1A1AA] uppercase sm:flex-row">
          <p>{t("footer.copyright")}</p>
          <div className="flex gap-6">
            {["Work", "Numbers", "Expertise"].map((label) => (
              <button
                key={label}
                onClick={() => scrollToSection(`#${label.toLowerCase()}`)}
                className="cursor-pointer transition-colors duration-300 hover:text-[#C6F24E]"
                data-testid={`footer-link-${label.toLowerCase()}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
