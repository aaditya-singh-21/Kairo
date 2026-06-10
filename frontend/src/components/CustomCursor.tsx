import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      current.current.x = lerp(current.current.x, pos.current.x, 0.12);
      current.current.y = lerp(current.current.y, pos.current.y, 0.12);
      if (cursorRef.current) {
        cursorRef.current.style.left = `${current.current.x}px`;
        cursorRef.current.style.top = `${current.current.y}px`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    const onDown = () => cursorRef.current?.classList.add('cursor-click');
    const onUp = () => cursorRef.current?.classList.remove('cursor-click');

    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"], .btn-swiss, input, label')) {
        cursorRef.current?.classList.add('cursor-hover');
      }
    };
    const onLeave = () => cursorRef.current?.classList.remove('cursor-hover');

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div id="custom-cursor" ref={cursorRef}>
      {/* 36px crosshair — thicker lines, larger center, outer ring for light-bg visibility */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        {/* Subtle outer ring */}
        <circle cx="18" cy="18" r="10" stroke="#0A0A0A" strokeWidth="0.5" strokeOpacity="0.15" />
        {/* Horizontal arms */}
        <line x1="0"  y1="18" x2="13" y2="18" stroke="#0A0A0A" strokeWidth="1.5" />
        <line x1="23" y1="18" x2="36" y2="18" stroke="#0A0A0A" strokeWidth="1.5" />
        {/* Vertical arms */}
        <line x1="18" y1="0"  x2="18" y2="13" stroke="#0A0A0A" strokeWidth="1.5" />
        <line x1="18" y1="23" x2="18" y2="36" stroke="#0A0A0A" strokeWidth="1.5" />
        {/* Blueprint blue center square */}
        <rect x="15" y="15" width="6" height="6" fill="#0044FF" />
      </svg>
    </div>
  );
}
