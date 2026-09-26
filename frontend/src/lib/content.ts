import { createContext, useContext } from "react";
import { apiGet, apiPut } from "@/lib/api";

export interface BrandLogoEntry {
  name: string;
  image?: string;
}

export interface SiteContent {
  heroImages?: Record<string, string>;
  clientImages?: Record<string, string>;
  serviceImages?: Record<string, string>;
  brandLogos?: BrandLogoEntry[];
}

interface ContentResponse {
  data: SiteContent;
}

export const fetchContent = async (): Promise<SiteContent> =>
  (await apiGet<ContentResponse>("/content")).data;

export const saveContent = async (data: SiteContent): Promise<void> => {
  await apiPut("/content", { data });
};

export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body: fd });
  if (!res.ok) throw new Error(`upload failed with ${res.status}`);
  return (await res.json()).url as string;
}

export const ContentContext = createContext<{ content: SiteContent; refresh: () => void }>({
  content: {},
  refresh: () => {},
});

export const useSiteContent = () => useContext(ContentContext);
