import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, LoaderCircle, Lock, LogOut } from "lucide-react";
import { apiPost } from "@/lib/api";
import {
  saveContent,
  setToken,
  useSiteContent,
  type SiteContent,
} from "@/lib/content";
import { CLIENT_RESULTS, DEFAULT_ART, DEFAULT_BRANDS, HERO_SLIDES, RESULTS, SERVICES, STORY_STATS, TEXTS } from "@/lib/data";
import LogoMark from "@/components/landing/LogoMark";
import { ImgField, Section, Txt } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function buildDraft(c: SiteContent): SiteContent {
  return {
    texts: { ...TEXTS, ...(c.texts ?? {}) },
    heroImages: { ...(c.heroImages ?? {}) },
    clientImages: { ...(c.clientImages ?? {}) },
    serviceImages: { ...(c.serviceImages ?? {}) },
    resultImages: { ...(c.resultImages ?? {}) },
    imagePos: { ...(c.imagePos ?? {}) },
    brandLogos: DEFAULT_BRANDS.map((b, i) => {
      const o = c.brandLogos?.[i];
      return { name: o?.name ?? b.name, ...(o?.image ? { image: o.image } : {}) };
    }),
    clients: CLIENT_RESULTS.map((d, i) => ({
      client: c.clients?.[i]?.client ?? d.client,
      sub: c.clients?.[i]?.sub ?? d.sub,
      stats: c.clients?.[i]?.stats ?? d.stats,
      tags: c.clients?.[i]?.tags ?? d.tags,
    })),
    services: SERVICES.map((d, i) => ({
      title: c.services?.[i]?.title ?? d.title,
      description: c.services?.[i]?.description ?? d.description,
      tags: c.services?.[i]?.tags ?? d.tags,
    })),
    results: RESULTS.map((d, i) => ({
      views: c.results?.[i]?.views ?? d.views,
      likes: c.results?.[i]?.likes ?? d.likes,
    })),
    storyStats: (c.storyStats ?? STORY_STATS).map((s) => [...s] as [string, string]),
    artImage: c.artImage,
  };
}

const TEXT_GROUPS: { title: string; fields: [string, string, boolean?][] }[] = [
  {
    title: "Hero",
    fields: [
      ["hero.line1", "Headline — line 1"],
      ["hero.line2", "Headline — line 2"],
      ["hero.line3", "Italic serif line"],
      ["hero.sub", "Subtext", true],
      ["hero.cta", "Hero button label"],
      ["nav.cta", "Nav button label"],
    ],
  },
  {
    title: "Ticker & brand wall",
    fields: [
      ["marquee.words", "Ticker words (comma separated)", true],
      ["logos.heading", "Brand wall heading"],
    ],
  },
  {
    title: "Clients section",
    fields: [
      ["clients.h1", "Heading — line 1"],
      ["clients.h2", "Heading — line 2"],
      ["clients.accent", "Italic accent word"],
      ["clients.body", "Intro text", true],
      ["clients.cta", "Button label"],
    ],
  },
  {
    title: "Process block",
    fields: [
      ["process.eyebrow", "Eyebrow"],
      ["process.h1", "Heading"],
      ["process.accent", "Italic accent"],
      ["process.week1", "Week 1", true],
      ["process.week2", "Week 2", true],
      ["process.week3", "Week 3", true],
      ["process.week4", "Week 4", true],
    ],
  },
  {
    title: "The work speaks",
    fields: [
      ["work.eyebrow", "Eyebrow"],
      ["work.h1", "Heading"],
      ["work.accent", "Italic accent"],
      ["work.body", "Body text", true],
      ["work.cta", "Link label"],
    ],
  },
  {
    title: "Results gallery",
    fields: [
      ["results.h1", "Heading"],
      ["results.accent", "Italic accent"],
      ["results.sub", "Subtext", true],
    ],
  },
  { title: "Art break", fields: [["art.caption", "Caption chip"]] },
  {
    title: "Expertise intro",
    fields: [
      ["expertise.h1", "Heading"],
      ["expertise.accent", "Italic accent"],
      ["expertise.sub", "Intro text", true],
    ],
  },
  {
    title: "Footer & socials",
    fields: [
      ["footer.eyebrow", "Eyebrow"],
      ["footer.h1", "Heading"],
      ["footer.accent", "Italic accent"],
      ["footer.body", "Body text", true],
      ["footer.ctaPrimary", "Primary button"],
      ["footer.ctaSecondary", "Secondary button"],
      ["footer.email", "Contact email"],
      ["footer.hubs", "Cities line"],
      ["footer.copyright", "Copyright line"],
      ["social.instagram", "Instagram URL"],
    ],
  },
];

