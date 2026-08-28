"use client";

import { useEffect, useRef } from "react";

type WavePoint = { x: number; y: number };

const TAU = Math.PI * 2;

export function LineField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let pointerX = -1000;
    let pointerY = -1000;
    let scrollTarget = window.scrollY;
    let scrollPosition = scrollTarget;
    let scrollVelocity = 0;
    let previousScroll = scrollTarget;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(bounds.width * ratio));
      canvas.height = Math.max(1, Math.floor(bounds.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const pointAt = (
      u: number,
      linePosition: number,
      width: number,
      height: number,
      phase: number,
      compact: boolean,
    ): WavePoint => {
      const edgeEnvelope = Math.sin(Math.PI * u);
      const diagonal = (u - .5) * height * -.18;
      const broadWave = Math.sin(u * TAU * 1.15 + phase + linePosition * .72) * height * .105 * edgeEnvelope;
      const fineWave = Math.sin(u * TAU * 2.7 - phase * .62 + linePosition * .42) * height * .024;
      const ribbonWidth = height * (compact ? .24 : .31);
      const fold = linePosition * ribbonWidth * (.72 + Math.sin(u * TAU + phase * .35) * .12);
      let x = width * (-.08 + u * 1.16) + Math.sin(u * TAU * 1.7 + phase * .45 + linePosition) * width * .012;
      let y = height * .5 + diagonal + broadWave + fineWave + fold;

      const distance = Math.hypot(x - pointerX, y - pointerY);
      const radius = compact ? 110 : 220;
      const influence = Math.max(0, 1 - distance / radius) ** 2;
      x += influence * (x - pointerX) * .055;
      y += influence * (y - pointerY) * .075;
      return { x, y };
    };

    const draw = (time: number) => {
      if (!visible && !reducedMotion) return;

      scrollPosition += (scrollTarget - scrollPosition) * .095;
      scrollVelocity *= .9;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const compact = width < 640;
      const lineCount = compact ? 12 : 19;
      const sampleCount = compact ? 52 : 84;
      const phase = (reducedMotion ? 0 : time * .00032) + scrollPosition * .0075 + scrollVelocity;
      const styles = getComputedStyle(document.documentElement);
      const borderColor = styles.getPropertyValue("--border").trim();
      const accentColor = styles.getPropertyValue("--accent").trim();
      const rows: WavePoint[][] = [];

      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.lineJoin = "round";
      context.lineCap = "round";

      for (let lineIndex = 0; lineIndex < lineCount; lineIndex += 1) {
        const linePosition = lineIndex / (lineCount - 1) - .5;
        const row = Array.from({ length: sampleCount }, (_, sampleIndex) =>
          pointAt(sampleIndex / (sampleCount - 1), linePosition, width, height, phase, compact),
        );
        rows.push(row);

        context.beginPath();
        row.forEach((point, pointIndex) => {
          if (pointIndex === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        const accentLine = lineIndex === Math.floor(lineCount * .3) || lineIndex === Math.floor(lineCount * .7);
        context.strokeStyle = accentLine ? accentColor : borderColor;
        context.globalAlpha = accentLine ? .38 : .66;
        context.stroke();
      }

      const connectorStep = compact ? 13 : 12;
      context.strokeStyle = borderColor;
      context.globalAlpha = .34;
      for (let sampleIndex = connectorStep; sampleIndex < sampleCount - connectorStep / 2; sampleIndex += connectorStep) {
        context.beginPath();
        rows.forEach((row, rowIndex) => {
          const point = row[sampleIndex];
          if (rowIndex === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.stroke();
      }

      context.globalAlpha = 1;
      if (!reducedMotion && visible) frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };
    const onPointerLeave = () => {
      pointerX = -1000;
      pointerY = -1000;
    };
    const onScroll = () => {
      scrollTarget = window.scrollY;
      scrollVelocity = Math.max(-1.8, Math.min(1.8, (scrollTarget - previousScroll) * .018));
      previousScroll = scrollTarget;
    };
    const onResize = () => {
      resize();
      if (reducedMotion) draw(0);
    };

    resize();
    if (reducedMotion) {
      draw(0);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    });
    observer.observe(canvas);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="line-field" aria-hidden="true" />;
}
