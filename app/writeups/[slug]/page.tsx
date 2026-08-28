import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/writeups/mdx-components";
import { getWriteup, getWriteups } from "@/lib/writeups";
import { pageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() { return (await getWriteups()).map((writeup) => ({ slug: writeup.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const writeup = await getWriteup(slug);
  return writeup ? pageMetadata(writeup.title, writeup.summary, `/writeups/${slug}`) : {};
}

export default async function WriteupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const writeups = await getWriteups();
  const index = writeups.findIndex((writeup) => writeup.slug === slug);
  const writeup = writeups[index];
  if (!writeup) notFound();
  const previous = writeups[index + 1];
  const next = writeups[index - 1];
  const related = writeups.filter((item) => item.slug !== slug && (item.event === writeup.event || item.tags.some((tag) => writeup.tags.includes(tag)))).slice(0, 3);

  return (
    <>
      <header className="page-header"><div className="site-shell"><Link className="text-link back-link" href="/writeups">Back to writeups</Link><p className="eyebrow">{writeup.event} / {writeup.category}</p><h1 className="page-title">{writeup.title}</h1><p className="lede">{writeup.summary}</p><p className="focus-line">{formatDate(writeup.published)} / {writeup.tags.join(" / ")} / DISCLOSURE: PUBLIC</p></div></header>
      <article className="section"><div className="site-shell prose-shell">{writeup.headings.length ? <nav className="toc" aria-label="Table of contents"><p>On this page</p>{writeup.headings.map((heading) => <a href={`#${heading.id}`} data-level={heading.level} key={`${heading.level}-${heading.id}`}>{heading.text}</a>)}</nav> : <div />}<div className="prose"><MDXRemote source={writeup.content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-dark-default", keepBackground: false }]] } }} /></div></div></article>
      {(previous || next || related.length) ? <nav className="section section-compact" aria-label="Related writeups"><div className="site-shell split"><div><p className="eyebrow">CONTINUE READING</p>{related.length ? <p className="body-copy">Related: {related.map((item, itemIndex) => <span key={item.slug}>{itemIndex ? " / " : ""}<Link className="text-link" href={`/writeups/${item.slug}`}>{item.title}</Link></span>)}</p> : null}</div><div className="hero-actions">{previous ? <Link className="button" href={`/writeups/${previous.slug}`}>Previous</Link> : null}{next ? <Link className="button" href={`/writeups/${next.slug}`}>Next</Link> : null}</div></div></nav> : null}
    </>
  );
}
