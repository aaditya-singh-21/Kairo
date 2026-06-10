import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface Phase {
  number: string;
  label: string;
  title: string;
  description: string;
  visual: React.ReactNode;
}

function IntentVisual() {
  const prompts = [
    'A SaaS landing page for a productivity app',
    '    with a bold hero, testimonials section,',
    '    pricing cards, and a dark footer.',
  ];
  return (
    <div className="bg-pitch border border-pitch-80 p-6 font-mono text-sm leading-7">
      <div className="text-pitch-40 text-[10px] uppercase tracking-widest mb-4">
        ◈ INPUT PROMPT
      </div>
      {prompts.map((line, i) => (
        <motion.div
          key={i}
          className="text-paper"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ delay: i * 0.2, duration: 0.5 }}
        >
          {i === 0 && <span className="text-blueprint mr-2">$</span>}
          {line}
        </motion.div>
      ))}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-blueprint text-[10px] uppercase tracking-widest">
          Processing intent
        </span>
        <span className="blink-cursor" style={{ background: '#0044FF', height: '0.8em', width: '6px' }} />
      </div>
    </div>
  );
}

function ArchitectureVisual() {
  return (
    <div className="bg-paper border border-pitch-10 p-4 relative overflow-hidden">
      <div className="absolute top-3 left-3 font-mono text-[9px] text-pitch-40 uppercase tracking-widest">
        LAYOUT SCHEMA
      </div>
      <svg viewBox="0 0 320 220" className="w-full" fill="none">
        {/* Full layout wireframe with draw-on animation */}
        {/* Header */}
        <motion.rect x="2" y="18" width="316" height="28" stroke="#0A0A0A" strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0 }} />
        <motion.line x1="12" y1="32" x2="60" y2="32" stroke="#0A0A0A" strokeWidth="1.5"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: false }} transition={{ duration: 0.4, delay: 0.3 }} />
        <motion.rect x="250" y="24" width="58" height="16" stroke="#0044FF" strokeWidth="0.8"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: false }} transition={{ duration: 0.4, delay: 0.5 }} />

        {/* Hero */}
        <motion.rect x="2" y="52" width="316" height="80" stroke="#0A0A0A" strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false }} transition={{ duration: 0.8, delay: 0.4 }} />
        <motion.line x1="12" y1="72" x2="200" y2="72" stroke="#0A0A0A" strokeWidth="3"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: false }} transition={{ duration: 0.5, delay: 0.7 }} />
        <motion.line x1="12" y1="84" x2="140" y2="84" stroke="#0A0A0A" strokeWidth="2"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: false }} transition={{ duration: 0.4, delay: 0.8 }} />
        <motion.rect x="12" y="98" width="60" height="16" stroke="#0A0A0A" strokeWidth="0.8"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: false }} transition={{ duration: 0.3, delay: 0.9 }} />

        {/* Testimonials */}
        {[0, 107, 214].map((x, i) => (
          <motion.rect key={i} x={x + 2} y="140" width="98" height="44" stroke="#0A0A0A" strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 0.5, delay: 1 + i * 0.15 }} />
        ))}

        {/* Footer */}
        <motion.rect x="2" y="192" width="316" height="24" stroke="#0A0A0A" strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false }} transition={{ duration: 0.5, delay: 1.5 }} />

        {/* Blueprint measurement lines */}
        <motion.line x1="320" y1="52" x2="330" y2="52" stroke="#0044FF" strokeWidth="0.5"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: false }} transition={{ delay: 1.2 }} />
        <motion.line x1="320" y1="132" x2="330" y2="132" stroke="#0044FF" strokeWidth="0.5"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: false }} transition={{ delay: 1.3 }} />
      </svg>
    </div>
  );
}

