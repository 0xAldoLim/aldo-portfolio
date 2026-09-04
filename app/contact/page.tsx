import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata("Contact", "Contact Aldo Lim Saputra about cybersecurity roles, CTFs, and technical collaboration.", "/contact");

export default function ContactPage() {
  return (
    <>
      <header className="page-header"><div className="site-shell"><p className="eyebrow">05 / CONTACT</p><h1 className="page-title">Start a conversation.</h1><p className="lede">For cybersecurity opportunities, CTF collaboration, or technical projects. I usually reply by email.</p></div></header>
      <section className="section"><div className="site-shell contact-grid"><div><p className="eyebrow">CONTACT DETAILS</p><div className="contact-methods"><div className="contact-method"><small>Email</small><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div><div className="contact-method"><small>Phone</small><a href="tel:+60102533181">{siteConfig.phone}</a></div><div className="contact-method"><small>Location</small><span>{siteConfig.location}</span></div><div className="contact-method"><small>GitHub</small><a href={siteConfig.github} target="_blank" rel="noopener noreferrer">0xAldoLim</a></div><div className="contact-method"><small>LinkedIn</small><a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">aldo-lim</a></div></div></div><div><p className="eyebrow">SEND A MESSAGE</p><ContactForm /></div></div></section>
    </>
  );
}
