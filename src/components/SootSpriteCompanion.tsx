import React, { useEffect, useRef, useState } from "react";

interface SootSpriteCompanionProps {
  visible: boolean;
  mode?: "floating" | "embedded";
  onInteract?: () => void;
}

interface DustParticle {
  angle: number;
  baseDist: number;
  dist: number;
  velDist: number;
  speed: number;
  size: number;
  alpha: number;
  offsetX: number;
  offsetY: number;
  phase: number;
}

export const SootSpriteCompanion: React.FC<SootSpriteCompanionProps> = ({
  visible,
  mode = "floating",
  onInteract,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [excited, setExcited] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = 280;
    const height = 280;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;

    // Generate organic dust cloud particles matching screenshot
    const particles: DustParticle[] = Array.from({ length: 95 }, (_, i) => {
      const ring = Math.pow(Math.random(), 0.65);
      return {
        angle: (i / 95) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
        baseDist: 16 + ring * 98,
        dist: 16 + ring * 98,
        velDist: 0,
        speed: (Math.random() - 0.5) * 0.008,
        size: 1.1 + Math.pow(Math.random(), 1.6) * 3.4,
        alpha: 0.35 + Math.random() * 0.55,
        offsetX: 0,
        offsetY: 0,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let blinkTimer = 0;
    let isBlinking = false;
    let burstEnergy = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    let lastTime = performance.now();

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const rect = canvas.getBoundingClientRect();
      const spriteScreenX = rect.left + rect.width / 2;
      const spriteScreenY = rect.top + rect.height / 2;
      const dx = mouse.x - spriteScreenX;
      const dy = mouse.y - spriteScreenY;
      const distToMouse = Math.hypot(dx, dy);
      const angleToMouse = Math.atan2(dy, dx);

      burstEnergy *= 0.92;

      // Draw dispersed dust particles
      for (const p of particles) {
        p.angle += p.speed;
        const breathe = Math.sin(now * 0.0025 + p.phase) * 5;
        const targetDist =
          p.baseDist +
          breathe +
          (excited ? 22 : 0) +
          burstEnergy * (25 + (p.baseDist / 100) * 35);

        const springForce = (targetDist - p.dist) * 0.12;
        p.velDist = (p.velDist + springForce) * 0.82;
        p.dist += p.velDist;

        const px = centerX + Math.cos(p.angle) * p.dist;
        const py = centerY + Math.sin(p.angle) * p.dist;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(38, 38, 38, ${p.alpha})`;
        ctx.fill();
      }

      // Blinking logic
      blinkTimer += dt;
      if (!isBlinking && blinkTimer > 3.6) {
        isBlinking = true;
        blinkTimer = 0;
      } else if (isBlinking && blinkTimer > 0.14) {
        isBlinking = false;
        blinkTimer = 0;
      }

      const floatY = Math.sin(now * 0.003) * 3.5;
      const eyeLookDist = Math.min(6.5, distToMouse * 0.025);
      const lookX = Math.cos(angleToMouse) * eyeLookDist;
      const lookY = Math.sin(angleToMouse) * eyeLookDist;

      // Left Eye Sclera
      const leftEyeX = centerX - 24;
      const leftEyeY = centerY - 12 + floatY;
      const rightEyeX = centerX + 24;
      const rightEyeY = centerY - 12 + floatY;
      const eyeRadius = 21;

      const drawEye = (ex: number, ey: number) => {
        ctx.save();
        ctx.beginPath();
        if (isBlinking) {
          ctx.ellipse(ex, ey, eyeRadius, 2.5, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(ex, ey, eyeRadius, 0, Math.PI * 2);
        }
        ctx.fillStyle = "#F5F3EB";
        ctx.shadowColor = "rgba(0,0,0,0.08)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        if (!isBlinking) {
          ctx.beginPath();
          ctx.arc(ex + lookX, ey + lookY, 10.5, 0, Math.PI * 2);
          ctx.fillStyle = "#1E1E1E";
          ctx.fill();
        }
      };

      drawEye(leftEyeX, leftEyeY);
      drawEye(rightEyeX, rightEyeY);

      // Center dark mouth / nose circle (matching screenshot image_2567a1dc.png)
      const mouthX = centerX - 2 + lookX * 0.35;
      const mouthY = centerY + 12 + floatY + lookY * 0.35;
      const mouthRadius = excited ? 21 : 18.5;

      ctx.beginPath();
      ctx.arc(mouthX, mouthY, mouthRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#1D1D1D";
      ctx.fill();
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [visible, excited]);

  if (!visible) return null;

  return (
    <div
      onClick={() => {
        setExcited(true);
        window.setTimeout(() => setExcited(false), 500);
        onInteract?.();
      }}
      onMouseEnter={() => setExcited(true)}
      onMouseLeave={() => setExcited(false)}
      title="Click to scatter dust sprite"
      className={
        mode === "floating"
          ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] cursor-pointer select-none pointer-events-auto"
          : "relative inline-flex items-center justify-center cursor-pointer select-none"
      }
    >
      <canvas
        ref={canvasRef}
        style={{ width: "280px", height: "280px" }}
        className="block pointer-events-auto"
      />
    </div>
  );
};
