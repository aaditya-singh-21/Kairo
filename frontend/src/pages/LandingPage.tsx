import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Lenis from 'lenis';

import CustomCursor from '../components/CustomCursor';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import BreakdownSection from '../components/BreakdownSection';
import FeaturesSection from '../components/FeaturesSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function LandingPage() {
  const lenisRef = useRef<Lenis | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Custom crosshair cursor */}
      <CustomCursor />

      {/* Blueprint blue scroll progress bar */}
      <motion.div
        id="scroll-progress"
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[1px] bg-blueprint origin-left z-[9998]"
      />

      {/* Page */}
      <div className="bg-paper">
        <Navbar />
        <HeroSection />
        <BreakdownSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
