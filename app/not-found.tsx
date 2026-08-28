import Link from "next/link";
import { OpenPaletteButton } from "@/components/navigation/open-palette-button";

export default function NotFound() {
  return (
    <section className="not-found"><div className="not-found-panel"><p className="eyebrow">ROUTING ERROR</p><h1 className="not-found-code">404: route not found</h1><p className="lede">The requested path does not exist.</p><div className="hero-actions"><Link className="button button-primary" href="/">Return Home</Link><OpenPaletteButton /></div></div></section>
  );
}
