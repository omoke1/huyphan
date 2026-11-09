import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ProjectItem } from "../data/projects";

interface WorkOverlayProps {
  projects: ProjectItem[];
  activeIndex: number;
  continuousProgress: number;
  onSelectProject: (project: ProjectItem) => void;
  onStepProject: (targetIndex: number) => void;
}

function wrapIdx(index: number, length: number): number {
  return ((index % length) + length) % length;
}

export const WorkOverlay: React.FC<WorkOverlayProps> = ({
  projects,
  activeIndex,
  onSelectProject,
  onStepProject,
}) => {
  const activeProject = projects[wrapIdx(activeIndex, projects.length)] || projects[0];

  const metaRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const centerCardRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number>(activeIndex);

  // Dragging state for right-side CenteredProjectInfoStack
  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number | null;
    lastY: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    lastY: 0,
    moved: false,
  });

  // Trigger signature GSAP blur pulse on project index change
  useEffect(() => {
    if (prevIndexRef.current === activeIndex) return;
    prevIndexRef.current = activeIndex;

    const targets = [
      metaRef.current,
      counterRef.current,
      centerCardRef.current,
    ].filter(Boolean);

    if (targets.length) {
      gsap.killTweensOf(targets);
      gsap.fromTo(
        targets,
        { filter: "blur(9px)", opacity: 0.72 },
        {
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.65,
          ease: "power2.out",
          overwrite: true,
        }
      );
    }
  }, [activeIndex]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      lastY: e.clientY,
      moved: false,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragStateRef.current;
    if (!st.active || st.pointerId !== e.pointerId) return;
    const dy = e.clientY - st.lastY;
    if (Math.abs(dy) > 3) st.moved = true;
    st.lastY = e.clientY;
    const delta = dy * -0.018;
    window.dispatchEvent(
      new CustomEvent("webgl-magazine:external-scroll", {
        detail: { delta },
      })
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragStateRef.current;
    if (!st.active || st.pointerId !== e.pointerId) return;
    const wasMoved = st.moved;
    dragStateRef.current.active = false;
    dragStateRef.current.pointerId = null;
    window.dispatchEvent(new CustomEvent("webgl-magazine:external-scroll-end"));
    if (!wasMoved) {
      onSelectProject(activeProject);
    }
  };

  // Neighboring projects for the vertical stack on the right
  const stackOffsets = [-2, -1, 0, 1, 2];

  return (
    <div className="fixed inset-0 pointer-events-none z-[10] select-none overflow-hidden">
      {/* Middle-Left Metadata Grid */}
      <div
        ref={metaRef}
        style={{ willChange: "filter, opacity" }}
        className="hidden md:grid grid-cols-16 gap-x-5 px-5 absolute left-0 right-0 top-1/2 -translate-y-1/2 text-[#181818] pointer-events-none"
      >
        {/* Col 1-2: Role / Team labels and values */}
        <div className="col-span-3 lg:col-span-2 flex items-start gap-8 text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk">
          <div className="flex flex-col gap-6 text-[#181818]/50">
            {activeProject.ruler.length > 1 ? (
              <>
                <span>{activeProject.ruler[0]}</span>
                <span>{activeProject.ruler[1]}</span>
              </>
            ) : (
              <span>{activeProject.ruler[0] || "Role"}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 text-[#181818]">
            {activeProject.author.map((line, i) => (
              <span key={i} className="whitespace-nowrap">
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* Col 3-5: Date & Recognition */}
        <div className="col-span-4 lg:col-span-3 flex flex-col gap-5 text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk">
          <div className="flex items-start gap-10">
            <span className="w-[78px] shrink-0 text-[#181818]/50">Date</span>
            <span className="text-[#181818]">{activeProject.date}</span>
          </div>
          <div className="flex items-start gap-10">
            <span className="w-[78px] shrink-0 text-[#181818]/50">Recognition</span>
            <div className="flex flex-col gap-0.5 text-[#181818]">
              {activeProject.recognition.map((rec, i) => (
                <span key={i} className="whitespace-nowrap">
                  {rec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Left Scroll + Giant Project Counter Reel */}
      <div className="absolute left-0 right-0 bottom-5 px-5 grid grid-cols-12 lg:grid-cols-16 gap-x-5 items-end text-[#181818] pointer-events-none">
        {/* Far bottom-left Scroll label */}
        <div className="hidden lg:flex lg:col-span-2 items-end pb-1">
          <span className="text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk text-[#181818]/50">
            Scroll
          </span>
        </div>

        {/* Selected work + Giant 180px Counter + /19 */}
        <div className="col-span-8 lg:col-span-6 flex items-end gap-4 md:gap-6">
          <span className="hidden md:inline-block text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk text-[#181818]/50 pb-2 whitespace-nowrap">
            Selected work
          </span>

          <div
            ref={counterRef}
            style={{ willChange: "filter" }}
            className="font-grotesk-reg text-[88px] md:text-[148px] xl:text-[176px] leading-[0.82] tracking-[-0.04em] text-[#181818] tabular-nums"
          >
            {String(activeIndex + 1).padStart(2, "0")}
          </div>

          <div className="flex items-center gap-3 pb-2 pl-2 md:pl-6 pointer-events-auto" data-ui-interactive="true">
            <span className="text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk text-[#181818] tabular-nums">
              /{String(projects.length).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={() =>
                  onStepProject(wrapIdx(activeIndex - 1, projects.length))
                }
                aria-label="Previous project"
                className="w-6 h-6 flex items-center justify-center border border-[#181818]/25 hover:border-[#181818] text-[11px] text-[#181818] cursor-pointer transition-colors"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() =>
                  onStepProject(wrapIdx(activeIndex + 1, projects.length))
                }
                aria-label="Next project"
                className="w-6 h-6 flex items-center justify-center border border-[#181818]/25 hover:border-[#181818] text-[11px] text-[#181818] cursor-pointer transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right-Side CenteredProjectInfoStack + 3 Color Swatches */}
      <div
        data-ui-interactive="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute right-0 top-0 bottom-0 w-full md:w-[440px] lg:w-[500px] flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
      >
        {/* Vertical Stack of Project Info Cards */}
        <div className="relative w-[300px] h-[82vh] flex flex-col items-center justify-center gap-12 overflow-hidden">
          {stackOffsets.map((offset) => {
            const pIdx = wrapIdx(activeIndex + offset, projects.length);
            const proj = projects[pIdx];
            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);
            const opacity = isCenter ? 1 : absOffset === 1 ? 0.22 : 0.08;

            return (
              <div
                key={`${proj.slug}-${offset}`}
                ref={isCenter ? centerCardRef : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCenter) {
                    onSelectProject(proj);
                  } else {
                    onStepProject(pIdx);
                  }
                }}
                style={{
                  opacity,
                  transform: `scale(${isCenter ? 1 : 0.94})`,
                }}
                className={`w-[300px] flex flex-col items-center text-center transition-all duration-500 ${
                  isCenter ? "cursor-pointer" : " hidden md:flex"
                }`}
              >
                {/* Category */}
                <div className="text-[12px] leading-[1.3] tracking-[0.01em] font-grotesk text-[#1E1E1E]/60 mb-1.5">
                  {proj.category}
                </div>

                {/* Project Title in BT Glyphius Regular */}
                <div className="font-glyphius text-[22px] md:text-[24px] leading-[1.1] tracking-[0.01em] uppercase text-[#1E1E1E] whitespace-nowrap">
                  {proj.title}
                </div>

                {/* 12px Hairline Divider */}
                <div className="w-[12px] h-[1px] bg-[#1E1E1E] my-4" />

                {/* Project Description */}
                <p className="text-[12px] leading-[1.35] tracking-[0.01em] font-grotesk text-[#1E1E1E] max-w-[290px]">
                  {proj.description}
                </p>

                {isCenter && (
                  <span className="mt-3 text-[11px] font-grotesk text-[#1E1E1E]/50 hover:text-[#1E1E1E] underline transition-colors">
                    Open case study →
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 3 Animated 15x15px Color Swatches on Right Edge (data-swatch-wrap) */}
        <div
          data-swatch-wrap="true"
          className="fixed md:absolute bottom-7 md:bottom-auto left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 md:right-10 md:top-1/2 md:-translate-y-1/2 inline-flex items-center gap-[3px] pointer-events-auto"
        >
          <div
            title={`Primary: ${activeProject.colorA}`}
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: activeProject.colorA,
              transition: "background-color 520ms cubic-bezier(0.22, 0.61, 0.36, 1)",
            }}
          />
          <div
            title={`Secondary: ${activeProject.colorB}`}
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: activeProject.colorB,
              transition: "background-color 520ms cubic-bezier(0.22, 0.61, 0.36, 1)",
            }}
          />
          <div
            title={`Accent: ${activeProject.colorC}`}
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: activeProject.colorC,
              transition: "background-color 520ms cubic-bezier(0.22, 0.61, 0.36, 1)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
