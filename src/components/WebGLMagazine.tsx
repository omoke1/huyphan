import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ProjectItem } from "../data/projects";

interface WebGLMagazineProps {
  projects: ProjectItem[];
  activePage: boolean;
  soundEnabled: boolean;
  introReady: boolean;
  onCenterChange: (projectIndex: number, progress: number) => void;
  onSelectProject: (project: ProjectItem) => void;
}

const VERTEX_SHADER = `
varying vec2 vUv;
attribute float aIndex;
attribute vec4 aTextureCoords;
attribute float aImageAspect;

uniform float uCurrentPage;
uniform float uPageThickness;
uniform float uPageWidth;
uniform float uPageHeight;
uniform float uMeshCount;
uniform float uTime;
uniform float uProgress;
uniform float uSplitProgress;
uniform float uPageSpacing;
uniform float uCenterSpacing;
uniform float uFocusRotationX;
uniform float uFocusRotationY;
uniform float uFocusRotationZ;
uniform float uScrollY;
uniform float uMaxX;
uniform float uSpeedY;
uniform float uScrollCurve;
uniform float uHoverIndex;
uniform float uHoverLift;
uniform float uHoverIndexOut;
uniform float uHoverLiftOut;

varying vec4 vTextureCoords;
varying float vIndex;
varying float vRotationProgress;
varying vec3 vPosition;
varying float vImageAspect;
varying float vFocusFactor;

mat3 getYrotationMatrix(float angle){
    return mat3(
        cos(angle), 0.0, sin(angle),
        0.0, 1.0, 0.0,
        -sin(angle), 0.0, cos(angle)
    );
}
mat3 getXrotationMatrix(float angle){
    return mat3(
        1.0, 0.0, 0.0,
        0.0, cos(angle), -sin(angle),
        0.0, sin(angle), cos(angle)
    );
}
mat3 getZrotationMatrix(float angle){
    return mat3(
        cos(angle), sin(angle), 0.0,
        -sin(angle), cos(angle), 0.0,
        0.0, 0.0, 1.0
    );
}
float remap(float value, float originMin, float originMax){
    return clamp((value - originMin) / (originMax - originMin), 0., 1.);
}
float getXwave(float x){
    return sin(x * 2.) * 0.4;
}

void main(){
    float PI = 3.14159265359;
    vec3 rotationCenter = vec3(-uPageWidth * 0.5, 0.0, 0.0);
    vec3 translatedPosition = position - rotationCenter;
    float rotationAcclerationProgress = remap(uProgress, 0., 0.3);
    float delayBeforeStart = (aIndex / uMeshCount);
    float localRotAccelerationProgress = clamp((rotationAcclerationProgress - delayBeforeStart), 0.0, 1.0);
    float yAngle = -(position.x * 0.2 * smoothstep(0., 0.3, rotationAcclerationProgress) - rotationAcclerationProgress * 2. * PI - localRotAccelerationProgress * 2. * PI);
    float fullSpeedRotationAngle = remap(uProgress, 0.3, 0.7);
    yAngle += fullSpeedRotationAngle * 4.2 * PI;
    float stackingAngle = remap(uProgress, 0.7, 1.);
    yAngle += position.x * 0.2 * stackingAngle + (1. - localRotAccelerationProgress) * 2. * PI * stackingAngle + PI * 1.7 * stackingAngle;
    float pageCrumple = (aIndex - (uMeshCount - 1.) * 0.5) * smoothstep(0.8, 1., stackingAngle) * ((uPageWidth - translatedPosition.x - 1.) * 0.01);
    translatedPosition.z += pageCrumple * (1. - uSplitProgress);
    float pageCrumpleAngle = (aIndex - (uMeshCount - 1.) * 0.5) * smoothstep(0.8, 1., stackingAngle) * ((-pow(translatedPosition.x, 2.)) * 0.002);
    yAngle += pageCrumpleAngle;
    float stackingPages = (uMeshCount - aIndex) * uPageThickness * smoothstep(0.8, 1., stackingAngle);
    translatedPosition.z += stackingPages * (1. - uSplitProgress);
    yAngle -= pageCrumpleAngle * uSplitProgress;
    yAngle -= uSplitProgress * PI * 0.4;
    translatedPosition.z += uSplitProgress * uPageSpacing * (-(aIndex - (uMeshCount - 1.) * 0.5));
    float boxCenterZ = uPageSpacing * (-(aIndex - (uMeshCount - 1.) * 0.5));
    float maxZ = uMeshCount * (uPageSpacing + uPageThickness) * 0.5;
    float centerZProgress = boxCenterZ - uScrollY;
    float flatWrappedCenterZ = mod(centerZProgress + maxZ, 2.0 * maxZ) - maxZ;
    float distanceToCenter = abs(flatWrappedCenterZ);
    float pushAmount = uCenterSpacing * uPageSpacing;
    float shiftMagnitude = smoothstep(0.1, uPageSpacing * 0.9, distanceToCenter) * pushAmount;
    float direction = sign(flatWrappedCenterZ);
    if (direction == 0.0) direction = 1.0;
    float shiftedWrappedCenterZ = flatWrappedCenterZ + direction * shiftMagnitude;
    float wrappedCenterZ = shiftedWrappedCenterZ - getXwave((position.y + uPageHeight * 0.5) / uPageHeight) * clamp(uSpeedY * 2., -2., 2.) * uScrollCurve;
    float zOffset = wrappedCenterZ - boxCenterZ;
    translatedPosition.z += zOffset;
    vec3 rotatedPosition = getYrotationMatrix(yAngle) * translatedPosition;
    rotatedPosition.z -= uSplitProgress;
    float initialRotationProgress = remap(uProgress, 0., 0.15);
    rotatedPosition += rotationCenter;
    rotatedPosition.x += initialRotationProgress * uPageWidth * 0.5;
    float xAngle = -PI * 0.2 * initialRotationProgress;
    xAngle += uSplitProgress * PI * 0.2;
    vec3 newPosition = getXrotationMatrix(xAngle) * rotatedPosition;
    float focusFactor = 1.0 - smoothstep(0.0, uPageSpacing * 0.8, distanceToCenter);
    float smoothedFocusFactor = smoothstep(0.0, 1.0, focusFactor);
    float rotationFactor = smoothedFocusFactor;
    vec3 localFocusCenter = vec3(uPageWidth * 0.5, 0.0, 0.0);
    newPosition -= localFocusCenter;
    newPosition = getXrotationMatrix(uFocusRotationX * rotationFactor) * newPosition;
    newPosition = getYrotationMatrix(uFocusRotationY * rotationFactor) * newPosition;
    newPosition = getZrotationMatrix(uFocusRotationZ * rotationFactor) * newPosition;
    newPosition += localFocusCenter;
    float liftAmount = 0.0;
    if (abs(aIndex - uHoverIndex) < 0.5) liftAmount = uHoverLift;
    if (abs(aIndex - uHoverIndexOut) < 0.5) liftAmount = max(liftAmount, uHoverLiftOut);
    float nonFocusFactor = smoothstep(0.05, 0.4, 1.0 - smoothedFocusFactor);
    float hoverAmount = liftAmount * nonFocusFactor;
    newPosition.y += hoverAmount * 0.25;
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    vUv = uv;
    vTextureCoords = aTextureCoords;
    vIndex = aIndex;
    vRotationProgress = localRotAccelerationProgress;
    vImageAspect = aImageAspect;
    vFocusFactor = smoothedFocusFactor;
}
`;

