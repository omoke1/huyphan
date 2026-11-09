import React, { useRef, useState } from "react";
import {
  ABOUT_FACTS,
  AboutFactCard,
  AWARDS_RECOGNITIONS,
  CAPABILITIES_LIST,
  PROCESS_STEPS,
  PUBLICATIONS_LINKS,
  TRUSTED_BY_LIST,
} from "../data/projects";
import { SootSpriteCompanion } from "./SootSpriteCompanion";

export const AboutPage: React.FC = () => {
  const [selectedFact, setSelectedFact] = useState<AboutFactCard | null>(
    ABOUT_FACTS[0]
  );
  const [processOpen, setProcessOpen] = useState(false);

  // Draggable state for Polaroid Info Card
  const [cardOffset, setCardOffset] = useState({ x: 0, y: 0 });
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

  const handleCardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: cardOffset.x,
      origY: cardOffset.y,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    setCardOffset({
      x: dragRef.current.origX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.origY + (e.clientY - dragRef.current.startY),
    });
  };

  const handleCardPointerUp = () => {
    dragRef.current.active = false;
  };

  const handleSelectFact = (fact: AboutFactCard) => {
    setCardOffset({ x: 0, y: 0 });
    setSelectedFact(fact);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#ECECEC] text-[#181818] pt-24 pb-16 px-5 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Top / Center Section: Interactive Portrait + Fact Triggers + Red Glyphius Statement */}
      <div className="w-full max-w-[1760px] mx-auto grid grid-cols-1 lg:grid-cols-16 gap-8 items-center my-auto py-8">
        {/* Left / Center Interactive Character & Draggable Polaroid Fact Card */}
        <div className="lg:col-span-9 relative flex flex-col md:flex-row items-center gap-8">
          {/* Interactive Portrait & Soot Sprite Canvas */}
          <div className="relative w-[300px] md:w-[340px] shrink-0 flex flex-col items-center">
            <div className="relative w-[280px] h-[340px] bg-[#E2E2E2] overflow-hidden border border-[#181818]/10 flex items-center justify-center group">
              <img
                src="/assets/huyml/about/about-9.jpg"
                alt="Huy Phan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Interactive Dust Sprite Mascot hovering on portrait */}
              <div className="absolute -bottom-8 -right-8 scale-75">
                <SootSpriteCompanion
                  visible={true}
                  mode="embedded"
                  onInteract={() => {
                    const nextIdx =
                      (ABOUT_FACTS.findIndex((f) => f.id === selectedFact?.id) +
                        1) %
                      ABOUT_FACTS.length;
                    handleSelectFact(ABOUT_FACTS[nextIdx]);
                  }}
                />
              </div>
            </div>

            {/* Interactive Personal Fact Triggers (matching Rive state machine triggers) */}
            <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1.5 max-w-[340px]">
              {ABOUT_FACTS.map((fact) => {
                const active = selectedFact?.id === fact.id;
                return (
                  <button
                    key={fact.id}
                    type="button"
                    onClick={() => handleSelectFact(fact)}
                    className={`text-[11px] font-grotesk tracking-[0.01em] cursor-pointer transition-colors ${
                      active
                        ? "text-[#FF4949] underline font-medium"
                        : "text-[#181818]/60 hover:text-[#181818]"
                    }`}
                  >
                    {fact.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Draggable Tilted Polaroid Fact Card (data-rive-info-panel-fresh-root) */}
          {selectedFact && (
            <div
              data-rive-info-panel-fresh-root="true"
              onPointerDown={handleCardPointerDown}
              onPointerMove={handleCardPointerMove}
              onPointerUp={handleCardPointerUp}
              onPointerCancel={handleCardPointerUp}
              style={{
                transform: `translate3d(${cardOffset.x}px, ${cardOffset.y}px, 0) rotate(${selectedFact.rotation}deg)`,
                boxShadow: "-2px 4px 4px 0 rgba(0, 0, 0, 0.23)",
              }}
              className="w-full max-w-[350px] bg-white p-3.5 flex flex-col gap-3.5 cursor-grab active:cursor-grabbing z-20 transition-shadow"
            >
              <div className="w-full aspect-[4/3] bg-[#F2F2F2] overflow-hidden">
                <img
                  src={selectedFact.image}
                  alt={selectedFact.title}
                  draggable={false}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover block pointer-events-none"
                />
              </div>
              <div className="px-1 flex flex-col gap-1.5">
                <h4 className="font-glyphius text-[18px] leading-[1.15] uppercase text-[#181818]">
                  {selectedFact.title}
                </h4>
                <p className="font-grotesk text-[12px] leading-[1.4] text-[#181818]/75">
                  {selectedFact.description}
                </p>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedFact(null)}
                  className="text-[11px] font-grotesk text-[#181818]/60 hover:text-[#181818] cursor-pointer px-1.5 py-0.5"
                >
                  Close ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Editorial Manifesto in #FF4949 BT Glyphius Regular */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <h2 className="font-glyphius text-[22px] sm:text-[26px] xl:text-[30px] leading-[1.28] tracking-[0.01em] uppercase text-[#FF4949] max-w-[680px]">
            Shaping digital experiences with clarity, intention, character and
            being a good friend with digital agencies, design studios, startups
            and businesses around the world since 2018.
          </h2>

          <div className="mt-8 flex items-center gap-12 border-t border-[#181818]/15 pt-5">
            <div>
              <div className="font-grotesk-reg text-[48px] md:text-[64px] leading-[0.88] tracking-[-0.03em] text-[#181818] tabular-nums">
                19
              </div>
              <div className="text-[11px] font-grotesk text-[#181818]/50 mt-1">
                Selected Flagship Works
              </div>
            </div>
            <div>
              <div className="font-grotesk-reg text-[48px] md:text-[64px] leading-[0.88] tracking-[-0.03em] text-[#181818] tabular-nums">
                96
              </div>
              <div className="text-[11px] font-grotesk text-[#181818]/50 mt-1">
                International Awards & Recognitions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 16-Column Structured Information Grid matching huyml.co/about */}
      <div className="w-full max-w-[1760px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-16 gap-y-10 gap-x-7 pt-8 border-t border-[#181818]/10 text-[12px] leading-[1.35] tracking-[0.01em] font-grotesk">
        {/* Col 1-3: Awards & Recognitions */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <span className="text-[#808080]">Awards & Recognitions</span>
          <div className="flex flex-col gap-1 text-[#181818]">
            {AWARDS_RECOGNITIONS.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>

        {/* Col 4-6: Talk, Interview & Publications */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <span className="text-[#808080]">Talk, Interview & Publications</span>
          <div className="flex flex-col gap-1 text-[#181818]">
            {PUBLICATIONS_LINKS.map((pub) => (
              <a
                key={pub.title}
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="huy-link w-fit text-[#181818] hover:text-[#FF4949] transition-colors"
              >
                {pub.title}
              </a>
            ))}
          </div>
        </div>

        {/* Col 7-9: Capabilities + Process & Approach button */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-6">
            <span className="text-[#808080]">Capabilities</span>
            <div className="flex flex-col gap-4 text-[#181818]">
              <div>
                {CAPABILITIES_LIST.slice(0, 3).map((cap) => (
                  <p key={cap}>{cap}</p>
                ))}
              </div>
              <div>
                {CAPABILITIES_LIST.slice(3).map((cap) => (
                  <p key={cap}>{cap}</p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setProcessOpen(true)}
              aria-label="processbtn"
              className="inline-flex items-center gap-2 text-[12px] font-grotesk text-[#181818] underline hover:text-[#FF4949] cursor-pointer transition-colors"
            >
              <span>Process & Approach</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Col 10-12: Trusted by */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <span className="text-[#808080]">Trusted by</span>
          <div className="flex flex-col gap-1 text-[#181818]">
            {TRUSTED_BY_LIST.map((client) => (
              <p key={client}>{client}</p>
            ))}
          </div>
        </div>

        {/* Col 13-16: Location & Colophon */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-6">
            <span className="text-[#808080]">Base & Collaborations</span>
            <p className="text-[#181818]/80 max-w-[320px]">
              Independent digital designer & art director based in Ho Chi Minh
              City, Vietnam. Co-founder of Beaucoup. Available for select
              Q4/2026 & Q1/2027 projects.
            </p>
          </div>

          <div className="text-[#808080] text-[11px]">
            © {new Date().getFullYear()} Huy Phan (huyml.co)
          </div>
        </div>
      </div>

      {/* Approach & ProcessTilted Sheet Overlay (matches aria-label="process" in huyml.co) */}
      {processOpen && (
        <div className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-[2px] flex items-center justify-center p-4 md:p-10">
          <div
            style={{
              transform: "rotate(-1.5deg)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
            }}
            className="relative w-full max-w-[1060px] bg-white text-[#181818] p-6 md:p-12 max-h-[88vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#181818]/15 pb-6">
              <div>
                <span className="text-[11px] font-grotesk text-[#181818]/50">
                  A1 — Philosophy & Workflow
                </span>
                <h3 className="font-glyphius text-[36px] md:text-[56px] leading-[1.0] uppercase text-[#181818] mt-1">
                  Approach & Process
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setProcessOpen(false)}
                className="w-9 h-9 flex items-center justify-center border border-[#181818]/20 hover:border-[#181818] text-[#181818] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* A1 Approach */}
            <div className="py-8 border-b border-[#181818]/15 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 font-glyphius text-[22px] uppercase text-[#FF4949]">
                A1. Approach
              </div>
              <p className="md:col-span-8 font-grotesk text-[15px] leading-[1.6] text-[#181818]">
                I don’t have a particular design style. For me, every website is
                unique, with its own personality, purpose, and story. That’s why
                I treat every project differently, translating its character into
                pixels through typography, imagery, interaction, strategy and
                brand elements while always keeping the main goal.
              </p>
            </div>

            {/* P1 - P6 Process Steps */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.code}
                  className="flex flex-col gap-2 border-t border-[#181818]/15 pt-4"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-grotesk text-[12px] text-[#FF4949] tabular-nums">
                      {step.code}
                    </span>
                    <h4 className="font-glyphius text-[18px] uppercase text-[#181818]">
                      {step.title}
                    </h4>
                  </div>
                  <p className="font-grotesk text-[12px] leading-[1.45] text-[#181818]/75">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
