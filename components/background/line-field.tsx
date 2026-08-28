"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; phase: number };
type ProjectedPoint = { x: number; y: number };

export function LineField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let visible = true;
    let pointerX = -1000;
    let pointerY = -1000;
    let scrollY = window.scrollY;
    const compact = window.innerWidth < 640;
    const pathCount = compact ? 7 : 10;
    const pointCount = compact ? 8 : 12;
    const paths: Point[][] = Array.from({ length: pathCount }, (_, pathIndex) =>
      Array.from({ length: pointCount }, (_, pointIndex) => ({
        x: pointIndex / (pointCount - 1),
        y: .08 + pathIndex * (.84 / (pathCount - 1)) + Math.sin(pointIndex * 1.43 + pathIndex * .82) * .026,
        phase: pathIndex * .77 + pointIndex * .58,
      })),
    );

    const project = (point: Point, width: number, height: number, time: number): ProjectedPoint => {
      const baseX = point.x * width;
      const scrollShift = scrollY * .014 * Math.sin(point.phase);
      const baseY = point.y * height + Math.sin(time * .00025 + point.phase) * 3.4 + scrollShift;
      const distance = Math.hypot(baseX - pointerX, baseY - pointerY);
      const response = Math.max(0, 1 - distance / (compact ? 125 : 220));
      return {
        x: baseX + response * (baseX - pointerX) * .032,
        y: baseY + response * (baseY - pointerY) * .032,
      };
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.floor(bounds.width * ratio);
      canvas.height = Math.floor(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      if (!visible) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      const styles = getComputedStyle(document.documentElement);
      const borderColor = styles.getPropertyValue("--border").trim();
      const accentColor = styles.getPropertyValue("--accent").trim();
      const projected = paths.map((path) => path.map((point) => project(point, width, height, time)));
      const scrollDensity = Math.min(Math.abs(scrollY) / 1600, .1);

      context.strokeStyle = borderColor;
      context.lineWidth = 1;
      context.globalAlpha = .72 + scrollDensity;
      for (const path of projected) {
        context.beginPath();
        path.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.stroke();
      }

      const connectors = compact
        ? [[1, 3, 2], [3, 5, 5]]
        : [[1, 4, 2], [2, 6, 8], [4, 8, 5], [6, 9, 9]];
      context.globalAlpha = .42;
      context.strokeStyle = borderColor;
      for (const [fromPath, toPath, pointIndex] of connectors) {
        const start = projected[fromPath]?.[pointIndex];
        const end = projected[toPath]?.[Math.min(pointIndex + 1, pointCount - 1)];
        if (!start || !end) continue;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();

        context.globalAlpha = .34;
        context.strokeStyle = accentColor;
        context.beginPath();
        context.moveTo(start.x - 4, start.y);
        context.lineTo(start.x + 4, start.y);
        context.moveTo(start.x, start.y - 4);
        context.lineTo(start.x, start.y + 4);
        context.stroke();
        context.globalAlpha = .42;
        context.strokeStyle = borderColor;
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const onPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };
    const onScroll = () => { scrollY = window.scrollY; };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    });
    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="line-field" aria-hidden="true" />;
}
