"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Award, ArrowLeft, RotateCcw } from "lucide-react";
import { ImmersiveChrome } from "./immersive-chrome";
import { useImmersiveModule } from "./immersive-module-provider";

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#1746d1", "#c77d26", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * -1,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let frame = 0;
    const maxFrames = 180;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotationSpeed;
        if (frame > maxFrames * 0.6) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden
    />
  );
}

export function ImmersiveMasteryScreen() {
  const { mod } = useImmersiveModule();

  return (
    <>
      <ConfettiCanvas />
      <ImmersiveChrome backHref="/learn?tab=learn" title="Module complete" subtitle={mod.title} />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 text-7xl">{mod.badge || "🎉"}</div>
        <h1 className="text-2xl font-bold tracking-tight">Congratulations!</h1>
        <p className="mt-1 text-lg font-semibold">{mod.title}</p>
        <p className="mt-2 max-w-sm text-[15px] text-muted-foreground">
          You finished every step. Your progress is saved.
        </p>
        {mod.badgeName ? (
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-[13px] font-semibold text-emerald-700">
            <Award className="size-4" />
            {mod.badgeName} unlocked
          </span>
        ) : null}
        <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
          <Link
            href="/learn?tab=learn"
            className="immersive-primary-action flex items-center justify-center gap-2 bg-primary text-primary-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to modules
          </Link>
          <Link
            href={`/learn/modules/${mod.slug}/read/1`}
            className="immersive-primary-action flex items-center justify-center gap-2 border border-border bg-card"
          >
            <RotateCcw className="size-4" />
            Review module
          </Link>
        </div>
      </div>
    </>
  );
}
