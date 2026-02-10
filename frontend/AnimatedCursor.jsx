import React, { useState, useEffect, useRef } from 'react';

const LERP = 0.12;

export default function AnimatedCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    const move = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!hasMoved.current) {
        hasMoved.current = true;
        setVisible(true);
      }
    };
    const over = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea');
      setHover(!!el);
    };
    const out = (e) => {
      const still = e.relatedTarget?.closest('a, button, [role="button"], input, textarea');
      setHover(!!still);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);

    const tick = () => {
      const t = target.current;
      setPos((prev) => ({
        x: prev.x + (t.x - prev.x) * LERP,
        y: prev.y + (t.y - prev.y) * LERP,
      }));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      className={`cursor-smooth ${hover ? 'cursor-smooth--hover' : ''} ${visible ? 'cursor-smooth--visible' : ''}`}
      style={{
        left: pos.x,
        top: pos.y,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden
    />
  );
}