function RealityVisual() {
  return (
    <div className="bg-pitch overflow-hidden border border-pitch relative">
      {/* Nav */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
        <div className="w-14 h-2 bg-white/80 rounded-sm" />
        <div className="flex gap-2">
          <div className="w-6 h-1.5 bg-white/30 rounded-sm" />
          <div className="w-6 h-1.5 bg-white/30 rounded-sm" />
          <div className="w-14 h-5 bg-white border border-white/50" />
        </div>
      </div>
      {/* Hero */}
      <motion.div
        className="px-5 py-6 flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="w-4/5 h-4 bg-white/90 rounded-sm" />
        <div className="w-3/5 h-4 bg-white/90 rounded-sm" />
        <div className="w-2/5 h-2 bg-white/40 rounded-sm mt-1" />
        <div className="w-24 h-7 bg-white mt-2 flex items-center justify-center">
          <div className="w-3/4 h-1.5 bg-pitch/60 rounded-sm" />
        </div>
      </motion.div>
      {/* Cards */}
      <motion.div
        className="grid grid-cols-3 gap-1 px-3 pb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {[0.6, 0.4, 0.5].map((o, i) => (
          <div key={i} className="bg-white/10 border border-white/10 p-2">
            <div className="w-full h-8 mb-1.5 rounded-sm" style={{ background: `rgba(255,255,255,${o})` }} />
            <div className="w-3/4 h-1.5 bg-white/30 rounded-sm mb-1" />
            <div className="w-1/2 h-1 bg-white/20 rounded-sm" />
          </div>
        ))}
      </motion.div>

      {/* Overlay tag */}
      <motion.div
        className="absolute top-2 right-2 bg-blueprint text-paper font-mono text-[9px] px-2 py-1 uppercase tracking-widest"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.8 }}
      >
        Output ready
      </motion.div>
    </div>
  );
}

const phases: Phase[] = [
  {
    number: '01',
    label: 'INTENT',
    title: 'You speak the vision.',
    description: 'Describe your product in plain language. Kairo parses structure, tone, content, and layout intent from your words — not from templates.',
    visual: <IntentVisual />,
  },
  {
    number: '02',
    label: 'ARCHITECTURE',
    title: 'The system draws the bones.',
    description: 'Kairo constructs a layout schema — precise bounding boxes, typographic hierarchy, and component relationships — before a single pixel is rendered.',
    visual: <ArchitectureVisual />,
  },
  {
    number: '03',
    label: 'REALITY',
    title: 'Structure becomes substance.',
    description: 'Each bounding box resolves into real content. Typography, imagery, and interactions are composed with surgical precision, ready to deploy.',
    visual: <RealityVisual />,
  },
];

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <div ref={ref} className="grid grid-cols-12 gap-6 items-center py-20 border-t border-pitch-10 relative">
      {/* Phase number (background) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 font-mono font-black text-[120px] leading-none text-pitch select-none pointer-events-none"
        style={{ opacity: 0.04, letterSpacing: '-0.06em' }}>
        {phase.number}
      </div>

      {/* Text */}
      <div className={`col-span-12 md:col-span-5 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[10px] text-blueprint uppercase tracking-[0.2em] mb-4 flex items-center gap-3"
        >
          <span>SEC.{phase.number}</span>
          <span className="w-8 h-px bg-blueprint" />
          <span>{phase.label}</span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h2
            className="font-sans text-4xl font-black tracking-tight leading-tight text-pitch mb-4"
            style={{ letterSpacing: '-0.04em' }}
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {phase.title}
          </motion.h2>
        </div>

        <motion.p
          className="font-sans text-base text-pitch-40 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {phase.description}
        </motion.p>
      </div>

      {/* Visual */}
      <motion.div
        className={`col-span-12 md:col-span-7 ${index % 2 !== 0 ? 'md:order-1' : ''}`}
        initial={{ opacity: 0, x: index % 2 !== 0 ? -30 : 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 !== 0 ? -30 : 30 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      >
        {phase.visual}
      </motion.div>
    </div>
  );
}

export default function BreakdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ['0%', '100%']);

  return (
    <section ref={sectionRef} className="relative bg-paper" id="process">
      <div className="max-w-[1440px] mx-auto px-8">

        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 pt-24 pb-8">
          <div className="col-span-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-[10px] text-pitch-40 uppercase tracking-[0.2em]">
                The Process
              </span>
              <div className="flex-1 h-px bg-pitch-10" />
              <span className="font-mono text-[10px] text-pitch-40">3 PHASES</span>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                className="font-sans font-black text-pitch"
                style={{ fontSize: 'clamp(40px, 5vw, 80px)', letterSpacing: '-0.05em', lineHeight: 1 }}
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              >
                From language to live.
              </motion.h2>
            </div>
          </div>
        </div>

        {/* Animated progress line */}
        <div className="relative">
          <div className="absolute left-0 top-0 w-px bg-pitch-10 h-full" />
          <motion.div
            className="absolute left-0 top-0 w-px bg-blueprint origin-top"
            style={{ height: lineHeight }}
          />

          {/* Phase cards */}
          <div className="pl-8">
            {phases.map((phase, i) => (
              <PhaseCard key={phase.number} phase={phase} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
