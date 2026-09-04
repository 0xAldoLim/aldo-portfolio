"use client";

import { useEffect, useState } from "react";

type LoaderPhase = "visible" | "leaving" | "hidden";

export function BootLoader() {
  const [phase, setPhase] = useState<LoaderPhase>("visible");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasLoaded = window.sessionStorage.getItem("aldo-portfolio-loaded") === "true";
    const visibleFor = hasLoaded ? 0 : reducedMotion ? 300 : 2550;
    window.sessionStorage.setItem("aldo-portfolio-loaded", "true");

    const leaveTimer = window.setTimeout(() => setPhase("leaving"), visibleFor);
    const hideTimer = window.setTimeout(() => setPhase("hidden"), visibleFor + 240);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div className="boot-loader" data-state={phase} data-testid="boot-loader" role="status" aria-label="Loading portfolio">
      <div className="boot-loader-inner">
        <p>LOADING PORTFOLIO</p>
        <div className="dino-stage" aria-hidden="true">
          <span className="dino-jumper"><span className="pixel-dino" /></span>
          <span className="pixel-cactus" />
        </div>
        <div className="boot-progress" role="progressbar" aria-label="Loading progress"><span /></div>
      </div>
    </div>
  );
}
