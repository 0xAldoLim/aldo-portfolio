"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const order = ["system", "dark", "light"] as const;

export function ThemeControl({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const current = mounted && order.includes(theme as (typeof order)[number]) ? theme! : "system";
  const next = order[(order.indexOf(current as (typeof order)[number]) + 1) % order.length];

  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${current}. Change to ${next}.`}
      title={`Theme: ${current}`}
    >
      <span className="theme-label" aria-hidden="true">{mounted ? current.slice(0, 3) : "sys"}</span>
    </button>
  );
}