const FRAGMENT_SHADER = `
varying vec2 vUv;
varying vec4 vTextureCoords;
uniform sampler2D uAtlas;
varying float vIndex;
varying float vRotationProgress;
varying float vImageAspect;
varying float vFocusFactor;
uniform float uPageWidth;
uniform float uPageHeight;
uniform float uPicking;
uniform float uHoverIndex;
uniform float uHoverLift;
uniform float uHoverIndexOut;
uniform float uHoverLiftOut;

void main(){
    float xStart = vTextureCoords.x;
    float xEnd = vTextureCoords.y;
    float yStart = vTextureCoords.z;
    float yEnd = vTextureCoords.w;
    float planeAspect = uPageWidth / uPageHeight;
    float imageAspect = vImageAspect;
    vec2 coverUv = vUv;
    if (planeAspect < imageAspect) {
        float scale = planeAspect / imageAspect;
        coverUv.x = (coverUv.x - 0.5) * scale + 0.5;
    } else {
        float scale = imageAspect / planeAspect;
        coverUv.y = (coverUv.y - 0.5) * scale + 0.5;
    }
    float textureHoverAmount = 0.0;
    if (abs(vIndex - uHoverIndex) < 0.5) {
        textureHoverAmount = uHoverLift;
    }
    if (abs(vIndex - uHoverIndexOut) < 0.5) {
        textureHoverAmount = max(textureHoverAmount, uHoverLiftOut);
    }
    textureHoverAmount *= smoothstep(0.65, 0.95, vFocusFactor);
    float textureScale = 1.0 - textureHoverAmount * 0.156;
    coverUv = (coverUv - 0.5) * textureScale + 0.5;
    vec2 atlasUV = vec2(
        mix(xStart, xEnd, coverUv.x),
        mix(yStart, yEnd, 1.0 - coverUv.y)
    );
    if (vRotationProgress == 0. && vIndex != 0.) {
        discard;
    }
    if (uPicking > 0.5) {
        gl_FragColor = vec4((vIndex + 1.0) / 255.0, 0.0, 0.0, 1.0);
        return;
    }
    vec4 color = texture2D(uAtlas, atlasUV);
    gl_FragColor = color;
}
`;