export default function Admin() {
  const { content, refresh, editMode } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(buildDraft(content));
  }, [content]);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await apiPost<{ token: string }>("/auth/login", { password });
      setToken(res.token);
      toast.success("Welcome back, owner.");
    } catch {
      toast.error("Wrong password — or too many attempts. Wait a few minutes.");
    } finally {
      setBusy(false);
    }
  };

  if (!editMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBF8F2] px-6">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-3xl border border-[#E7E2D8] bg-white p-8"
          data-testid="admin-login-form"
        >
          <LogoMark height={28} />
          <h1 className="mt-6 font-heading text-2xl font-bold tracking-tight">Owner access</h1>
          <p className="mt-1 text-sm text-[#57534E]">
            One password. Full control of every word and picture on the site.
          </p>
          <div className="mt-6 space-y-2">
            <Label htmlFor="admin-password">Owner password</Label>
            <Input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-password-input"
            />
          </div>
          <Button type="submit" className="mt-6 w-full" disabled={busy} data-testid="admin-login-button">
            {busy ? <LoaderCircle size={14} className="animate-spin" /> : <Lock size={14} />} Unlock
          </Button>
          <Link
            to="/"
            className="mt-4 block text-center font-mono text-[11px] tracking-[0.15em] text-[#57534E] uppercase transition-colors hover:text-[#121212]"
            data-testid="admin-back-link"
          >
            ← Back to site
          </Link>
        </form>
      </div>
    );
  }

  if (!draft) return null;

  const setText = (k: string, v: string) =>
    setDraft((d) => d && { ...d, texts: { ...(d.texts ?? {}), [k]: v } });

  const setPos = (k: string, v: string) =>
    setDraft((d) => d && { ...d, imagePos: { ...(d.imagePos ?? {}), [k]: v } });

  const save = async () => {
    setSaving(true);
    try {
      await saveContent(draft);
      refresh();
      toast.success("All changes saved. Live on the site now.");
    } catch {
      toast.error("Save failed — your session may have expired. Log in again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F2] pb-32 text-[#121212]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#FBF8F2]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <LogoMark height={22} />
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#57534E] uppercase">Admin panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E7E2D8] bg-transparent px-4 text-sm font-medium transition-colors hover:bg-[#F3EFE6]"
              data-testid="admin-view-site"
            >
              <Eye size={13} /> View site
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setToken(null);
                toast.success("Logged out.");
              }}
              data-testid="admin-logout-button"
            >
              <LogOut size={13} /> Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10" data-testid="admin-panel">
        <p className="text-sm text-[#57534E]">
          Edit anything below, upload images, adjust the focus dots to crop each picture, then hit{" "}
          <strong>Save all changes</strong> — the public site updates instantly.
        </p>

        {TEXT_GROUPS.map((g) => (
          <Section key={g.title} title={g.title}>
            {g.fields.map(([key, label, multiline]) => (
              <Txt
                key={key}
                label={label}
                multiline={multiline}
                value={draft.texts?.[key] ?? ""}
                onChange={(v) => setText(key, v)}
                testId={`admin-text-${key}`}
              />
            ))}
          </Section>
        ))}

        <Section title="Hero photos (4)">
          <div className="grid gap-4 sm:grid-cols-2">
            {HERO_SLIDES.map((s, i) => (
              <ImgField
                key={i}
                label={`Slide ${i + 1}`}
                value={draft.heroImages?.[String(i)] ?? s.src}
                onChange={(u) =>
                  setDraft((d) => d && { ...d, heroImages: { ...(d.heroImages ?? {}), [String(i)]: u } })
                }
                pos={draft.imagePos?.[`hero.${i}`]}
                onPosChange={(p) => setPos(`hero.${i}`, p)}
                testId={`admin-hero-${i}`}
              />
            ))}
          </div>
        </Section>

        <Section title="Brand wall logos (14)">
          <div className="grid gap-4 sm:grid-cols-2">
            {(draft.brandLogos ?? []).map((b, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-[#E7E2D8] p-4">
                <Txt
                  label={`Slot ${i + 1} — name`}
                  value={b.name}
                  onChange={(v) =>
                    setDraft((d) => d && { ...d, brandLogos: (d.brandLogos ?? []).map((x, j) => (j === i ? { ...x, name: v } : x)) })
                  }
                  testId={`admin-logo-name-${i}`}
                />
                <ImgField
                  label="Logo image (optional)"
                  value={b.image}
                  onChange={(u) =>
                    setDraft((d) => d && { ...d, brandLogos: (d.brandLogos ?? []).map((x, j) => (j === i ? { ...x, image: u } : x)) })
                  }
                  testId={`admin-logo-img-${i}`}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Client case cards (3)">
          {(draft.clients ?? []).map((c, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-[#E7E2D8] p-4">
              <Txt
                label="Client name"
                value={c.client}
                onChange={(v) => setDraft((d) => d && { ...d, clients: (d.clients ?? []).map((x, j) => (j === i ? { ...x, client: v } : x)) })}
                testId={`admin-client-name-${i}`}
              />
              <Txt
                label="Subtitle"
                value={c.sub}
                onChange={(v) => setDraft((d) => d && { ...d, clients: (d.clients ?? []).map((x, j) => (j === i ? { ...x, sub: v } : x)) })}
              />
              <div className="grid grid-cols-2 gap-3">
                {[0, 1].map((si) => (
                  <div key={si} className="contents">
                    <Txt
                      label={`Stat ${si + 1} value`}
                      value={c.stats[si]?.[0] ?? ""}
                      onChange={(v) =>
                        setDraft((d) =>
                          d && {
                            ...d,
                            clients: (d.clients ?? []).map((x, j) =>
                              j === i
                                ? { ...x, stats: x.stats.map((s, k) => (k === si ? [v, s[1]] : s)) as [string, string][] }
                                : x
                            ),
                          }
                        )
                      }
                    />
                    <Txt
                      label={`Stat ${si + 1} label`}
                      value={c.stats[si]?.[1] ?? ""}
                      onChange={(v) =>
                        setDraft((d) =>
                          d && {
                            ...d,
                            clients: (d.clients ?? []).map((x, j) =>
                              j === i
                                ? { ...x, stats: x.stats.map((s, k) => (k === si ? [s[0], v] : s)) as [string, string][] }
                                : x
                            ),
                          }
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <Txt
                label="Tags (comma separated)"
                value={c.tags.join(", ")}
                onChange={(v) =>
                  setDraft((d) => d && { ...d, clients: (d.clients ?? []).map((x, j) => (j === i ? { ...x, tags: v.split(",").map((s) => s.trim()).filter(Boolean) } : x)) })
                }
              />
              <ImgField
                label="Card photo"
                value={draft.clientImages?.[String(i)] ?? CLIENT_RESULTS[i].image}
                onChange={(u) =>
                  setDraft((d) => d && { ...d, clientImages: { ...(d.clientImages ?? {}), [String(i)]: u } })
                }
                pos={draft.imagePos?.[`client.${i}`]}
                onPosChange={(p) => setPos(`client.${i}`, p)}
                testId={`admin-client-img-${i}`}
              />
            </div>
          ))}
        </Section>

        <Section title="Work speaks — stats (6)">
          <div className="grid gap-3 sm:grid-cols-2">
            {(draft.storyStats ?? []).map(([value, label], i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr] items-end gap-3">
                <Txt
                  label={`Stat ${i + 1} value`}
                  value={value}
                  onChange={(v) =>
                    setDraft((d) => d && { ...d, storyStats: (d.storyStats ?? []).map((s, j) => (j === i ? [v, s[1]] : s)) as [string, string][] })
                  }
                />
                <Txt
                  label="Label"
                  value={label}
                  onChange={(v) =>
                    setDraft((d) => d && { ...d, storyStats: (d.storyStats ?? []).map((s, j) => (j === i ? [s[0], v] : s)) as [string, string][] })
                  }
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Results gallery cards (5)">
          <div className="grid gap-4 sm:grid-cols-2">
            {(draft.results ?? []).map((r, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-[#E7E2D8] p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Txt
                    label="Views"
                    value={r.views}
                    onChange={(v) =>
                      setDraft((d) => d && { ...d, results: (d.results ?? []).map((x, j) => (j === i ? { ...x, views: v } : x)) })
                    }
                    testId={`admin-result-views-${i}`}
                  />
                  <Txt
                    label="Likes"
                    value={r.likes}
                    onChange={(v) =>
                      setDraft((d) => d && { ...d, results: (d.results ?? []).map((x, j) => (j === i ? { ...x, likes: v } : x)) })
                    }
                  />
                </div>
                <ImgField
                  label="Reel thumbnail"
                  value={draft.resultImages?.[String(i)] ?? RESULTS[i].image}
                  onChange={(u) =>
                    setDraft((d) => d && { ...d, resultImages: { ...(d.resultImages ?? {}), [String(i)]: u } })
                  }
                  pos={draft.imagePos?.[`results.${i}`]}
                  onPosChange={(p) => setPos(`results.${i}`, p)}
                  testId={`admin-result-img-${i}`}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Art break banner">
          <ImgField
            label="Banner artwork"
            value={draft.artImage ?? DEFAULT_ART}
            onChange={(u) => setDraft((d) => d && { ...d, artImage: u })}
            pos={draft.imagePos?.["art"]}
            onPosChange={(p) => setPos("art", p)}
            testId="admin-art"
          />
        </Section>

        <Section title="Expertise panels (7)">
          {(draft.services ?? []).map((s, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-[#E7E2D8] p-4">
              <Txt
                label="Title"
                value={s.title}
                onChange={(v) => setDraft((d) => d && { ...d, services: (d.services ?? []).map((x, j) => (j === i ? { ...x, title: v } : x)) })}
                testId={`admin-service-title-${i}`}
              />
              <Txt
                label="Description"
                multiline
                value={s.description}
                onChange={(v) => setDraft((d) => d && { ...d, services: (d.services ?? []).map((x, j) => (j === i ? { ...x, description: v } : x)) })}
              />
              <Txt
                label="Tags (comma separated)"
                value={s.tags.join(", ")}
                onChange={(v) =>
                  setDraft((d) => d && { ...d, services: (d.services ?? []).map((x, j) => (j === i ? { ...x, tags: v.split(",").map((t2) => t2.trim()).filter(Boolean) } : x)) })
                }
              />
              <ImgField
                label="Panel photo"
                value={draft.serviceImages?.[String(i)] ?? SERVICES[i].image}
                onChange={(u) =>
                  setDraft((d) => d && { ...d, serviceImages: { ...(d.serviceImages ?? {}), [String(i)]: u } })
                }
                pos={draft.imagePos?.[`service.${i}`]}
                onPosChange={(p) => setPos(`service.${i}`, p)}
                testId={`admin-service-img-${i}`}
              />
            </div>
          ))}
        </Section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E7E2D8] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="font-mono text-[11px] tracking-[0.15em] text-[#57534E] uppercase">Edits go live only after save</p>
          <Button onClick={save} disabled={saving} data-testid="admin-save-button">
            {saving ? <LoaderCircle size={14} className="animate-spin" /> : null} Save all changes
          </Button>
        </div>
      </div>
    </div>
  );
}
