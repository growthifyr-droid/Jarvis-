import React, { useRef, useEffect, useState } from 'react';
import { Video, Phone, MicOff, Radio, Cpu, Volume2, Mic } from 'lucide-react';

export type CoreState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseBrightness: number;
  isInnerWhiteCandidate: boolean;
}

interface NeuralHarmonicCoreProps {
  currentState?: CoreState;
  onStateChange?: (state: CoreState) => void;
}

export const NeuralHarmonicCore: React.FC<NeuralHarmonicCoreProps> = ({
  currentState: externalState,
  onStateChange,
}) => {
  const [internalState, setInternalState] = useState<CoreState>('idle');
  const activeState = externalState || internalState;

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleStateSelect = (state: CoreState) => {
    setInternalState(state);
    if (onStateChange) onStateChange(state);
  };

  // Generate a single, uniform, mathematically perfect 3D Fibonacci sphere point cloud
  // All points lie strictly on unit sphere: x^2 + y^2 + z^2 = 1 (No inner secondary cluster)
  const pointsRef = useRef<Point3D[]>([]);
  useEffect(() => {
    const points: Point3D[] = [];
    const count = 1200;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // -1 to +1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Deterministic candidate flag for white dots near the center of the sphere
      // Provides a rich, beautiful white dot presence in the inner circular region while keeping green majority overall
      const isInnerWhiteCandidate = Math.random() < 0.65;

      points.push({
        x,
        y,
        z,
        baseBrightness: 0.60 + Math.random() * 0.40,
        isInnerWhiteCandidate,
      });
    }

    pointsRef.current = points;
  }, []);

  // Canvas animation loop with guaranteed 100% true circular projection & zero aspect distortion
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotY = 0;
    let rotX = 0.05;
    let time = 0;

    const render = () => {
      time += 0.016;

      // Correct DPR scaling: Always sync canvas width & height with its bounding client dimensions
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetWidth = Math.max(1, Math.round(rect.width * dpr));
      const targetHeight = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // 100% Mathematically Perfect Circle:
      // Center is strictly at (w / 2, h / 2)
      // Radius is strictly derived from the minimum dimension with equal aspect ratio (expanded to 0.94 for larger globe presence)
      const centerX = w / 2;
      const centerY = h / 2;
      const minDimension = Math.min(w, h);
      const sphereRadius = (minDimension / 2) * 0.94;

      // State-specific animation speeds & modulations (deliberate, smooth, never frantic)
      let speedY = 0.0020;
      let speedX = 0.0004;
      let innerPulse = 0;

      switch (activeState) {
        case 'idle':
          speedY = 0.0018;
          speedX = 0.0003;
          innerPulse = Math.sin(time * 1.4) * 0.04;
          break;

        case 'listening':
          speedY = 0.0026;
          speedX = 0.0005;
          innerPulse = Math.sin(time * 2.4) * 0.08;
          break;

        case 'thinking':
          speedY = 0.0038;
          speedX = 0.0010;
          innerPulse = Math.sin(time * 3.0) * 0.10;
          break;

        case 'speaking':
          // Harmonic wave resonance: sphereRadius remains 100% constant!
          speedY = 0.0028;
          speedX = 0.0006;
          innerPulse = Math.sin(time * 2.8) * 0.15;
          break;
      }

      rotY += speedY;
      rotX += speedX;

      // 1. Central Core Glow (Gentle ambient green aura in center)
      const coreRadius = sphereRadius * (0.22 + innerPulse * 0.15);
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        1,
        centerX,
        centerY,
        coreRadius
      );
      coreGradient.addColorStop(0, 'rgba(0, 242, 161, 0.28)');
      coreGradient.addColorStop(0.45, 'rgba(0, 242, 161, 0.06)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Central Beacon Node (Crisp white center dot with soft green aura)
      const beaconGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        6 * dpr
      );
      beaconGlow.addColorStop(0, '#ffffff');
      beaconGlow.addColorStop(0.5, '#00f2a1');
      beaconGlow.addColorStop(1, 'rgba(0, 242, 161, 0)');

      ctx.fillStyle = beaconGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Central solid core dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2.2 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // 3. 3D Spherical Orthogonal Projection:
      // Rotations around Y and X axes
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const points = pointsRef.current;
      const transformed: Array<{
        px: number;
        py: number;
        pz: number;
        size: number;
        alpha: number;
        isWhite: boolean;
      }> = [];

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];

        // Rotate Y
        const x1 = pt.x * cosY + pt.z * sinY;
        const y1 = pt.y;
        const z1 = -pt.x * sinY + pt.z * cosY;

        // Rotate X
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // True 1:1 Orthogonal projection onto screen:
        // x2 and y2 are unit sphere coordinates (-1 to 1) multiplied equally by sphereRadius
        const screenX = centerX + x2 * sphereRadius;
        const screenY = centerY + y2 * sphereRadius;

        // Depth sorting: z2 ranges from -1 (back) to +1 (front)
        const depth = (z2 + 1) / 2; // 0 to 1
        const alpha = Math.max(0.18, Math.min(0.96, depth * 0.80 + 0.18));
        const dotSize = Math.max(0.9 * dpr, (0.85 + depth * 1.5) * dpr);

        // Color logic as requested:
        // Inner circular region contains white dots + green dots
        // Outer region is 100% emerald green dots!
        // Green dots remain the majority overall, with an increased, balanced presence of white dots inside the center area
        const dist2D = Math.hypot(x2, y2);
        const isWhite = dist2D < 0.45 && pt.isInnerWhiteCandidate && z2 > -0.55;

        transformed.push({
          px: screenX,
          py: screenY,
          pz: z2,
          size: dotSize,
          alpha: alpha * pt.baseBrightness,
          isWhite,
        });
      }

      // Sort back-to-front for clean depth rendering
      transformed.sort((a, b) => a.pz - b.pz);

      // Render dots: ONLY pure white and pure emerald green
      for (let i = 0; i < transformed.length; i++) {
        const p = transformed[i];
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2);

        if (p.isWhite) {
          // Pure crisp white dots in inner region
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, p.alpha * 1.15)})`;
        } else {
          // Vibrant emerald green dots
          ctx.fillStyle = `rgba(0, 242, 161, ${p.alpha})`;
        }
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeState]);

  return (
    <section
      id="neural-harmonic-core-section"
      className="flex-1 flex flex-col items-center justify-between bg-[#060709] select-none py-3 sm:py-4 px-3 sm:px-6 overflow-hidden relative"
    >
      {/* Top Header Row */}
      <div className="w-full flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b0d11] border border-[#171b22]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2a1]" />
          <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#8c96a5]">
            NEURAL HARMONIC CORE
          </span>
        </div>

        <div className="font-mono text-xs font-bold tracking-widest text-[#00f2a1] flex items-center gap-1.5">
          <span className="text-[#5a6575] font-medium text-[10px] sm:text-xs">STATE:</span>
          <span className="uppercase text-[10px] sm:text-xs">{activeState}</span>
        </div>
      </div>

      {/* Center Globe Stage: Pure 100% round circular particle globe */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative w-full my-0.5 overflow-hidden"
      >
        <div
          id="jarvis-globe-stage"
          className="relative aspect-square w-[400px] h-[400px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] lg:w-[640px] lg:h-[640px] xl:w-[720px] xl:h-[720px] max-w-[92vw] max-h-[66vh] flex items-center justify-center"
        >
          {/* Canvas maintains exact 100% circular particle globe */}
          <canvas
            ref={canvasRef}
            className="w-full h-full aspect-square pointer-events-none block"
          />
        </div>
      </div>

      {/* Bottom Control Cluster: Action Buttons + Mode Switcher with balanced premium spacing */}
      <div
        id="bottom-control-cluster"
        className="flex flex-col items-center gap-3.5 sm:gap-4 z-20 flex-shrink-0 pb-1"
      >
        {/* The 3 Symmetrical Squircle Action Buttons (Video, Call, Mic) */}
        <div id="floating-call-controls" className="flex items-center gap-3">
          {/* Video Toggle Button */}
          <button
            id="btn-toggle-video"
            onClick={() => setIsVideoActive(!isVideoActive)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
              isVideoActive
                ? 'bg-[#0f1d19] border-[#00f2a1]/60 text-[#00f2a1]'
                : 'bg-[#0d1015] border-[#1b2029] text-[#8c96a5] hover:text-white hover:border-[#28313f]'
            }`}
            title="Toggle Video Stream"
          >
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Main Call Action Button (Symmetrical Squircle, not stretched wide) */}
          <button
            id="btn-main-call-action"
            onClick={() => setIsCallActive(!isCallActive)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer font-bold ${
              isCallActive
                ? 'bg-[#00f2a1] text-[#06080b] shadow-[0_0_18px_rgba(0,242,161,0.45)] hover:scale-105'
                : 'bg-[#ef4444] text-white shadow-[0_0_14px_rgba(239,68,68,0.4)] hover:scale-105'
            }`}
            title={isCallActive ? 'Channel Active' : 'Reconnect Channel'}
          >
            <Phone className="w-5 h-5 fill-current" />
          </button>

          {/* Mute Toggle Button */}
          <button
            id="btn-toggle-mute"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
              isMuted
                ? 'bg-[#201010] border-[#ef4444]/60 text-[#ef4444]'
                : 'bg-[#0d1015] border-[#1b2029] text-[#8c96a5] hover:text-white hover:border-[#28313f]'
            }`}
            title="Toggle Microphone"
          >
            {isMuted ? (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* Mode Switcher Pill with balanced premium spacing directly below the 3 buttons */}
        <div
          id="mode-switcher-pill"
          className="flex items-center gap-1 bg-[#0b0d11] p-1 rounded-full border border-[#171b22] shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
        >
          {/* Idle */}
          <button
            id="mode-btn-idle"
            onClick={() => handleStateSelect('idle')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              activeState === 'idle'
                ? 'bg-[#00f2a1]/15 text-[#00f2a1] border border-[#00f2a1]/40 font-semibold shadow-[0_0_8px_rgba(0,242,161,0.15)]'
                : 'text-[#8c96a5] hover:text-[#c4cad4]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2a1]" />
            <span>Idle</span>
          </button>

          {/* Listening */}
          <button
            id="mode-btn-listening"
            onClick={() => handleStateSelect('listening')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              activeState === 'listening'
                ? 'bg-[#00f2a1]/15 text-[#00f2a1] border border-[#00f2a1]/40 font-semibold shadow-[0_0_8px_rgba(0,242,161,0.15)]'
                : 'text-[#8c96a5] hover:text-[#c4cad4]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Listening</span>
          </button>

          {/* Thinking */}
          <button
            id="mode-btn-thinking"
            onClick={() => handleStateSelect('thinking')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              activeState === 'thinking'
                ? 'bg-[#00f2a1]/15 text-[#00f2a1] border border-[#00f2a1]/40 font-semibold shadow-[0_0_8px_rgba(0,242,161,0.15)]'
                : 'text-[#8c96a5] hover:text-[#c4cad4]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Thinking</span>
          </button>

          {/* Speaking */}
          <button
            id="mode-btn-speaking"
            onClick={() => handleStateSelect('speaking')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              activeState === 'speaking'
                ? 'bg-[#00f2a1]/15 text-[#00f2a1] border border-[#00f2a1]/40 font-semibold shadow-[0_0_8px_rgba(0,242,161,0.15)]'
                : 'text-[#8c96a5] hover:text-[#c4cad4]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Speaking</span>
          </button>
        </div>
      </div>
    </section>
  );
};
