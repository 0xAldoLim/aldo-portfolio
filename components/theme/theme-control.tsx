"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

function ThemeIcon({ theme }: { theme: "dark" | "light" }) {
  if (theme === "light") {
    return (
      <svg className="control-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.28 5.28l1.42 1.42M17.3 17.3l1.42 1.42M18.72 5.28 17.3 6.7M6.7 17.3l-1.42 1.42" />
      </svg>
    );
  }
  return (
    <svg className="control-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 15.25A8.1 8.1 0 0 1 8.75 4 8.25 8.25 0 1 0 20 15.25Z" />
    </svg>
  );
}

export function ThemeControl({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const current = mounted && resolvedTheme === "light" ? "light" : "dark";
  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      onClick={() => setTheme(next)}
      disabled={!mounted}
      aria-label={mounted ? `Theme: ${current}. Change to ${next}.` : "Theme: system. Loading preference."}
      title={mounted ? `Theme: ${current}` : "Theme: system"}
    >
      <ThemeIcon theme={current} />
    </button>
  );
}
