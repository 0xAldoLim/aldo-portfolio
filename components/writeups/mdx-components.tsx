import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { CodeBlock } from "@/components/writeups/code-block";
import { slugify } from "@/lib/utils";

function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(headingText).join("");
  return "";
}

function Heading({ level, children, ...props }: ComponentPropsWithoutRef<"h2"> & { level: 2 | 3 }) {
  const id = slugify(headingText(children));
  const Tag = `h${level}` as "h2" | "h3";
  return <Tag id={id} {...props}><a href={`#${id}`} aria-label={`Link to ${headingText(children)}`}>{children}</a></Tag>;
}

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => <Heading level={2} {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <Heading level={3} {...props} />,
  pre: CodeBlock,
  img: ({ src, alt = "" }: ComponentPropsWithoutRef<"img">) => {
    if (typeof src !== "string") return null;
    return <Image src={src} alt={alt} width={1200} height={675} sizes="(max-width: 820px) 100vw, 760px" style={{ width: "100%", height: "auto" }} />;
  },
  Callout: ({ children }: { children: ReactNode }) => <aside className="callout">{children}</aside>,
};
