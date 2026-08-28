"use client";

import { useEffect, useState } from "react";

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("aldo-portfolio-visit");
    fetch("/api/visit", { method: seen ? "GET" : "POST" })
      .then((response) => response.ok ? response.json() as Promise<{ count?: number }> : null)
      .then((data) => {
        if (typeof data?.count === "number") {
          setCount(data.count);
          sessionStorage.setItem("aldo-portfolio-visit", "1");
        }
      })
      .catch(() => undefined);
  }, []);

  return <span className="visitor-count" aria-live="polite">{count === null ? "" : `${count.toLocaleString()} VISITS`}</span>;
}
