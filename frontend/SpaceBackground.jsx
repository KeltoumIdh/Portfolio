import React, { useMemo } from 'react';

const STAR_COUNT = 60;

// Toggle: 'gradient' = AI/tech gradient mesh | 'cosmic' = original planets + space
const BACKGROUND_MODE = 'gradient';

function SpaceBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 2,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 2,
    }));
  }, []);

  return (
    <div
      className={`space-background space-background--${BACKGROUND_MODE}`}
      aria-hidden
    >
      {/* Gradient mesh layers (AI/tech style) */}
      <div className="bg-mesh bg-mesh-1" />
      <div className="bg-mesh bg-mesh-2" />
      <div className="bg-mesh bg-mesh-3" />
      <div className="bg-mesh-dots" aria-hidden />

      {/* Twinkling stars (subtle, works with both modes) */}
      <div className="stars-layer">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default SpaceBackground;
