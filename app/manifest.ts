import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aldo Lim Saputra | Cybersecurity & CTF",
    short_name: "ALDO_",
    description: "Cybersecurity student, CTF player, and technical builder.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0D0E",
    theme_color: "#0A0D0E",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
