import React, { useEffect, useState } from "react";
import { PLAYGROUND_ITEMS, PlaygroundItem } from "../data/projects";

export const PlaygroundPage: React.FC = () => {
  const [columns, setColumns] = useState<2 | 3 | 4>(4);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filterCategories = [
    "All",
    "Art Direction",
    "Typography",
    "Interaction",
    "Editorial",
  ];

  const filteredItems: PlaygroundItem[] =
    activeFilter === "All"
      ? PLAYGROUND_ITEMS
      : PLAYGROUND_ITEMS.filter(
          (item) =>
            item.tag.toLowerCase().includes(activeFilter.toLowerCase()) ||
            item.title.toLowerCase().includes(activeFilter.toLowerCase())
        );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredItems.length
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredItems.length) % filteredItems.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const gridColsClass =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  const activeLightboxItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="min-h-screen w-full bg-[#ECECEC] text-[#181818] pt-28 pb-20 px-5 select-none">
      <div className="max-w-[1760px] mx-auto">
        {/* Top Playground Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#181818]/15">
          <div>
            <div className="text-[12px] font-grotesk text-[#181818]/50 mb-2">
              Archive · Experiments, Unreleased Concepts & Visual Studies
            </div>
            <h1 className="font-glyphius text-[40px] md:text-[64px] leading-[1.0] tracking-[0.01em] uppercase text-[#181818]">
              Playground
            </h1>
          </div>

          {/* Interactive Filter & Column Density Switcher */}
          <div className="flex flex-wrap items-center gap-6 text-[12px] font-grotesk">
            <div className="flex items-center gap-4">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveFilter(cat);
                    setLightboxIndex(null);
                  }}
                  className={`cursor-pointer transition-colors whitespace-nowrap ${
                    activeFilter === cat
                      ? "text-[#181818] underline font-medium"
                      : "text-[#181818]/50 hover:text-[#181818]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 border-l border-[#181818]/15 pl-6">
              <span className="text-[#181818]/50">Grid:</span>
              {([2, 3, 4] as const).map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColumns(col)}
                  className={`px-2 py-0.5 cursor-pointer tabular-nums transition-colors ${
                    columns === col
                      ? "bg-[#181818] text-[#ECECEC]"
                      : "text-[#181818]/60 hover:text-[#181818]"
                  }`}
                >
                  {col}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={`mt-8 grid ${gridColsClass} gap-5 items-start`}>
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group cursor-pointer flex flex-col gap-2"
            >
              <div className="relative w-full overflow-hidden bg-[#DCDCDC]">
                <img
                  src={item.src}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover block group-hover:scale-[1.035] transition-transform duration-500 ease-out"
                />
              </div>

              <div className="flex items-baseline justify-between gap-3 pt-1 text-[11px] font-grotesk">
                <span className="text-[#181818] truncate">{item.title}</span>
                <span className="text-[#181818]/50 shrink-0 tabular-nums">
                  {item.tag} · {item.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-[90] bg-[#0E0E0E]/95 text-white flex flex-col justify-between p-6 md:p-10"
        >
          {/* Top Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-[12px] font-grotesk"
          >
            <div className="flex items-center gap-3">
              <span className="text-white/50 tabular-nums">
                {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
                {String(filteredItems.length).padStart(2, "0")}
              </span>
              <span>·</span>
              <span>{activeLightboxItem.title}</span>
              <span className="text-white/50">· {activeLightboxItem.tag}</span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="text-white/70 hover:text-white cursor-pointer px-3 py-1 border border-white/20 hover:border-white transition-colors"
            >
              Close (ESC) ✕
            </button>
          </div>

          {/* Center Media */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto flex items-center justify-center max-h-[76vh]"
          >
            <img
              src={activeLightboxItem.src}
              alt={activeLightboxItem.title}
              referrerPolicy="no-referrer"
              className="max-h-[76vh] max-w-[88vw] object-contain shadow-2xl"
            />
          </div>

          {/* Bottom Prev / Next Controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between text-[12px] font-grotesk"
          >
            <button
              type="button"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredItems.length) %
                    filteredItems.length
                )
              }
              className="text-white/75 hover:text-white cursor-pointer py-1"
            >
              ← Previous Shot
            </button>
            <span className="text-white/40 tabular-nums">
              {activeLightboxItem.year}
            </span>
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % filteredItems.length)
              }
              className="text-white/75 hover:text-white cursor-pointer py-1"
            >
              Next Shot →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
