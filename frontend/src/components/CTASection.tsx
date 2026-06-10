import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="bg-pitch relative overflow-hidden" id="cta">
      {/* Subtle grid on dark */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(244,244,242,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,242,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Blueprint accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-blueprint opacity-60" />

      <div className="max-w-[1440px] mx-auto px-8 py-32 relative z-10">
        <div className="grid grid-cols-12 gap-6">

          {/* Left: Massive CTA text */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              className="font-mono text-[10px] text-blueprint uppercase tracking-[0.2em] mb-8 flex items-center gap-3"
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}
            >
              <span className="w-3 h-px bg-blueprint" />
              Ready when you are
            </motion.div>

            <div className="overflow-hidden mb-3">
              <motion.h2
                className="font-sans font-black text-paper"
                style={{ fontSize: 'clamp(56px, 7vw, 120px)', letterSpacing: '-0.06em', lineHeight: 0.92 }}
                initial={{ y: '100%' }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              >
                Build your
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-3">
              <motion.h2
                className="font-sans font-black text-paper"
                style={{ fontSize: 'clamp(56px, 7vw, 120px)', letterSpacing: '-0.06em', lineHeight: 0.92 }}
                initial={{ y: '100%' }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              >
                vision today.
              </motion.h2>
            </div>

            <motion.p
              className="font-sans text-base text-paper/40 max-w-md mt-8 leading-relaxed"
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
            >
              No card required. No friction. Just describe what you want, and Kairo builds it.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 mt-10"
              initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {/* Inverted swiss button for dark bg */}
              <a
                href="/dashboard"
                className="relative inline-flex items-center justify-center border border-paper px-8 py-4 font-mono text-[11px] tracking-[0.08em] uppercase text-paper overflow-hidden group"
              >
                <span
                  className="absolute inset-0 bg-paper transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
                />
                <span className="relative z-10 group-hover:text-pitch transition-colors duration-500">
                  Start for free →
                </span>
              </a>

              <a
                href="/signin"
                className="font-mono text-[11px] tracking-[0.08em] uppercase text-paper/40 hover:text-paper transition-colors duration-200"
              >
                Sign in
              </a>
            </motion.div>
          </div>

          {/* Right: Specs / metadata panel */}
          <motion.div
            className="col-span-12 lg:col-span-4 flex flex-col justify-end"
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
          >
            <div className="border border-paper/10 p-6">
              <div className="font-mono text-[10px] text-paper/30 uppercase tracking-widest mb-6">
                SPEC SHEET
              </div>
              {[
                { k: 'Generation engine', v: 'Gemini / Groq' },
                { k: 'Avg. generation', v: '< 8 seconds' },
                { k: 'Output format', v: 'HTML + CSS + JS' },
                { k: 'Version control', v: 'Built-in' },
                { k: 'Credits on signup', v: 'Free tier' },
              ].map(({ k, v }) => (
                <div key={k} className="flex items-center justify-between py-3 border-b border-paper/5 last:border-0">
                  <span className="font-mono text-[11px] text-paper/40">{k}</span>
                  <span className="font-mono text-[11px] text-paper">{v}</span>
                </div>
              ))}
            </div>

            {/* Bottom coordinate stamp */}
            <div className="flex items-center justify-between mt-4">
              <span className="font-mono text-[9px] text-paper/20">LAT: 28.6139° N</span>
              <span className="font-mono text-[9px] text-paper/20">LNG: 77.2090° E</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Large background text */}
      <div
        className="absolute bottom-0 right-0 font-sans font-black text-paper pointer-events-none select-none"
        style={{
          fontSize: 'clamp(120px, 18vw, 320px)',
          letterSpacing: '-0.08em',
          lineHeight: 0.8,
          opacity: 0.03,
        }}
      >
        KAIRO
      </div>
    </section>
  );
}
