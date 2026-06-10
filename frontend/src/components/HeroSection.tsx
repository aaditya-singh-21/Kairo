import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// The 3-phase loop animation: prompt → wireframe → photo
function VisualLoop() {
  const [phase, setPhase] = useState<'prompt' | 'wireframe' | 'photo'>('prompt');
  const [typedText, setTypedText] = useState('');
  const [charIdx, setCharIdx] = useState(0);
  const prompt = 'A minimal portfolio for a product designer with a dark hero section and grid layout';

  // Typing effect for prompt phase
  useEffect(() => {
    if (phase !== 'prompt') return;
    if (charIdx < prompt.length) {
      const t = setTimeout(() => {
        setTypedText(prompt.slice(0, charIdx + 1));
        setCharIdx((i) => i + 1);
      }, 28);
      return () => clearTimeout(t);
    } else {
      // Switch to wireframe after pause
      const t = setTimeout(() => setPhase('wireframe'), 900);
      return () => clearTimeout(t);
    }
  }, [phase, charIdx]);

  // Wireframe → photo → prompt loop
  useEffect(() => {
    if (phase === 'wireframe') {
      const t = setTimeout(() => setPhase('photo'), 2200);
      return () => clearTimeout(t);
    }
    if (phase === 'photo') {
      const t = setTimeout(() => {
        setPhase('prompt');
        setTypedText('');
        setCharIdx(0);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <div className="relative w-full h-full bg-paper border border-pitch-10 overflow-hidden">
      {/* Coord labels */}
      <div className="absolute top-3 left-3 font-mono text-[9px] text-pitch-40">
        X: 240 Y: 120
      </div>
      <div className="absolute top-3 right-3 font-mono text-[9px] text-pitch-40">
        {phase === 'prompt' ? 'INTENT' : phase === 'wireframe' ? 'ARCHITECTURE' : 'REALITY'}
      </div>

      {/* PHASE 1: Prompt text */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center p-6"
        animate={{ opacity: phase === 'prompt' ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-[10px] text-pitch-40 mb-2 uppercase tracking-widest">
          → Generating from prompt
        </p>
        <p className="font-mono text-sm text-pitch leading-relaxed">
          "{typedText}
          <span className="blink-cursor" />
          "
        </p>
      </motion.div>

      {/* PHASE 2: Wireframe SVG */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center p-6"
        animate={{ opacity: phase === 'wireframe' ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <svg viewBox="0 0 280 200" className="w-full max-w-[280px]" fill="none">
          {/* Nav bar */}
          <motion.rect x="0" y="0" width="280" height="22" stroke="#0A0A0A" strokeWidth="0.7"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0 }} />
          <motion.line x1="10" y1="11" x2="50" y2="11" stroke="#0A0A0A" strokeWidth="0.7"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.3 }} />
          <motion.line x1="210" y1="11" x2="270" y2="11" stroke="#0044FF" strokeWidth="0.7"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.4 }} />

          {/* Hero block */}
          <motion.rect x="0" y="28" width="280" height="80" stroke="#0A0A0A" strokeWidth="0.7"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }} />
          <motion.line x1="10" y1="50" x2="180" y2="50" stroke="#0A0A0A" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }} />
          <motion.line x1="10" y1="62" x2="120" y2="62" stroke="#0A0A0A" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.6 }} />
          <motion.rect x="10" y="76" width="60" height="14" stroke="#0A0A0A" strokeWidth="0.7"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.7 }} />

          {/* Grid cards */}
          {[0, 95, 190].map((x, i) => (
            <motion.rect key={i} x={x} y="116" width="82" height="56" stroke="#0A0A0A" strokeWidth="0.7"
              initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }} />
          ))}

          {/* Diagonal cross lines in hero */}
          <motion.line x1="0" y1="28" x2="280" y2="108" stroke="#0A0A0A" strokeWidth="0.3" strokeDasharray="4 4"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.9 }} />
          <motion.line x1="280" y1="28" x2="0" y2="108" stroke="#0A0A0A" strokeWidth="0.3" strokeDasharray="4 4"
            initial={{ pathLength: 0 }} animate={{ pathLength: phase === 'wireframe' ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.9 }} />
        </svg>
        <p className="font-mono text-[9px] text-pitch-40 mt-2 tracking-widest uppercase">
          Layout bounding boxes generated
        </p>
      </motion.div>

      {/* PHASE 3: Simulated website photo */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: phase === 'photo' ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Faux high-fidelity website render */}
        <div className="w-full h-full bg-pitch flex flex-col">
          {/* Nav */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="w-16 h-1.5 bg-white/60 rounded" />
            <div className="flex gap-3">
              <div className="w-8 h-1 bg-white/30 rounded" />
              <div className="w-8 h-1 bg-white/30 rounded" />
              <div className="w-12 h-5 bg-white border border-white/50 rounded-sm" />
            </div>
          </div>
          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center px-5 py-4">
            <div className="w-4/5 h-3 bg-white/90 rounded mb-2" />
            <div className="w-3/5 h-3 bg-white/90 rounded mb-4" />
            <div className="w-1/3 h-1.5 bg-white/40 rounded mb-6" />
            <div className="w-20 h-6 border border-white/80" />
          </div>
          {/* Cards */}
          <div className="grid grid-cols-3 gap-1 px-3 pb-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 border border-white/10 p-2 rounded-sm">
                <div className="w-full h-8 bg-white/20 mb-1 rounded-sm" />
                <div className="w-3/4 h-1 bg-white/30 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-3 right-3 font-mono text-[9px] text-pitch-40 bg-paper px-2 py-1">
          HIGH FIDELITY OUTPUT
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen grid-bg flex flex-col justify-end pb-0 overflow-hidden pt-14"
      id="product"
    >
      {/* Blueprint corner marks */}
      <div className="absolute top-16 left-8 w-4 h-4 border-t border-l border-pitch-40" />
      <div className="absolute top-16 right-8 w-4 h-4 border-t border-r border-pitch-40" />

      {/* Coordinate metadata */}
      <div className="absolute top-20 left-8 font-mono text-[10px] text-pitch-40 mt-2">
        SEC.01 / HERO
      </div>
      <div className="absolute top-20 right-8 font-mono text-[10px] text-pitch-40 mt-2">
        X: 0000 Y: 0000
      </div>

      <div className="max-w-[1440px] mx-auto px-8 w-full">
        <div className="grid grid-cols-12 gap-6 items-end min-h-[calc(100vh-56px)]">

          {/* Left: Headline */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-end pb-16">
            <motion.p
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-blueprint mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ↳ AI Website Generator
            </motion.p>

            <div className="overflow-hidden">
              <motion.h1
                className="hero-headline"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              >
                Speak it.
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="hero-headline"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              >
                See it.
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="hero-headline text-pitch-40"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
              >
                Ship it.
              </motion.h1>
            </div>

            <motion.p
              className="font-sans text-base text-pitch-40 max-w-md mt-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Kairo translates your natural language into complete, production-ready websites —
              structured, styled, and deployable in seconds.
            </motion.p>

            <motion.div
              className="flex items-center gap-4 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <a href="/dashboard" className="btn-swiss">
                <span>Start Building →</span>
              </a>
              <a href="#process" className="btn-swiss btn-blueprint">
                <span>See the Process</span>
              </a>
            </motion.div>

            {/* Metrics row */}
            <motion.div
              className="flex items-center gap-8 mt-12 border-t border-pitch-10 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              {[
                { value: '< 8s', label: 'Generation time' },
                { value: '100%', label: 'Production ready' },
                { value: '∞', label: 'Iterations' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="font-sans text-2xl font-black tracking-tight text-pitch">
                    {m.value}
                  </div>
                  <div className="font-mono text-[10px] text-pitch-40 uppercase tracking-widest mt-0.5">
                    {m.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: The 3-phase visual loop */}
          <motion.div
            className="col-span-12 lg:col-span-5 flex flex-col justify-end pb-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Frame label */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-pitch-40 uppercase tracking-widest">
                Live Preview
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blueprint animate-pulse" />
                <span className="font-mono text-[10px] text-blueprint">Generating</span>
              </div>
            </div>

            <div className="aspect-[4/3] border border-pitch-10 shadow-sm">
              <VisualLoop />
            </div>

            {/* Bottom scale ruler */}
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-[9px] text-pitch-40">0</span>
              <div className="flex-1 mx-2 h-px bg-pitch-10 relative">
                {[25, 50, 75].map((p) => (
                  <div
                    key={p}
                    className="absolute top-0 w-px h-1.5 bg-pitch-40 -translate-y-full"
                    style={{ left: `${p}%` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] text-pitch-40">100</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="font-mono text-[10px] text-pitch-40 uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-px h-10 bg-pitch-40 origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
