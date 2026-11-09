/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { PROJECTS, ProjectItem } from "./data/projects";
import { PushLoaderReveal } from "./components/PushLoaderReveal";
import { WebGLMagazine } from "./components/WebGLMagazine";
import { WorkOverlay } from "./components/WorkOverlay";
import {
  ActiveRoute,
  HeaderAndPersistentUI,
} from "./components/HeaderAndPersistentUI";
import { AboutPage } from "./components/AboutPage";
import { PlaygroundPage } from "./components/PlaygroundPage";
import { ProjectDetailModal } from "./components/ProjectDetailModal";
import { DraggableOverlays } from "./components/DraggableOverlays";
import { SootSpriteCompanion } from "./components/SootSpriteCompanion";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>("work");
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [continuousProgress, setContinuousProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );

  const [contactOpen, setContactOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spriteVisible, setSpriteVisible] = useState(false);

  // Page Transition Curtain state (matches SimplePageTransitionIncomingOverlay in huyml.co)
  const [transitionLabel, setTransitionLabel] = useState<string | null>(null);
  const transitionCurtainRef = useRef<HTMLDivElement>(null);

  const handleLoaderComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  const handleCenterChange = useCallback(
    (projectIndex: number, progress: number) => {
      setActiveProjectIndex(projectIndex);
      setContinuousProgress(progress);
    },
    []
  );

  const handleStepProject = useCallback((targetIndex: number) => {
    window.dispatchEvent(
      new CustomEvent("webgl-magazine:external-scroll", {
        detail: { targetIndex },
      })
    );
  }, []);

  const triggerPageTransition = useCallback(
    (nextRoute: ActiveRoute) => {
      if (nextRoute === activeRoute && !selectedProject) return;
      const labelMap: Record<ActiveRoute, string> = {
        work: "WORK",
        about: "ABOUT",
        playground: "PLAYGROUND",
      };
      const label = labelMap[nextRoute];
      setTransitionLabel(label);

      if (transitionCurtainRef.current) {
        const el = transitionCurtainRef.current;
        gsap.killTweensOf(el);
        gsap.fromTo(
          el,
          { yPercent: 100, autoAlpha: 1 },
          {
            yPercent: 0,
            duration: 0.45,
            ease: "power3.inOut",
            onComplete: () => {
              setSelectedProject(null);
              setActiveRoute(nextRoute);
              window.scrollTo({ top: 0 });
              gsap.to(el, {
                yPercent: -100,
                duration: 0.5,
                delay: 0.12,
                ease: "power3.inOut",
                onComplete: () => {
                  setTransitionLabel(null);
                },
              });
            },
          }
        );
      } else {
        setSelectedProject(null);
        setActiveRoute(nextRoute);
      }
    },
    [activeRoute, selectedProject]
  );

  return (
    <div className="relative min-h-screen w-full bg-[#ECECEC] text-[#181818] overflow-x-hidden">
      {/* Initial Push Loader Reveal (Ava - push_lottie) */}
      <PushLoaderReveal onComplete={handleLoaderComplete} />

      {/* Page Transition Curtain (matches SimplePageTransitionIncomingOverlay) */}
      <div
        ref={transitionCurtainRef}
        style={{ transform: "translateY(100%)", opacity: 0 }}
        className="fixed inset-0 z-[9000] bg-[#0E0E0E] text-white flex items-center justify-center pointer-events-none select-none"
      >
        {transitionLabel && (
          <span className="font-glyphius text-[36px] md:text-[56px] uppercase tracking-[0.02em]">
            {transitionLabel}
          </span>
        )}
      </div>

      {/* Persistent Header & Bottom-Right Controls */}
      <HeaderAndPersistentUI
        activeRoute={activeRoute}
        onNavigate={triggerPageTransition}
        onOpenContact={() => {
          setCreditsOpen(false);
          setContactOpen(true);
        }}
        onOpenCredits={() => {
          setContactOpen(false);
          setCreditsOpen(true);
        }}
        onOpenShowreel={() => setShowreelOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        spriteVisible={spriteVisible}
        onToggleSprite={() => setSpriteVisible((v) => !v)}
      />

      {/* Interactive Floating Soot Sprite Companion (toggleable from bottom-right) */}
      <SootSpriteCompanion visible={spriteVisible} mode="floating" />

      {/* 3D WebGL Magazine Carousel (kept mounted for instant transitions, active on 'work' route) */}
      <div
        className={
          activeRoute === "work" && !selectedProject
            ? "opacity-100 pointer-events-auto transition-opacity duration-500"
            : "opacity-0 pointer-events-none fixed inset-0 -z-10"
        }
      >
        <WebGLMagazine
          projects={PROJECTS}
          activePage={
            activeRoute === "work" &&
            !selectedProject &&
            !contactOpen &&
            !creditsOpen &&
            !showreelOpen
          }
          soundEnabled={soundEnabled}
          introReady={introComplete}
          onCenterChange={handleCenterChange}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        <WorkOverlay
          projects={PROJECTS}
          activeIndex={activeProjectIndex}
          continuousProgress={continuousProgress}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onStepProject={handleStepProject}
        />
      </div>

      {/* ABOUT Route */}
      {activeRoute === "about" && <AboutPage />}

      {/* PLAYGROUND Route */}
      {activeRoute === "playground" && <PlaygroundPage />}

      {/* Project Case Study Fullscreen View (/project/:slug) */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(proj) => setSelectedProject(proj)}
      />

      {/* Draggable Contact, Credits, and '25 Showreel Modals */}
      <DraggableOverlays
        contactOpen={contactOpen}
        onCloseContact={() => setContactOpen(false)}
        creditsOpen={creditsOpen}
        onCloseCredits={() => setCreditsOpen(false)}
        onSwitchToCredits={() => {
          setContactOpen(false);
          setCreditsOpen(true);
        }}
        onSwitchToContact={() => {
          setCreditsOpen(false);
          setContactOpen(true);
        }}
        showreelOpen={showreelOpen}
        onCloseShowreel={() => setShowreelOpen(false)}
      />
    </div>
  );
}
