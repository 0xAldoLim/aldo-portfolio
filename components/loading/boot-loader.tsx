"use client";

import { useEffect, useState } from "react";

type LoaderPhase = "visible" | "leaving" | "hidden";

export function BootLoader() {
  const [phase, setPhase] = useState<LoaderPhase>("visible");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasLoaded = window.sessionStorage.getItem("aldo-portfolio-loaded") === "true";
    const visibleFor = hasLoaded ? 0 : reducedMotion ? 300 : 1450;
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
          <svg className="pixel-dino" viewBox="0 0 64 48" shapeRendering="crispEdges">
            <path d="M3 29h8v-4h8V13h5V8h26v4h5v15H37v5h-8v4H18v-3h-7v-4H3Z" />
            <rect className="dino-eye" x="45" y="12" width="4" height="4" />
            <rect className="dino-leg dino-leg-one" x="19" y="34" width="6" height="11" />
            <rect className="dino-leg dino-leg-two" x="31" y="31" width="6" height="14" />
          </svg>
          <span className="pixel-cactus pixel-cactus-one" />
          <span className="pixel-cactus pixel-cactus-two" />
        </div>
        <div className="boot-progress" role="progressbar" aria-label="Loading progress"><span /></div>
      </div>
    </div>
  );
}
