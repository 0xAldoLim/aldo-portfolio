"use client";

import { isValidElement, type ReactNode, useState } from "react";

function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return toText(node.props.children);
  return "";
}

export function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toText(children).replace(/\n$/, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="code-frame">
      <button className="code-copy" type="button" onClick={copy} aria-live="polite">{copied ? "Copied" : "Copy"}</button>
      <pre {...props}>{children}</pre>
    </div>
  );
}
