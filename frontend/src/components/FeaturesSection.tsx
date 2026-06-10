import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const features = [
  {
    code: 'F.01',
    title: 'Prompt-to-Structure',
    desc: 'Kairo maps semantic intent to precise layout primitives. No templates. No compromise.',
  },
  {
    code: 'F.02',
    title: 'Component Intelligence',
    desc: 'Sections, cards, navigation, and footers emerge from context — not from a drag-and-drop library.',
  },
  {
    code: 'F.03',
    title: 'Production Code',
    desc: 'The output is clean, semantic HTML/CSS/JS ready for any hosting provider.',
  },
  {
    code: 'F.04',
    title: 'Iterative Refinement',
    desc: 'Describe changes in plain language. Kairo applies them surgically without destroying your layout.',
  },
  {
    code: 'F.05',
    title: 'Version History',
    desc: 'Every generation is tracked. Roll back, branch, or compare iterations side by side.',
  },
  {
    code: 'F.06',
    title: 'Multi-model Engine',
    desc: 'Powered by Gemini and Groq with automatic fallback — ensuring 99.9% generation uptime.',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} className="bg-paper border-t border-pitch-10" id="pricing">
      <div className="max-w-[1440px] mx-auto px-8 py-24">

        {/* Header */}
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-6">
            <motion.div
              className="font-mono text-[10px] text-pitch-40 uppercase tracking-[0.2em] mb-4"
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}
            >
              Capabilities / F.01–F.06
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2
                className="font-sans font-black text-pitch"
                style={{ fontSize: 'clamp(36px, 4vw, 64px)', letterSpacing: '-0.05em', lineHeight: 1 }}
                initial={{ y: '100%' }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              >
                Precision-engineered for shipping.
              </motion.h2>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 flex items-end">
            <motion.p
              className="font-sans text-sm text-pitch-40 leading-relaxed"
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
            >
              Every feature is designed around one principle: your idea becomes a website without friction, without compromise.
            </motion.p>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.code}
              className="border border-pitch-10 p-8 hover:bg-pitch-5 transition-colors duration-300 group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              {/* Blueprint corner on hover */}
              <div className="absolute top-0 left-0 w-0 h-0 border-t-0 border-l-0 border-blueprint/0 group-hover:border-t-2 group-hover:border-l-2 group-hover:border-blueprint group-hover:w-8 group-hover:h-8 transition-all duration-300" />

              <div className="font-mono text-[10px] text-blueprint uppercase tracking-[0.2em] mb-4">
                {f.code}
              </div>
              <h3 className="font-sans text-lg font-bold text-pitch tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
                {f.title}
              </h3>
              <p className="font-sans text-sm text-pitch-40 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
