// Lead attribution + analytics helpers.
//
// First-touch attribution (landing page, referrer, UTM tags) is kept in sessionStorage
// and sent with an enquiry, so the admin inbox shows where each lead came from.
// track() forwards events to GA4 only if public/analytics.js loaded it (no-op otherwise).

const KEY = "nocap-attribution";

export interface LeadContext {
  page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const clip = (v: string | null | undefined, n: number) => (v ? v.slice(0, n) : undefined);

export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(KEY)) return; // keep the first touch of the visit
    const q = new URLSearchParams(location.search);
    const ref = document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer : undefined;
    const ctx: LeadContext = {
      page: clip(location.pathname, 200),
      referrer: clip(ref, 300),
      utm_source: clip(q.get("utm_source"), 100),
      utm_medium: clip(q.get("utm_medium"), 100),
      utm_campaign: clip(q.get("utm_campaign"), 100),
    };
    sessionStorage.setItem(KEY, JSON.stringify(ctx));
  } catch {
    /* storage blocked: attribution is optional */
  }
}

export function leadContext(): LeadContext {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}") as LeadContext;
  } catch {
    return {};
  }
}

type Gtag = (...args: unknown[]) => void;

export function track(event: string, params: Record<string, string | number | undefined> = {}): void {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}

export const WHATSAPP_NUMBER = "918826013867";
export const whatsappLink = (text = "Hi NoCap, I'd like to talk about a project.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const SERVICE_OPTIONS = [
  "Influencer marketing & sourcing",
  "Brand integration & partnerships",
  "Social media management",
  "Content production (shoots & edits)",
  "Events & activations",
  "Meta & ChatGPT ads",
  "Not sure yet",
];

export const BUDGET_OPTIONS = ["Under ₹1 lakh", "₹1–3 lakh", "₹3–10 lakh", "₹10 lakh+", "Not sure yet"];
