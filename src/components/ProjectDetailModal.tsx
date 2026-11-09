import React, { useEffect, useRef } from "react";
import { ProjectItem, PROJECTS } from "../data/projects";

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    document.documentElement.setAttribute("data-parallax-lightbox-open", "true");
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0 });
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.removeAttribute("data-parallax-lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentIdx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const nextProject = PROJECTS[(currentIdx + 1) % PROJECTS.length];

  const allShots = [project.img, ...project.gallery.filter((g) => g !== project.img)];

  return (
    <div
      ref={scrollContainerRef}
      data-ui-interactive="true"
      className="fixed inset-0 z-[80] bg-[#ECECEC] text-[#181818] overflow-y-auto no-scrollbar select-none"
    >
      <div className="min-h-screen max-w-[1760px] mx-auto px-5 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-16 gap-10">
        {/* Left Sticky Project Info Column */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-[12px] font-grotesk text-[#181818]/60 hover:text-[#181818] cursor-pointer inline-flex items-center gap-2 transition-colors"
              >
                <span>← Back to index</span>
              </button>
              <span className="text-[12px] font-grotesk text-[#181818]/50 tabular-nums">
                {String(currentIdx + 1).padStart(2, "0")} /{" "}
                {String(PROJECTS.length).padStart(2, "0")}
              </span>
            </div>

            <div>
              <div className="text-[12px] font-grotesk text-[#181818]/50 mb-1.5">
                {project.category}
              </div>
              <h1 className="font-glyphius text-[36px] md:text-[52px] leading-[1.02] tracking-[0.01em] uppercase text-[#181818]">
                {project.title}
              </h1>
            </div>

            {/* About narrative */}
            <div className="space-y-2 pt-2 border-t border-[#181818]/15">
              <div className="text-[12px] font-grotesk text-[#181818]/50">
                About
              </div>
              <p className="text-[13px] leading-[1.55] font-grotesk text-[#181818]/90 max-w-[480px]">
                {project.story}
              </p>
            </div>

            {/* Role, Launch, Recognition metadata */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#181818]/15 text-[12px] leading-[1.35] font-grotesk">
              <div className="space-y-4">
                <div>
                  <div className="text-[#181818]/50 mb-1">
                    {project.ruler.join(" / ") || "Role"}
                  </div>
                  {project.author.map((a, i) => (
                    <div key={i} className="text-[#181818]">
                      {a}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-[#181818]/50 mb-1">Launch</div>
                  <div className="text-[#181818]">{project.date}</div>
                </div>
              </div>

              <div>
                <div className="text-[#181818]/50 mb-1">Recognition</div>
                <div className="space-y-0.5 text-[#181818]">
                  {project.recognition.map((rec, i) => (
                    <div key={i}>{rec}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Visit site & Palette */}
          <div className="flex items-center justify-between pt-6 border-t border-[#181818]/15">
            <a
              href={project.visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-grotesk text-[#181818] huy-link inline-flex items-center gap-1.5"
            >
              <span>Visit site →</span>
            </a>

            <div className="inline-flex items-center gap-1">
              <span
                style={{ backgroundColor: project.colorA }}
                className="w-4 h-4 block border border-black/10"
              />
              <span
                style={{ backgroundColor: project.colorB }}
                className="w-4 h-4 block border border-black/10"
              />
              <span
                style={{ backgroundColor: project.colorC }}
                className="w-4 h-4 block border border-black/10"
              />
            </div>
          </div>
        </div>

        {/* Right Scrollable Case Study Showcase Column */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {allShots.map((shot, idx) => (
            <div
              key={`${shot}-${idx}`}
              id={`project-shot-${idx}`}
              className="w-full bg-[#DEDEDE] overflow-hidden"
            >
              <img
                src={shot}
                alt={`${project.title} showcase ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover block"
              />
            </div>
          ))}

          {/* Next Project Footer Banner */}
          <div className="mt-12 pt-10 border-t border-[#181818]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="text-[12px] font-grotesk text-[#181818]/50 mb-2">
                Next project
              </div>
              <button
                type="button"
                onClick={() => onSelectProject(nextProject)}
                className="text-left font-glyphius text-[32px] md:text-[48px] leading-[1.0] uppercase text-[#181818] hover:text-[#FF4949] cursor-pointer transition-colors"
              >
                {nextProject.title} →
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-[12px] font-grotesk text-[#181818]/60 hover:text-[#181818] underline cursor-pointer"
            >
              Close case study (ESC)
            </button>
          </div>
        </div>

        {/* Far-Right Minimap Thumbnail Strip (#minimapscroll) */}
        <div
          id="minimapscroll"
          className="hidden lg:flex lg:col-span-1 lg:sticky lg:top-28 lg:h-fit flex-col items-end gap-2"
        >
          {allShots.map((shot, idx) => (
            <button
              key={`mini-${idx}`}
              type="button"
              onClick={() => {
                document
                  .getElementById(`project-shot-${idx}`)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-12 aspect-[4/3] overflow-hidden border border-[#181818]/20 hover:border-[#181818] cursor-pointer transition-all opacity-75 hover:opacity-100"
            >
              <img
                src={shot}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover block"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
