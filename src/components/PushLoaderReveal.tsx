import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import lottie, { AnimationItem } from "lottie-web";

interface PushLoaderRevealProps {
  onComplete: () => void;
}

const BASE_STOPS = [
  { progress: 0.33, moveDuration: 0.55, holdDuration: 0.14 },
  { progress: 0.67, moveDuration: 0.55, holdDuration: 0.16 },
  { progress: 1.0, moveDuration: 0.6, holdDuration: 0 },
];

function getDisplayPercentFromProgress(progress: number, maxProgress = 1.0): number {
  const clamped = Math.max(0, Math.min(maxProgress, progress));
  if (clamped <= BASE_STOPS[0].progress) {
    return (clamped / BASE_STOPS[0].progress) * 30;
  }
  if (clamped <= BASE_STOPS[1].progress) {
    return (
      30 +
      ((clamped - BASE_STOPS[0].progress) /
        (BASE_STOPS[1].progress - BASE_STOPS[0].progress)) *
        30
    );
  }
  return (
    60 +
    ((clamped - BASE_STOPS[1].progress) / (maxProgress - BASE_STOPS[1].progress)) *
      40
  );
}

export const PushLoaderReveal: React.FC<PushLoaderRevealProps> = ({ onComplete }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [hidden, setHidden] = useState(false);

  const finishImmediately = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    window.dispatchEvent(
      new CustomEvent("push-loader:complete", {
        detail: { event: "loader-slide-start" },
      })
    );
    setHidden(true);
    onComplete();
  };

  useEffect(() => {
    let cancelled = false;
    const progressState = { progress: 0 };

    const startTimeline = (totalFrames: number) => {
      if (cancelled || !rootRef.current) return;
      const el = rootRef.current;

      const updateVisuals = () => {
        const p = progressState.progress;
        el.style.setProperty("--push-progress", `${p}`);
        if (counterRef.current) {
          const vw = window.innerWidth || 1440;
          counterRef.current.textContent = `${Math.round(
            getDisplayPercentFromProgress(p, 1.0)
          )}`;
          const rect = counterRef.current.getBoundingClientRect();
          const rightEdgeThreshold = vw - 24 - rect.width;
          const curtainX = Math.min(1, Math.max(0, p)) * vw;
          const pushX = Math.max(0, curtainX - rightEdgeThreshold);
          el.style.setProperty("--counter-push", `${pushX}px`);
        }
        if (animRef.current && totalFrames > 0) {
          const frame = ((p * totalFrames * 1.08) % totalFrames + totalFrames) % totalFrames;
          animRef.current.goToAndStop(frame, true);
        }
      };

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onUpdate: updateVisuals,
        onComplete: () => {
          window.dispatchEvent(
            new CustomEvent("push-loader:complete", {
              detail: { event: "loader-slide-start" },
            })
          );
          onComplete();
          const exitTl = gsap.timeline({
            onComplete: () => {
              if (!cancelled) setHidden(true);
            },
          });
          exitTl.to(
            el,
            {
              y: "100vh",
              duration: 1.15,
              ease: "power3.inOut",
              force3D: true,
            },
            0.05
          );
          if (centerTextRef.current) {
            exitTl.to(
              centerTextRef.current,
              {
                y: "-100vh",
                duration: 1.15,
                ease: "power3.inOut",
                force3D: true,
              },
              0.05
            );
          }
        },
      });

      BASE_STOPS.forEach((stop, idx) => {
        tl.to(progressState, {
          progress: stop.progress,
          duration: stop.moveDuration,
          ease: idx === BASE_STOPS.length - 1 ? "power3.in" : "power2.inOut",
        });
        if (stop.holdDuration > 0) {
          tl.to({}, { duration: stop.holdDuration });
        }
      });
      tl.to({}, { duration: 0.25 });

      timelineRef.current = tl;
      updateVisuals();
    };

    fetch("/assets/huyml/loader_lottie.json")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (lottieContainerRef.current) {
          lottieContainerRef.current.innerHTML = "";
          const anim = lottie.loadAnimation({
            container: lottieContainerRef.current,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData: data,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid meet",
            },
          });
          animRef.current = anim;
          const totalFrames = Math.max(1, Number(data.op || 60) - Number(data.ip || 0));
          startTimeline(totalFrames);
        } else {
          startTimeline(0);
        }
      })
      .catch(() => {
        if (!cancelled) startTimeline(0);
      });

    return () => {
      cancelled = true;
      timelineRef.current?.kill();
      animRef.current?.destroy();
    };
  }, [onComplete]);

  if (hidden) return null;

  const loaderScale = 0.44;
  const loaderW = 429 * loaderScale;
  const loaderH = 451 * loaderScale;
  const halfW = loaderW * 0.5;

  return (
    <div
      ref={rootRef}
      style={
        {
          "--push-progress": 0,
          "--counter-push": "0px",
        } as React.CSSProperties
      }
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Revealed White Panel */}
      <div className="absolute inset-0 bg-[#ECECEC] pointer-events-none z-0" />

      {/* Center Revealed Brand Name */}
      <div
        ref={centerTextRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10 font-glyphius uppercase text-[#181818] text-[28px] md:text-[36px] leading-[1.08] tracking-[0.01em]"
      >
        huy
        <br />
        phan
      </div>

      {/* Black Sliding Curtain */}
      <div
        style={{
          left: "calc(min(100%, max(0%, var(--push-progress) * 100%)))",
        }}
        className="absolute inset-0 bg-[#0A0A0A] will-change-[left] z-20 pointer-events-none"
      />

      {/* Pushing Lottie Character at Curtain Edge */}
      <div
        style={{
          left: `calc((var(--push-progress) * 100%) - ${halfW - 18}px)`,
          top: "50%",
        }}
        className="absolute w-0 h-0 -translate-x-1/2 -translate-y-1/2 will-change-[left] pointer-events-none z-30"
      >
        <div
          style={{
            width: `${loaderW}px`,
            height: `${loaderH}px`,
          }}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div ref={lottieContainerRef} className="w-full h-full" />
        </div>
      </div>

      {/* Giant Progress Counter on Right */}
      <div
        ref={counterRef}
        style={{
          transform: "translate3d(var(--counter-push), -50%, 0)",
        }}
        className="absolute right-6 top-1/2 text-white font-glyphius text-[64px] md:text-[96px] leading-[0.85] tracking-[-0.02em] tabular-nums pointer-events-none z-40 will-change-transform"
      >
        0
      </div>

      {/* Subtle Skip Intro Affordance */}
      <button
        type="button"
        onClick={finishImmediately}
        className="absolute top-5 right-5 z-50 text-[11px] font-grotesk tracking-[0.02em] text-white/60 hover:text-white mix-blend-difference cursor-pointer px-2 py-1 transition-colors"
      >
        Skip Intro
      </button>
    </div>
  );
};
