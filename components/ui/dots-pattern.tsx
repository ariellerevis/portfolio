"use client";

import { useCallback, useEffect, useRef } from "react";

interface InteractiveDotsProps {
  backgroundColor?: string;
  dotColor?: string;
  gridSpacing?: number;
  animationSpeed?: number;
  removeWaveLine?: boolean;
  className?: string;
}

type Dot = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  phase: number;
};

type Ripple = {
  x: number;
  y: number;
  time: number;
  intensity: number;
};

function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");

  return {
    red: Number.parseInt(cleanHex.slice(0, 2), 16),
    green: Number.parseInt(cleanHex.slice(2, 4), 16),
    blue: Number.parseInt(cleanHex.slice(4, 6), 16),
  };
}

export default function InteractiveDots({
  backgroundColor = "#11141a",
  dotColor = "#4aa8ff",
  gridSpacing = 28,
  animationSpeed = 0.005,
  removeWaveLine = true,
  className = "",
}: InteractiveDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const animateRef = useRef<() => void>(() => {});
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, isInside: false });
  const ripples = useRef<Ripple[]>([]);
  const dotsRef = useRef<Dot[]>([]);
  const prefersReducedMotionRef = useRef(false);

  const getMouseInfluence = useCallback((x: number, y: number) => {
    if (!mouseRef.current.isInside) return 0;

    const dx = x - mouseRef.current.x;
    const dy = y - mouseRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 150;

    return Math.max(0, 1 - distance / maxDistance);
  }, []);

  const getRippleInfluence = useCallback((x: number, y: number, currentTime: number) => {
    let totalInfluence = 0;

    ripples.current.forEach((ripple) => {
      const age = currentTime - ripple.time;
      const maxAge = 3000;

      if (age < maxAge) {
        const dx = x - ripple.x;
        const dy = y - ripple.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const rippleRadius = (age / maxAge) * 300;
        const rippleWidth = 60;

        if (Math.abs(distance - rippleRadius) < rippleWidth) {
          const rippleStrength = (1 - age / maxAge) * ripple.intensity;
          const proximityToRipple = 1 - Math.abs(distance - rippleRadius) / rippleWidth;
          totalInfluence += rippleStrength * proximityToRipple;
        }
      }
    });

    return Math.min(totalInfluence, 2);
  }, []);

  const initializeDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dots: Dot[] = [];
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    for (let x = gridSpacing / 2; x < canvasWidth; x += gridSpacing) {
      for (let y = gridSpacing / 2; y < canvasHeight; y += gridSpacing) {
        dots.push({
          x,
          y,
          originalX: x,
          originalY: y,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    dotsRef.current = dots;
  }, [gridSpacing]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const bounds = canvas.parentElement?.getBoundingClientRect();
    const displayWidth = Math.max(1, Math.ceil(bounds?.width ?? window.innerWidth));
    const displayHeight = Math.max(1, Math.ceil(bounds?.height ?? window.innerHeight));

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    initializeDots();
  }, [initializeDots]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = event.clientX - rect.left;
    mouseRef.current.y = event.clientY - rect.top;
    mouseRef.current.isInside = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.isInside = false;
    mouseRef.current.isDown = false;
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseRef.current.isDown = true;
    mouseRef.current.isInside = true;
    mouseRef.current.x = x;
    mouseRef.current.y = y;

    ripples.current.push({
      x,
      y,
      time: Date.now(),
      intensity: 2,
    });

    const now = Date.now();
    ripples.current = ripples.current.filter((ripple) => now - ripple.time < 3000);
  }, []);

  const handlePointerUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const currentTime = Date.now();
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const { red, green, blue } = hexToRgb(dotColor);

    if (!prefersReducedMotionRef.current) {
      timeRef.current += animationSpeed;
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    dotsRef.current.forEach((dot) => {
      const mouseInfluence = getMouseInfluence(dot.originalX, dot.originalY);
      const rippleInfluence = getRippleInfluence(dot.originalX, dot.originalY, currentTime);
      const totalInfluence = mouseInfluence + rippleInfluence;
      const breathing = prefersReducedMotionRef.current
        ? 0
        : Math.sin(timeRef.current + dot.phase) * 0.45;

      const dotSize = 1.55 + totalInfluence * 5.8 + breathing;
      const opacity = Math.max(
        0.18,
        0.36 + totalInfluence * 0.42 + Math.abs(Math.sin(timeRef.current * 0.5 + dot.phase)) * 0.08
      );

      ctx.beginPath();
      ctx.arc(dot.originalX, dot.originalY, Math.max(0.7, dotSize), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
      ctx.fill();
    });

    if (!removeWaveLine) {
      ripples.current.forEach((ripple) => {
        const age = currentTime - ripple.time;
        const maxAge = 3000;

        if (age < maxAge) {
          const progress = age / maxAge;
          const radius = progress * 300;
          const alpha = (1 - progress) * 0.22 * ripple.intensity;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.arc(ripple.x, ripple.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      });
    }

    animationFrameId.current = requestAnimationFrame(() => animateRef.current());
  }, [animationSpeed, backgroundColor, dotColor, getMouseInfluence, getRippleInfluence, removeWaveLine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      prefersReducedMotionRef.current = mediaQuery.matches;
    };

    updateMotionPreference();
    resizeCanvas();
    animateRef.current = animate;

    const resizeObserver = new ResizeObserver(() => resizeCanvas());

    resizeObserver.observe(canvas.parentElement ?? canvas);
    mediaQuery.addEventListener("change", updateMotionPreference);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    animate();

    return () => {
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", updateMotionPreference);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }

      timeRef.current = 0;
      ripples.current = [];
      dotsRef.current = [];
    };
  }, [animate, handlePointerDown, handlePointerLeave, handlePointerMove, handlePointerUp, resizeCanvas]);

  return (
    <div className={`absolute inset-0 h-full w-full overflow-hidden ${className}`} style={{ backgroundColor }}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
    </div>
  );
}