export const WebGLMagazine: React.FC<WebGLMagazineProps> = ({
  projects,
  activePage,
  soundEnabled,
  introReady,
  onCenterChange,
  onSelectProject,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const soundEnabledRef = useRef(soundEnabled);
  const activePageRef = useRef(activePage);
  const onCenterChangeRef = useRef(onCenterChange);
  const onSelectProjectRef = useRef(onSelectProject);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  useEffect(() => {
    onSelectProjectRef.current = onSelectProject;
  }, [onSelectProject]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !introReady) return;

    let disposed = false;
    let rafId = 0;

    // Audio players
    const scrollAudio = new Audio("/assets/huyml/audio/scroll.mp3");
    scrollAudio.volume = 0.45;
    const tickAudio = new Audio("/assets/huyml/audio/tick.mp3");
    tickAudio.volume = 0.35;
    let lastSoundTime = 0;

    const playScrollSound = () => {
      if (!soundEnabledRef.current) return;
      const now = performance.now();
      if (now - lastSoundTime < 120) return;
      lastSoundTime = now;
      try {
        scrollAudio.currentTime = 0;
        scrollAudio.play().catch(() => {});
      } catch {}
    };

    const playTickSound = () => {
      if (!soundEnabledRef.current) return;
      try {
        tickAudio.currentTime = 0;
        tickAudio.play().catch(() => {});
      } catch {}
    };

    // Constants from WebGLMagazineFramer
    const pageWidth = 3.744;
    const pageHeight = 2.808;
    const pageThickness = 0.01;
    const centerSpacingTarget = 5.3;
    const scrollCurve = 1.0;
    const posX = 4.3;
    const posY = 2.1;
    const posZ = 5.1;
    const focusRotX = 0.06681;
    const focusRotY = -0.36331;
    const focusRotZ = -0.51318;
    const viewHeight = 10.8;

    const projectCount = Math.max(1, projects.length);
    const meshCount = projectCount * Math.max(1, Math.ceil(30 / projectCount));

    const getSize = () => ({
      width: Math.max(1, container.clientWidth),
      height: Math.max(1, container.clientHeight),
      pixelRatio: Math.min(2, window.devicePixelRatio || 1),
    });

    let size = getSize();
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();
    const lookTarget = new THREE.Vector3(-7, -2.1, 1.3);

    const aspect = size.width / size.height;
    const camera = new THREE.OrthographicCamera(
      (viewHeight * aspect) / -2,
      (viewHeight * aspect) / 2,
      viewHeight / 2,
      viewHeight / -2,
      0.1,
      1000
    );
    camera.position.set(20, 12.1, 16.6);
    camera.lookAt(lookTarget);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(size.pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const pickTarget1x1 = new THREE.WebGLRenderTarget(1, 1);
    const pickTarget64 = new THREE.WebGLRenderTarget(64, 64);
    let pickBuffer64: Uint8Array | null = null;

    const group = new THREE.Group();
    scene.add(group);

    let material: THREE.ShaderMaterial | null = null;
    let instancedMesh: THREE.InstancedMesh | null = null;
    let atlasTexture: THREE.CanvasTexture | null = null;

    const mouseNormalized = new THREE.Vector2(0, 0);
    const mouseSmoothed = new THREE.Vector2(0, 0);
    const pointerClient = { x: -9999, y: -9999 };

    const scrollState = {
      target: 0,
      current: 0,
    };

    let introPlaying = false;
    let spacingExpanded = false;
    let hoveredInstance = -1;
    let prevHoveredInstance = -1;
    let lastReportedInstance = -1;
    let lastProjectIdx: number | null = null;
    let snapEnabled = false;
    let baseSnapOrigin = 0;
    let wheeling = false;
    let wheelTimeout = 0;
    let pendingWheel = 0;
    let smoothingWheel = false;
    let externalDragging = false;
    let frameCounter = 0;
    let hoverMissCount = 0;
    let lastHoverPos: { x: number; y: number } | null = null;

    const wrapProjectIndex = (idx: number) =>
      ((idx % projectCount) + projectCount) % projectCount;

    const getWrappedDistance = (instanceIdx: number, scrollVal: number) => {
      const halfSpan = meshCount * 1.01 * 0.5;
      const raw = -(instanceIdx - (meshCount - 1) * 0.5) - scrollVal + halfSpan;
      return (((raw % (2 * halfSpan)) + 2 * halfSpan) % (2 * halfSpan)) - halfSpan;
    };

    const getClosestInstance = (scrollVal = scrollState.current) => {
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < meshCount; i++) {
        const d = Math.abs(getWrappedDistance(i, scrollVal));
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      return bestIdx;
    };

    const getSnapTarget = (targetVal: number) => {
      if (!snapEnabled) return targetVal;
      const halfSpan = meshCount * 1.01 * 0.5;
      let bestSnap = baseSnapOrigin;
      let bestDist = Infinity;
      for (let i = 0; i < meshCount; i++) {
        const wrapped =
          targetVal +
          ((((-(i - (meshCount - 1) * 0.5) - targetVal + halfSpan) % (2 * halfSpan)) +
            2 * halfSpan) %
            (2 * halfSpan) -
            halfSpan);
        const stepCount = Math.round((wrapped - baseSnapOrigin) / 1);
        const gridSnap = baseSnapOrigin + stepCount * 1;
        const dist = Math.abs(gridSnap - targetVal);
        if (dist < bestDist) {
          bestDist = dist;
          bestSnap =
            Math.abs(wrapped - gridSnap) <= Math.abs(wrapped - baseSnapOrigin)
              ? wrapped
              : gridSnap;
        }
      }
      return bestSnap;
    };

    const findNearestScrollForProject = (projIdx: number, currentScroll: number) => {
      const targetProj = wrapProjectIndex(projIdx);
      const halfSpan = meshCount * 1.01 * 0.5;
      let bestScroll = currentScroll;
      let bestDist = Infinity;
      for (let i = 0; i < meshCount; i++) {
        if (wrapProjectIndex(i) !== targetProj) continue;
        const candidate =
          currentScroll +
          ((((-(i - (meshCount - 1) * 0.5) - currentScroll + halfSpan) %
            (2 * halfSpan)) +
            2 * halfSpan) %
            (2 * halfSpan) -
            halfSpan);
        const d = Math.abs(candidate - currentScroll);
        if (d < bestDist) {
          bestDist = d;
          bestScroll = candidate;
        }
      }
      return bestScroll;
    };

    const expandSpacingIfNeeded = () => {
      if (spacingExpanded || !material) return;
      spacingExpanded = true;
      if (!snapEnabled) {
        snapEnabled = true;
        baseSnapOrigin = getSnapTarget(scrollState.current);
      }
      gsap.to(material.uniforms.uCenterSpacing, {
        value: centerSpacingTarget,
        duration: 1.4,
        ease: "power2.out",
      });
      gsap.to(material.uniforms.uFocusRotationX, {
        value: focusRotX,
        duration: 1.4,
        ease: "power2.out",
      });
      gsap.to(material.uniforms.uFocusRotationY, {
        value: focusRotY,
        duration: 1.4,
        ease: "power2.out",
      });
      gsap.to(material.uniforms.uFocusRotationZ, {
        value: focusRotZ,
        duration: 1.4,
        ease: "power2.out",
      });
    };

    const emitCenterState = (instanceIdx: number, force = false) => {
      if (instanceIdx < 0) return;
      const projIdx = wrapProjectIndex(instanceIdx);
      if (lastProjectIdx !== null && projIdx !== lastProjectIdx) {
        playScrollSound();
      }
      lastProjectIdx = projIdx;

      const continuousProgress =
        (((instanceIdx + getWrappedDistance(instanceIdx, scrollState.current)) %
          projectCount) +
          projectCount) %
        projectCount;

      if (force || instanceIdx !== lastReportedInstance) {
        lastReportedInstance = instanceIdx;
      }
      onCenterChangeRef.current(projIdx, continuousProgress);
    };

    const updateHoverState = (nextInstance: number) => {
      if (!material || nextInstance === hoveredInstance) return;
      gsap.killTweensOf(material.uniforms.uHoverLift);
      gsap.killTweensOf(material.uniforms.uHoverLiftOut);

      if (hoveredInstance >= 0) {
        prevHoveredInstance = hoveredInstance;
        material.uniforms.uHoverIndexOut.value = hoveredInstance;
        material.uniforms.uHoverLiftOut.value = material.uniforms.uHoverLift.value;
        const outIdx = prevHoveredInstance;
        gsap.to(material.uniforms.uHoverLiftOut, {
          value: 0,
          duration: 0.9,
          ease: "power4.out",
          overwrite: "auto",
          onComplete: () => {
            if (prevHoveredInstance === outIdx && material) {
              prevHoveredInstance = -1;
              material.uniforms.uHoverIndexOut.value = -1;
              material.uniforms.uHoverLiftOut.value = 0;
            }
          },
        });
      }

      hoveredInstance = nextInstance;
      material.uniforms.uHoverIndex.value = nextInstance >= 0 ? nextInstance : -1;
      material.uniforms.uHoverLift.value = 0;

      if (nextInstance >= 0) {
        if (!introPlaying && nextInstance === getClosestInstance()) {
          playTickSound();
        }
        gsap.to(material.uniforms.uHoverLift, {
          value: 1,
          duration: 0.9,
          ease: "power4.out",
          overwrite: "auto",
        });
      }
    };

    const renderPick64 = () => {
      if (!material) return;
      material.uniforms.uPicking.value = 1;
      material.side = THREE.DoubleSide;
      renderer.setRenderTarget(pickTarget64);
      renderer.clear();
      renderer.render(scene, camera);
      if (!pickBuffer64) {
        pickBuffer64 = new Uint8Array(64 * 64 * 4);
      }
      renderer.readRenderTargetPixels(pickTarget64, 0, 0, 64, 64, pickBuffer64);
      material.uniforms.uPicking.value = 0;
      material.side = THREE.FrontSide;
      renderer.setRenderTarget(null);
    };

    const samplePick64 = (clientX: number, clientY: number) => {
      if (!pickBuffer64) return -1;
      const rect = renderer.domElement.getBoundingClientRect();
      if (
        rect.width <= 0 ||
        rect.height <= 0 ||
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return -1;
      }
      const gx = Math.min(
        63,
        Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * 64))
      );
      const gy = Math.min(
        63,
        Math.max(0, Math.floor((1 - (clientY - rect.top) / rect.height) * 64))
      );
      const offset = (gy * 64 + gx) * 4;
      return pickBuffer64[offset + 3] === 0 ? -1 : pickBuffer64[offset] - 1;
    };

    const samplePick1x1 = (clientX: number, clientY: number) => {
      if (!material) return -1;
      const rect = renderer.domElement.getBoundingClientRect();
      if (
        rect.width <= 0 ||
        rect.height <= 0 ||
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return -1;
      }
      material.uniforms.uPicking.value = 1;
      material.side = THREE.DoubleSide;
      const drawSize = renderer.getDrawingBufferSize(new THREE.Vector2());
      const w = Math.max(1, Math.floor(drawSize.x));
      const h = Math.max(1, Math.floor(drawSize.y));
      const px = Math.min(
        w - 1,
        Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * w))
      );
      const py = Math.min(
        h - 1,
        Math.max(0, Math.floor(((clientY - rect.top) / rect.height) * h))
      );
      camera.setViewOffset(w, h, px, py, 1, 1);
      renderer.setRenderTarget(pickTarget1x1);
      renderer.clear();
      renderer.render(scene, camera);
      const pixel = new Uint8Array(4);
      renderer.readRenderTargetPixels(pickTarget1x1, 0, 0, 1, 1, pixel);
      camera.clearViewOffset();
      material.uniforms.uPicking.value = 0;
      material.side = THREE.FrontSide;
      renderer.setRenderTarget(null);
      return pixel[3] > 0 ? pixel[0] - 1 : -1;
    };

    const scrollToInstance = (instanceIdx: number) => {
      if (!material) return;
      expandSpacingIfNeeded();
      const targetPos = -(instanceIdx - (meshCount - 1) * 0.5);
      const halfSpan = meshCount * 1.01 * 0.5;
      const raw = targetPos - scrollState.target + halfSpan;
      const delta =
        raw - 2 * halfSpan * Math.floor(raw / (2 * halfSpan)) - halfSpan;
      scrollState.target += delta;
    };

    // Load images and build atlas
    const loadAtlasAndInit = async () => {
      const loadedImages = await Promise.all(
        projects.map(
          (p) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = () => {
                const fallback = document.createElement("canvas");
                fallback.width = 910;
                fallback.height = 732;
                const ctx = fallback.getContext("2d");
                if (ctx) {
                  ctx.fillStyle = p.colorA || "#222";
                  ctx.fillRect(0, 0, 910, 732);
                  ctx.fillStyle = "#fff";
                  ctx.font = "700 48px sans-serif";
                  ctx.textAlign = "center";
                  ctx.fillText(p.title, 455, 366);
                }
                const fallbackImg = new Image();
                fallbackImg.onload = () => resolve(fallbackImg);
                fallbackImg.src = fallback.toDataURL("image/jpeg", 0.9);
              };
              img.src = p.img;
            })
        )
      );

      if (disposed) return;

      // Scale down atlas width to max 1024px so WebGL max texture size is never exceeded
      const maxWidth = 910;
      const scaledDims = loadedImages.map((img) => {
        const w = img.naturalWidth || img.width || 910;
        const h = img.naturalHeight || img.height || 732;
        const scale = Math.min(1, maxWidth / w);
        return {
          img,
          w: Math.round(w * scale),
          h: Math.round(h * scale),
          aspect: w / h,
        };
      });

      const atlasW = Math.max(...scaledDims.map((d) => d.w));
      const atlasH = scaledDims.reduce((acc, d) => acc + d.h, 0);
      const atlasCanvas = document.createElement("canvas");
      atlasCanvas.width = atlasW;
      atlasCanvas.height = atlasH;
      const ctx = atlasCanvas.getContext("2d");
      if (!ctx) return;

      let yCursor = 0;
      const uvEntries = scaledDims.map((d) => {
        ctx.drawImage(d.img, 0, yCursor, d.w, d.h);
        const entry = {
          aspectRatio: d.aspect,
          uvs: {
            xStart: 0,
            xEnd: d.w / atlasW,
            yStart: 1 - yCursor / atlasH,
            yEnd: 1 - (yCursor + d.h) / atlasH,
          },
        };
        yCursor += d.h;
        return entry;
      });

      atlasTexture = new THREE.CanvasTexture(atlasCanvas);
      atlasTexture.needsUpdate = true;
      atlasTexture.minFilter = THREE.LinearFilter;
      atlasTexture.magFilter = THREE.LinearFilter;

      const geometry = new THREE.BoxGeometry(
        pageWidth,
        pageHeight,
        pageThickness,
        50,
        50,
        1
      );

      material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        uniforms: {
          uProgress: { value: 1 },
          uSplitProgress: { value: 1 },
          uPageThickness: { value: pageThickness },
          uPageWidth: { value: pageWidth },
          uPageHeight: { value: pageHeight },
          uMeshCount: { value: meshCount },
          uTime: { value: 0 },
          uAtlas: { value: atlasTexture },
          uScrollY: { value: 0 },
          uSpeedY: { value: 0 },
          uScrollCurve: { value: scrollCurve },
          uPageSpacing: { value: 1 },
          uCenterSpacing: { value: 0 },
          uFocusRotationX: { value: 0 },
          uFocusRotationY: { value: 0 },
          uFocusRotationZ: { value: 0 },
          uPicking: { value: 0 },
          uHoverIndex: { value: -1 },
          uHoverLift: { value: 0 },
          uHoverIndexOut: { value: -1 },
          uHoverLiftOut: { value: 0 },
          uCurrentPage: { value: 0 },
          uMaxX: { value: 0 },
        },
      });

      instancedMesh = new THREE.InstancedMesh(geometry, material, meshCount);
      const texCoords = new Float32Array(meshCount * 4);
      const aspects = new Float32Array(meshCount);
      const indices = new Float32Array(meshCount);

      const dummy = new THREE.Object3D();
      for (let i = 0; i < meshCount; i++) {
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
        const pIdx = wrapProjectIndex(i);
        const uv = uvEntries[pIdx];
        texCoords[i * 4 + 0] = uv.uvs.xStart;
        texCoords[i * 4 + 1] = uv.uvs.xEnd;
        texCoords[i * 4 + 2] = uv.uvs.yStart;
        texCoords[i * 4 + 3] = uv.uvs.yEnd;
        aspects[i] = uv.aspectRatio;
        indices[i] = i;
      }

      instancedMesh.geometry.setAttribute(
        "aTextureCoords",
        new THREE.InstancedBufferAttribute(texCoords, 4)
      );
      instancedMesh.geometry.setAttribute(
        "aIndex",
        new THREE.InstancedBufferAttribute(indices, 1)
      );
      instancedMesh.geometry.setAttribute(
        "aImageAspect",
        new THREE.InstancedBufferAttribute(aspects, 1)
      );

      instancedMesh.position.set(posX, posY, posZ);
      instancedMesh.rotation.set(-0.0215, 2.2884, 0.2884);
      group.add(instancedMesh);

      const initialScroll = findNearestScrollForProject(0, 0);
      scrollState.target = initialScroll;
      scrollState.current = initialScroll;
      material.uniforms.uScrollY.value = initialScroll;

      // Run signature intro fan-out sequence (op() in huyml.co)
      introPlaying = true;
      const introDelta =
        findNearestScrollForProject(0, scrollState.target + 19) - scrollState.target;
      let prevEase = 0;
      const startTime = gsap.ticker.time;

      const introTick = () => {
        if (!material || disposed) return;
        const elapsed = gsap.ticker.time - startTime;
        const progress = Math.min(elapsed / 1.85, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const step = (eased - prevEase) * introDelta;
        prevEase = eased;
        if (step > 0) {
          scrollState.target += step;
          material.uniforms.uSpeedY.value += step;
        }
        if (progress >= 1) {
          gsap.ticker.remove(introTick);
          material.uniforms.uSpeedY.value = 0;
          introPlaying = false;
          spacingExpanded = true;
          snapEnabled = true;
          baseSnapOrigin = getSnapTarget(scrollState.target);
          scrollState.target = baseSnapOrigin;
          emitCenterState(getClosestInstance(scrollState.target), true);
        }
      };

      gsap.ticker.add(introTick);
      gsap.to(material.uniforms.uCenterSpacing, {
        value: centerSpacingTarget,
        duration: 1.1,
        delay: 0.9,
        ease: "power2.out",
      });
      gsap.to(material.uniforms.uFocusRotationX, {
        value: focusRotX,
        duration: 1.1,
        delay: 0.9,
        ease: "power2.out",
      });
      gsap.to(material.uniforms.uFocusRotationY, {
        value: focusRotY,
        duration: 1.1,
        delay: 0.9,
        ease: "power2.out",
      });
      gsap.to(material.uniforms.uFocusRotationZ, {
        value: focusRotZ,
        duration: 1.1,
        delay: 0.9,
        ease: "power2.out",
      });
    };

    loadAtlasAndInit();

    // Event listeners
    const onWheel = (e: WheelEvent) => {
      if (!activePageRef.current || introPlaying || !material) return;
      e.preventDefault();
      expandSpacingIfNeeded();

      const scaleFactor = Math.min(
        1,
        1512 / Math.max(1, window.innerWidth),
        982 / Math.max(1, window.innerHeight)
      );
      const isTrackpad =
        e.deltaMode === 0 && (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) < 24);
      const rawDelta =
        (e.deltaY * viewHeight) / Math.max(1, window.innerHeight) * scaleFactor;
      const stepDelta = isTrackpad
        ? gsap.utils.clamp(-0.14, 0.14, rawDelta * 0.42)
        : Math.sign(rawDelta) *
          gsap.utils.clamp(1, 3, Math.round(Math.abs(rawDelta)));

      wheeling = true;
      if (wheelTimeout) window.clearTimeout(wheelTimeout);

      if (isTrackpad) {
        pendingWheel = 0;
        smoothingWheel = false;
        scrollState.target += stepDelta;
        material.uniforms.uSpeedY.value += stepDelta;
        wheelTimeout = window.setTimeout(() => {
          wheeling = false;
          scrollState.target = getSnapTarget(scrollState.target);
        }, 220);
      } else {
        pendingWheel += stepDelta;
        smoothingWheel = true;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!activePageRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      mouseNormalized.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNormalized.y = -(((e.clientY - rect.top) / rect.height) * 2) + 1;
      pointerClient.x = e.clientX;
      pointerClient.y = e.clientY;
    };

    const onClick = (e: MouseEvent) => {
      if (!activePageRef.current || introPlaying || !material) return;
      // Ignore clicks on UI buttons/links
      const targetEl = e.target as HTMLElement | null;
      if (targetEl && targetEl.closest("button, a, [data-ui-interactive='true']")) {
        return;
      }

      let picked = samplePick1x1(e.clientX, e.clientY);
      if (picked < 0 && pickBuffer64) {
        picked = samplePick64(e.clientX, e.clientY);
      }
      if (picked < 0) return;

      const centerInst = getClosestInstance();
      const centerProjIdx = wrapProjectIndex(centerInst);
      const pickedProjIdx = wrapProjectIndex(picked);

      if (picked === centerInst || pickedProjIdx === centerProjIdx) {
        onSelectProjectRef.current(projects[pickedProjIdx]);
      } else {
        scrollToInstance(picked);
      }
    };

    let touchActive = false;
    let lastTouchX = 0;
    let lastTouchY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (!activePageRef.current || introPlaying || !e.touches.length) return;
      touchActive = true;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!activePageRef.current || !touchActive || !material || !e.touches.length)
        return;
      const dx = lastTouchX - e.touches[0].clientX;
      const dy = lastTouchY - e.touches[0].clientY;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
      const primary = Math.abs(dy) > Math.abs(dx) ? dy : dx;
      const delta = gsap.utils.clamp(
        -0.22,
        0.22,
        (primary / Math.max(1, window.innerHeight)) * 8
      );
      expandSpacingIfNeeded();
      scrollState.target += delta;
      material.uniforms.uSpeedY.value += delta;
    };

    const onTouchEnd = () => {
      if (!touchActive) return;
      touchActive = false;
      scrollState.target = getSnapTarget(scrollState.target);
    };

    const onExternalScroll = (e: Event) => {
      const custom = e as CustomEvent<{ delta?: number; targetIndex?: number }>;
      if (!material || introPlaying) return;
      if (typeof custom.detail?.targetIndex === "number") {
        expandSpacingIfNeeded();
        scrollState.target = findNearestScrollForProject(
          custom.detail.targetIndex,
          scrollState.target
        );
        return;
      }
      const delta = Number(custom.detail?.delta);
      if (!Number.isFinite(delta) || delta === 0) return;
      externalDragging = true;
      expandSpacingIfNeeded();
      scrollState.target += delta;
      material.uniforms.uSpeedY.value += delta * 0.4;
    };

    const onExternalScrollEnd = () => {
      if (!material || introPlaying) return;
      externalDragging = false;
      scrollState.target = getSnapTarget(scrollState.target);
    };

    const onResize = () => {
      size = getSize();
      const newAspect = size.width / size.height;
      camera.left = (viewHeight * newAspect) / -2;
      camera.right = (viewHeight * newAspect) / 2;
      camera.top = viewHeight / 2;
      camera.bottom = viewHeight / -2;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(size.pixelRatio);
      renderer.setSize(size.width, size.height);
    };

    // Main render loop
    const animate = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(animate);

      if (!material || !instancedMesh) {
        renderer.render(scene, camera);
        return;
      }

      material.uniforms.uTime.value = clock.getElapsedTime();

      if (smoothingWheel && !introPlaying) {
        const step = pendingWheel * 0.085;
        pendingWheel -= step;
        if (Math.abs(pendingWheel) < 0.001) {
          smoothingWheel = false;
          pendingWheel = 0;
          if (wheelTimeout) window.clearTimeout(wheelTimeout);
          wheelTimeout = window.setTimeout(() => {
            wheeling = false;
            scrollState.target = getSnapTarget(scrollState.target);
          }, 150);
        }
        scrollState.target += step;
        material.uniforms.uSpeedY.value += step;
      }

      mouseSmoothed.lerp(mouseNormalized, 0.05);
      group.rotation.y = mouseSmoothed.x * 0.05;

      scrollState.current = gsap.utils.interpolate(
        scrollState.current,
        scrollState.target,
        externalDragging ? 0.12 : 0.052
      );

      if (
        snapEnabled &&
        !introPlaying &&
        !wheeling &&
        !externalDragging &&
        !touchActive &&
        Math.abs(scrollState.target - scrollState.current) < 0.008
      ) {
        scrollState.current = scrollState.target;
      }

      material.uniforms.uScrollY.value = scrollState.current;
      material.uniforms.uSpeedY.value *= externalDragging ? 0.72 : 0.829;

      if (!introPlaying) {
        emitCenterState(
          getClosestInstance(
            externalDragging ? scrollState.target : scrollState.current
          )
        );
      }

      camera.lookAt(lookTarget);
      renderer.render(scene, camera);

      if (!activePageRef.current || introPlaying) return;

      frameCounter++;
      if (frameCounter % 3 === 0) {
        renderPick64();
      }
      if (pickBuffer64 && pointerClient.x >= 0) {
        const picked = samplePick64(pointerClient.x, pointerClient.y);
        if (picked >= 0) {
          hoverMissCount = 0;
          lastHoverPos = { x: pointerClient.x, y: pointerClient.y };
          updateHoverState(picked);
          renderer.domElement.style.cursor = "pointer";
        } else {
          if (hoveredInstance >= 0 && lastHoverPos) {
            const dx = pointerClient.x - lastHoverPos.x;
            const dy = pointerClient.y - lastHoverPos.y;
            if (dx * dx + dy * dy <= 1296) {
              hoverMissCount = 0;
              return;
            }
          }
          hoverMissCount++;
          if (hoverMissCount >= 5) {
            lastHoverPos = null;
            updateHoverState(-1);
            renderer.domElement.style.cursor = "default";
          }
        }
      }
    };

    animate();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("webgl-magazine:external-scroll", onExternalScroll);
    window.addEventListener(
      "webgl-magazine:external-scroll-end",
      onExternalScrollEnd
    );

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (wheelTimeout) window.clearTimeout(wheelTimeout);
      resizeObserver.disconnect();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("webgl-magazine:external-scroll", onExternalScroll);
      window.removeEventListener(
        "webgl-magazine:external-scroll-end",
        onExternalScrollEnd
      );
      instancedMesh?.geometry.dispose();
      material?.dispose();
      atlasTexture?.dispose();
      pickTarget1x1.dispose();
      pickTarget64.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [projects, introReady]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-auto z-[2]"
    />
  );
};
