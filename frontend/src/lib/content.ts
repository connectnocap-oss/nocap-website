import { createContext, useContext } from "react";
import { apiGet } from "@/lib/api";
import { CLIENT_RESULTS, RESULTS, SERVICES, STORY_STATS, TEXTS, type ClientResult, type ResultCard, type Service } from "@/lib/data";

export interface BrandLogoEntry {
  name: string;
  image?: string;
}

export interface ClientContent {
  client: string;
  sub: string;
  stats: [string, string][];
  tags: string[];
}

export interface ServiceContent {
  title: string;
  description: string;
  tags: string[];
}

export interface ResultContent {
  views: string;
  likes: string;
}

export interface SiteContent {
  texts?: Record<string, string>;
  heroImages?: Record<string, string>;
  clientImages?: Record<string, string>;
  serviceImages?: Record<string, string>;
  resultImages?: Record<string, string>;
  imagePos?: Record<string, string>;
  brandLogos?: BrandLogoEntry[];
  clients?: ClientContent[];
  services?: ServiceContent[];
  results?: ResultContent[];
  storyStats?: [string, string][];
  artImage?: string;
}

const TOKEN_KEY = "nocap-admin-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (t: string | null) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("nocap-auth-change"));
};

async function authedFetch(path: string, init: RequestInit): Promise<Response> {
  const isForm = init.body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  });
  if (res.status === 401) setToken(null);
  if (!res.ok) throw new Error(`request failed: ${res.status}`);
  return res;
}

export const fetchContent = async (): Promise<SiteContent> =>
  (await apiGet<{ data: SiteContent }>("/content")).data;

export const saveContent = async (data: SiteContent): Promise<void> => {
  await authedFetch("/content", { method: "PUT", body: JSON.stringify({ data }) });
};

export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await authedFetch("/uploads", { method: "POST", body: fd });
  return ((await res.json()) as { url: string }).url;
}

export const mergeClients = (c?: ClientContent[]): ClientResult[] =>
  CLIENT_RESULTS.map((d, i) => ({ ...d, ...(c?.[i] ?? {}) }));

export const mergeServices = (s?: ServiceContent[]): Service[] =>
  SERVICES.map((d, i) => ({ ...d, ...(s?.[i] ?? {}) }));

export const mergeStoryStats = (s?: [string, string][]): [string, string][] => s ?? STORY_STATS;

export const mergeResults = (r?: ResultContent[]): ResultCard[] =>
  RESULTS.map((d, i) => ({ ...d, ...(r?.[i] ?? {}) }));

export const ContentContext = createContext<{
  content: SiteContent;
  refresh: () => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}>({ content: {}, refresh: () => {}, editMode: false, setEditMode: () => {} });

export const useSiteContent = () => useContext(ContentContext);

export const useText = () => {
  const { content } = useSiteContent();
  return (key: string) => content.texts?.[key] ?? TEXTS[key] ?? key;
};
