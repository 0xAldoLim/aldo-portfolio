import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = new URL(path, siteConfig.url);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      locale: "en_MY",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
