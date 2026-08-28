"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; phase: number };

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
    const paths: Point[][] = Array.from({ length: 8 }, (_, pathIndex) =>
      Array.from({ length: 9 }, (_, pointIndex) => ({
        x: pointIndex / 8,
        y: .12 + pathIndex * .105 + Math.sin(pointIndex * 1.7 + pathIndex) * .025,
        phase: pathIndex * .9 + pointIndex * .65,
      })),
    );

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
      const color = getComputedStyle(document.documentElement).getPropertyValue("--border").trim();
      context.strokeStyle = color;
      context.lineWidth = 1;
      for (const path of paths) {
        context.beginPath();
        path.forEach((point, index) => {
          const baseX = point.x * width;
          const baseY = point.y * height + Math.sin(time * .00022 + point.phase) * 3 + scrollY * .012 * Math.sin(point.phase);
          const distance = Math.hypot(baseX - pointerX, baseY - pointerY);
          const response = Math.max(0, 1 - distance / 180);
          const x = baseX + response * (baseX - pointerX) * .018;
          const y = baseY + response * (baseY - pointerY) * .018;
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.stroke();
      }
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
