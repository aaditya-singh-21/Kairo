import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navbar() {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => {
      if (navRef.current) {
        navRef.current.style.borderBottomColor = `rgba(10,10,10,${Math.min(v / 100, 0.12)})`;
      }
    });
    return unsub;
  }, [scrollY]);

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-paper border-b border-transparent"
      style={{ borderBottomColor: borderOpacity as unknown as string }}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 border border-pitch" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blueprint -translate-x-1/2 -translate-y-1/2" />
          </div>
          <span className="font-mono text-xs font-600 tracking-[0.15em] uppercase text-pitch">
            Kairo
          </span>
          <span className="font-mono text-[10px] text-pitch-40 ml-1">v0.1</span>
        </div>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Product', 'Process', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-mono text-[11px] tracking-[0.1em] uppercase text-pitch-40 hover:text-pitch transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a href="/signin" className="font-mono text-[11px] tracking-[0.1em] uppercase text-pitch-40 hover:text-pitch transition-colors">
            Sign In
          </a>
          <a href="/dashboard" className="btn-swiss text-[11px] py-2.5 px-5">
            <span>Get Access</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
