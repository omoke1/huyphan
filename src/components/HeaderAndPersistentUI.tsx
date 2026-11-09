import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export type ActiveRoute = "work" | "about" | "playground";

interface HeaderAndPersistentUIProps {
  activeRoute: ActiveRoute;
  onNavigate: (route: ActiveRoute) => void;
  onOpenContact: () => void;
  onOpenShowreel: () => void;
  onOpenCredits: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  spriteVisible: boolean;
  onToggleSprite: () => void;
}

export const HeaderAndPersistentUI: React.FC<HeaderAndPersistentUIProps> = ({
  activeRoute,
  onNavigate,
  onOpenContact,
  onOpenShowreel,
  onOpenCredits,
  soundEnabled,
  onToggleSound,
  spriteVisible,
  onToggleSprite,
}) => {
  const [hcmcTime, setHcmcTime] = useState("23:23");
  const [emailStatus, setEmailStatus] = useState<"default" | "hover" | "copied">(
    "default"
  );
  const [logoHovered, setLogoHovered] = useState(false);
  const [hoveredMenuIdx, setHoveredMenuIdx] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoCardRef = useRef<HTMLDivElement>(null);
  const emailLabelRef = useRef<HTMLSpanElement>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  // Live Ho Chi Minh City clock (Asia/Ho_Chi_Minh)
  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }).format(new Date());
        setHcmcTime(formatted);
      } catch {
        setHcmcTime("23:23");
      }
    };
    updateClock();
    const interval = window.setInterval(updateClock, 15000);
    return () => window.clearInterval(interval);
  }, []);

  // 3D Wheel-rotating logo from Ur() in script_main
  useEffect(() => {
    const el = logoCardRef.current;
    if (!el) return;

    const rot = { current: 0, target: 0 };
    let snapTimer: number | null = null;
    let snapTween: gsap.core.Tween | null = null;

    const onWheel = (e: WheelEvent) => {
      snapTween?.kill();
      rot.target += e.deltaY * 0.25;
      if (snapTimer !== null) window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        const snapped = Math.round(rot.target / 180) * 180;
        snapTween = gsap.to(rot, {
          target: snapped,
          duration: 1,
          ease: "power3.out",
          overwrite: true,
        });
      }, 140);
    };

    const tick = () => {
      rot.current += (rot.target - rot.current) * 0.12;
      gsap.set(el, {
        rotationY: rot.current,
        force3D: true,
      });
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("wheel", onWheel);
      gsap.ticker.remove(tick);
      if (snapTimer !== null) window.clearTimeout(snapTimer);
      snapTween?.kill();
    };
  }, []);

  const triggerEmailState = (next: "default" | "hover" | "copied") => {
    if (next === emailStatus) return;
    if (!emailLabelRef.current) {
      setEmailStatus(next);
      return;
    }
    const el = emailLabelRef.current;
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setEmailStatus(next);
        gsap.to(el, {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.22,
          ease: "power2.out",
        });
      },
    });
  };

  const handleCopyEmail = () => {
    try {
      navigator.clipboard?.writeText("hello@huyml.co");
    } catch {}
    triggerEmailState("copied");
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => {
      triggerEmailState("default");
    }, 2800);
  };

  const activeMenuIndex =
    activeRoute === "work" ? 0 : activeRoute === "about" ? 1 : 2;
  const arrowIndex = hoveredMenuIdx !== null ? hoveredMenuIdx : activeMenuIndex;

  const menuItems: { label: string; onClick: () => void }[] = [
    { label: "WORK", onClick: () => onNavigate("work") },
    { label: "ABOUT", onClick: () => onNavigate("about") },
    { label: "PLAYGROUND", onClick: () => onNavigate("playground") },
    { label: "CONTACT", onClick: onOpenContact },
  ];

  const emailStatusLabel =
    emailStatus === "copied"
      ? "Copied"
      : emailStatus === "hover"
      ? "Click to copy"
      : "For inquiries";

  return (
    <>
      {/* Top Fixed Navigation Bar matching huyml.co */}
      <header
        data-ui-interactive="true"
        className="fixed top-0 left-0 right-0 z-[50] text-[#181818] pointer-events-none select-none"
      >
        <div className="w-full px-5 pt-5 pb-3 grid grid-cols-2 lg:grid-cols-16 gap-x-5 gap-y-2 items-start">
          {/* Col 1-2: 3D Flipping Face Logo */}
          <div className="col-span-1 lg:col-span-2 flex items-start">
            <button
              type="button"
              onClick={() => onNavigate("work")}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              aria-label="Huy Phan Home"
              className="pointer-events-auto cursor-pointer p-0 bg-transparent border-0 focus:outline-none"
              style={{ perspective: "600px" }}
            >
              <div
                ref={logoCardRef}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-[38px] h-[44px]"
              >
                <img
                  src={
                    logoHovered
                      ? "/assets/huyml/svg/faceOneHover.svg"
                      : "/assets/huyml/svg/faceOne.svg"
                  }
                  alt="Huy Phan mark"
                  style={{ backfaceVisibility: "hidden" }}
                  className="w-full h-full object-contain block"
                />
                <img
                  src={
                    logoHovered
                      ? "/assets/huyml/svg/faceTwoHover.svg"
                      : "/assets/huyml/svg/faceTwo.svg"
                  }
                  alt="Huy Phan mark back"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className="absolute inset-0 w-full h-full object-contain block"
                />
              </div>
            </button>
          </div>

          {/* Col 3-5: Independent designer */}
          <div className="hidden lg:flex lg:col-span-3 flex-col text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk text-[#181818]">
            <span>Independent designer</span>
          </div>

          {/* Col 6-8: Working globally + HCMC live time */}
          <div className="hidden lg:flex lg:col-span-3 flex-col text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk">
            <span className="text-[#181818]">Working globally</span>
            <span className="text-[#181818]/50 tabular-nums">HCMC, {hcmcTime}</span>
          </div>

          {/* Col 9-11: Menu + Vertical Stack with Sliding Arrow */}
          <div className="hidden lg:flex lg:col-span-3 items-start gap-6 text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk pointer-events-auto">
            <span className="text-[#181818]/50">Menu</span>
            <nav
              onMouseLeave={() => setHoveredMenuIdx(null)}
              className="relative flex flex-col items-start"
            >
              {/* Animated small indicator arrow on left of active/hovered item */}
              <span
                style={{
                  transform: `translateY(${arrowIndex * 18}px)`,
                }}
                className="absolute -left-3.5 top-[2px] text-[9px] text-[#181818] transition-transform duration-300 ease-out pointer-events-none"
              >
                ▸
              </span>
              {menuItems.map((item, idx) => {
                const isActive =
                  (idx === 0 && activeRoute === "work") ||
                  (idx === 1 && activeRoute === "about") ||
                  (idx === 2 && activeRoute === "playground");
                return (
                  <button
                    key={item.label}
                    type="button"
                    onMouseEnter={() => setHoveredMenuIdx(idx)}
                    onClick={item.onClick}
                    className={`h-[18px] text-left text-[12px] leading-[18px] tracking-[0.01em] font-grotesk cursor-pointer transition-opacity ${
                      isActive
                        ? "text-[#181818] font-medium"
                        : "text-[#181818]/75 hover:text-[#181818]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Col 12-14: For inquiries + Click to copy hello@huyml.co */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-start text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk pointer-events-auto">
            <span
              ref={emailLabelRef}
              className="text-[#181818]/50 inline-block will-change-[opacity,filter]"
            >
              {emailStatusLabel}
            </span>
            <button
              type="button"
              onMouseEnter={() => {
                if (emailStatus !== "copied") triggerEmailState("hover");
              }}
              onMouseLeave={() => {
                if (emailStatus !== "copied") triggerEmailState("default");
              }}
              onClick={handleCopyEmail}
              className="text-[#181818] huy-link cursor-pointer mt-0.5 text-left"
            >
              hello@huyml.co
            </button>
          </div>

          {/* Col 15-16: '25 showreel & Credits trigger */}
          <div className="col-span-1 lg:col-span-2 flex items-start justify-end gap-5 text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk pointer-events-auto">
            <button
              type="button"
              onClick={onOpenShowreel}
              className="hidden lg:inline-block text-[#181818] huy-link cursor-pointer whitespace-nowrap"
            >
              ‘25 showreel
            </button>
            <button
              type="button"
              onClick={onOpenCredits}
              className="hidden xl:inline-block text-[#181818]/50 hover:text-[#181818] transition-colors cursor-pointer whitespace-nowrap"
            >
              Credits
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden text-[#181818] text-[12px] font-grotesk uppercase tracking-[0.02em] cursor-pointer px-2 py-1"
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu Overlay */}
      {mobileMenuOpen && (
        <div
          data-ui-interactive="true"
          className="fixed inset-0 z-[48] bg-[#ECECEC] text-[#181818] flex flex-col justify-between p-6 pt-24 lg:hidden"
        >
          <div className="text-[12px] font-grotesk space-y-1">
            <p>Independent designer</p>
            <p className="text-[#181818]/50">Working globally · HCMC, {hcmcTime}</p>
          </div>

          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  item.onClick();
                }}
                className="text-left font-glyphius text-[32px] leading-[1.1] uppercase text-[#181818] cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-end justify-between border-t border-[#181818]/15 pt-4 text-[12px] font-grotesk">
            <div>
              <p className="text-[#181818]/50">{emailStatusLabel}</p>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-[#181818] underline mt-0.5 cursor-pointer"
              >
                hello@huyml.co
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShowreel();
              }}
              className="text-[#181818] underline cursor-pointer"
            >
              ‘25 showreel
            </button>
          </div>
        </div>
      )}

      {/* Bottom-Right Fixed Controls (Sound wave toggle + Dust Sprite companion toggle) */}
      <div
        data-ui-interactive="true"
        className="fixed bottom-5 right-5 z-[50] flex items-center gap-3 pointer-events-auto select-none"
      >
        <button
          type="button"
          onClick={onToggleSprite}
          title={spriteVisible ? "Hide Dust Sprite" : "Summon Dust Sprite Mascot"}
          className={`px-2.5 py-1.5 text-[11px] font-grotesk tracking-[0.01em] transition-colors cursor-pointer border ${
            spriteVisible
              ? "bg-[#181818] text-[#ECECEC] border-[#181818]"
              : "bg-[#ECECEC]/85 text-[#181818] border-[#181818]/20 hover:border-[#181818]"
          }`}
        >
          {spriteVisible ? "Sprite: On" : "Sprite"}
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
          title={soundEnabled ? "Sound On" : "Sound Off"}
          className="w-8 h-8 flex items-center justify-center bg-[#ECECEC]/85 border border-[#181818]/20 hover:border-[#181818] text-[#181818] cursor-pointer transition-colors"
        >
          <div className="flex items-end gap-[2px] h-3">
            <span
              className={`w-[1.5px] bg-[#181818] transition-all duration-300 ${
                soundEnabled ? "h-2.5 animate-pulse" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-[1.5px] bg-[#181818] transition-all duration-300 ${
                soundEnabled ? "h-3 animate-pulse" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-[1.5px] bg-[#181818] transition-all duration-300 ${
                soundEnabled ? "h-2 animate-pulse" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-[1.5px] bg-[#181818] transition-all duration-300 ${
                soundEnabled ? "h-3 animate-pulse" : "h-1 opacity-40"
              }`}
            />
          </div>
        </button>
      </div>
    </>
  );
};
