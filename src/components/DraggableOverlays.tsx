import React, { useRef, useState } from "react";
import { SootSpriteCompanion } from "./SootSpriteCompanion";
import { PROJECTS } from "../data/projects";

interface DraggableOverlaysProps {
  contactOpen: boolean;
  onCloseContact: () => void;
  creditsOpen: boolean;
  onCloseCredits: () => void;
  onSwitchToCredits: () => void;
  onSwitchToContact: () => void;
  showreelOpen: boolean;
  onCloseShowreel: () => void;
}

export const DraggableOverlays: React.FC<DraggableOverlaysProps> = ({
  contactOpen,
  onCloseContact,
  creditsOpen,
  onCloseCredits,
  onSwitchToCredits,
  onSwitchToContact,
  showreelOpen,
  onCloseShowreel,
}) => {
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    setPos({
      x: dragRef.current.origX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.origY + (e.clientY - dragRef.current.startY),
    });
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  const copyEmail = () => {
    try {
      navigator.clipboard?.writeText("hello@huyml.co");
    } catch {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Draggable Contact ("Come say hi") & Credits Card matching shared-lib.DyD4REXM.mjs */}
      {(contactOpen || creditsOpen) && (
        <div
          data-ui-interactive="true"
          className="fixed inset-0 z-[85] bg-black/20 flex items-center justify-center p-4 select-none"
          onClick={() => {
            onCloseContact();
            onCloseCredits();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${
                creditsOpen ? "2deg" : "-2deg"
              })`,
              boxShadow: "-2px 8px 24px rgba(0, 0, 0, 0.22)",
            }}
            className="relative w-full max-w-[360px] bg-white text-[#181818] p-6 flex flex-col gap-5 cursor-grab active:cursor-grabbing"
          >
            {/* Interactive Soot Sprite Mascot Header (huyml.riv equivalent) */}
            <div className="w-full h-[150px] bg-[#F5F5F3] flex items-center justify-center overflow-hidden relative">
              <div className="scale-75">
                <SootSpriteCompanion visible={true} mode="embedded" />
              </div>
              <span className="absolute bottom-2 right-2.5 text-[10px] font-grotesk text-[#181818]/40">
                Drag card anywhere
              </span>
            </div>

            {contactOpen ? (
              <>
                <div className="flex items-baseline justify-between">
                  <h2 className="font-glyphius text-[28px] leading-[1.0] uppercase text-[#181818]">
                    Come say hi
                  </h2>
                  <button
                    type="button"
                    onClick={onSwitchToCredits}
                    className="text-[11px] font-grotesk text-[#181818]/50 hover:text-[#181818] underline cursor-pointer"
                  >
                    Credits
                  </button>
                </div>

                <div className="flex flex-col gap-3.5 text-[12px] leading-[1.35] font-grotesk">
                  <div className="flex justify-between items-baseline border-b border-[#181818]/10 pb-2.5">
                    <span className="text-[#181818]/50">Drop me a line</span>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="text-[#181818] huy-link cursor-pointer font-medium"
                    >
                      {copied ? "Copied!" : "hello@huyml.co"}
                    </button>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-[#181818]/10 pb-2.5">
                    <span className="text-[#181818]/50">
                      Hear me yapping about design
                    </span>
                    <a
                      href="https://www.youtube.com/@huyml.studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#181818] huy-link"
                    >
                      YouTube
                    </a>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-[#181818]/10 pb-2.5">
                    <span className="text-[#181818]/50">More design stuff</span>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://www.behance.net/huyphan2602"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#181818] huy-link"
                      >
                        Behance
                      </a>
                      <a
                        href="https://dribbble.com/huyphan2602"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#181818] huy-link"
                      >
                        Dribbble
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-[#181818]/10 pb-2.5">
                    <span className="text-[#181818]/50">
                      Design & life updates lately
                    </span>
                    <div className="flex items-center gap-2.5">
                      <a
                        href="https://www.linkedin.com/in/huy-phan-086023a5/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#181818] huy-link"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="https://www.instagram.com/huy.phan.2602"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#181818] huy-link"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-[#181818]/50">
                      Things I captured along the way
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://unsplash.com/@huyphan2602"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#181818] huy-link"
                      >
                        Unsplash
                      </a>
                      <a
                        href="https://www.pexels.com/@huy-phan-316220/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#181818] huy-link"
                      >
                        Pexels
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={onCloseContact}
                    className="text-[12px] font-grotesk text-[#181818]/60 hover:text-[#181818] cursor-pointer"
                  >
                    Close ✕
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-between">
                  <h2 className="font-glyphius text-[28px] leading-[1.0] uppercase text-[#181818]">
                    Credits
                  </h2>
                  <button
                    type="button"
                    onClick={onSwitchToContact}
                    className="text-[11px] font-grotesk text-[#181818]/50 hover:text-[#181818] underline cursor-pointer"
                  >
                    Contact
                  </button>
                </div>

                <div className="flex flex-col gap-3.5 text-[12px] leading-[1.35] font-grotesk">
                  <div className="flex justify-between items-baseline border-b border-[#181818]/10 pb-2.5">
                    <span className="text-[#181818]/50">Development & Rive</span>
                    <a
                      href="https://x.com/BausPjam"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#181818] huy-link"
                    >
                      Chien Pham
                    </a>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-[#181818]/10 pb-2.5">
                    <span className="text-[#181818]/50">Illustration</span>
                    <a
                      href="https://dribbble.com/yupnguyen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#181818] huy-link"
                    >
                      Yup Nguyen
                    </a>
                  </div>

                  <div className="flex justify-between items-baseline border-b border-[#181818]/10 pb-2.5">
                    <span className="text-[#181818]/50">Fonts</span>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://www.myfonts.com/collections/bt-glyphius-font-beautype/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#181818] huy-link"
                      >
                        BT Glyphius
                      </a>
                      <a
                        href="https://www.myfonts.com/collections/bt-grotesk-font-beautype/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#181818] huy-link"
                      >
                        BT Grotesk
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-[#181818]/50">Copywriting</span>
                    <a
                      href="https://www.youtube.com/@theimpulsivestitch"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#181818] huy-link"
                    >
                      Ha Nguyen (the wife)
                    </a>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={onCloseCredits}
                    className="text-[12px] font-grotesk text-[#181818]/60 hover:text-[#181818] cursor-pointer"
                  >
                    Close ✕
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* '25 Showreel Modal */}
      {showreelOpen && (
        <div
          data-ui-interactive="true"
          onClick={onCloseShowreel}
          className="fixed inset-0 z-[95] bg-[#0A0A0A]/95 text-white flex flex-col justify-between p-6 md:p-10 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-[12px] font-grotesk"
          >
            <div className="flex items-center gap-3">
              <span className="font-glyphius uppercase text-[18px]">
                Huy Phan — ‘25 Showreel
              </span>
              <span className="text-white/50">
                Selected Works & Motion Reel (2019–2026)
              </span>
            </div>
            <button
              type="button"
              onClick={onCloseShowreel}
              className="text-white/75 hover:text-white border border-white/25 hover:border-white px-3 py-1 cursor-pointer transition-colors"
            >
              Close ✕
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-[1120px] mx-auto aspect-video bg-[#141414] border border-white/10 relative overflow-hidden flex flex-col justify-between p-6 md:p-10"
          >
            {/* Interactive Showcase Reel Montage + Vimeo Embed */}
            <iframe
              src="https://player.vimeo.com/video/1217193217?autoplay=1&title=0&byline=0&portrait=0"
              title="Huy Phan '25 Showreel"
              allow="autoplay; fullscreen; picture-in-picture"
              className="absolute inset-0 w-full h-full z-10 border-0"
            />
            {/* Resilient visual backdrop in case external iframe is blocked */}
            <div className="relative z-0 flex flex-col justify-between h-full pointer-events-none">
              <div className="grid grid-cols-4 gap-3 opacity-45">
                {PROJECTS.slice(0, 8).map((p) => (
                  <img
                    key={p.slug}
                    src={p.img}
                    alt={p.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                ))}
              </div>
              <div className="text-center my-auto">
                <div className="font-glyphius text-[36px] md:text-[56px] uppercase tracking-[0.02em]">
                  Huy Phan — ‘25 Showreel
                </div>
                <p className="text-[12px] font-grotesk text-white/60 mt-2">
                  Digital Art Direction · Interactive Storytelling · Selected Works
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-[12px] font-grotesk text-white/50"
          >
            <span>Ho Chi Minh City, Vietnam</span>
            <span>hello@huyml.co</span>
          </div>
        </div>
      )}
    </>
  );
};
