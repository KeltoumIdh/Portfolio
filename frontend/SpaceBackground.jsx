import React, { useMemo } from 'react';

const STAR_COUNT = 80;
const ORBS = [
  { size: 280, x: '10%', y: '20%', delay: 0, duration: 20 },
  { size: 200, x: '85%', y: '60%', delay: -5, duration: 25 },
  { size: 160, x: '70%', y: '15%', delay: -10, duration: 22 },
  { size: 220, x: '25%', y: '75%', delay: -3, duration: 18 },
  { size: 120, x: '90%', y: '85%', delay: -7, duration: 24 },
];

// Cinematic planets: solid (terrestrial) and ringed (gas giant), girly/cosmic palette
const PLANETS = [
  { id: 'p1', size: 140, x: '88%', y: '18%', type: 'ringed', duration: 45, ringDuration: 60, theme: 'mauve' },
  { id: 'p2', size: 85, x: '12%', y: '72%', type: 'solid', duration: 50, theme: 'rose' },
  { id: 'p3', size: 55, x: '75%', y: '78%', type: 'solid', duration: 38, theme: 'blush' },
  { id: 'p4', size: 110, x: '5%', y: '25%', type: 'ringed', duration: 52, ringDuration: 70, theme: 'lavender' },
  { id: 'p5', size: 70, x: '92%', y: '55%', type: 'solid', duration: 42, theme: 'teal' },
  { id: 'p6', size: 45, x: '28%', y: '12%', type: 'solid', duration: 35, theme: 'rose' },
];

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
    <div className="space-background" aria-hidden>
      {/* Nebula gradient layers */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />

      {/* Cinematic planets */}
      <div className="planets-layer">
        {PLANETS.map((planet) => (
          <div
            key={planet.id}
            className={`planet planet--${planet.theme} ${planet.type === 'ringed' ? 'planet--ringed' : ''}`}
            style={{
              '--planet-size': `${planet.size}px`,
              '--planet-x': planet.x,
              '--planet-y': planet.y,
              '--planet-duration': `${planet.duration}s`,
              '--planet-ring-duration': planet.ringDuration ? `${planet.ringDuration}s` : '0s',
            }}
          >
            {planet.type === 'ringed' && (
              <div className="planet-ring" aria-hidden>
                <span className="planet-ring-inner" />
              </div>
            )}
            <div className="planet-body" />
            <div className="planet-glow" aria-hidden />
          </div>
        ))}
      </div>

      {/* Floating cosmic orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="space-orb"
          style={{
            '--orb-size': `${orb.size}px`,
            '--orb-x': orb.x,
            '--orb-y': orb.y,
            '--orb-delay': `${orb.delay}s`,
            '--orb-duration': `${orb.duration}s`,
          }}
        />
      ))}

      {/* Twinkling stars */}
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

      {/* Shooting stars */}
      <div className="shooting-star shooting-star-1" style={{ '--rot': '0deg' }} />
      <div className="shooting-star shooting-star-2" style={{ '--rot': '-12deg' }} />
      <div className="shooting-star shooting-star-3" style={{ '--rot': '-6deg' }} />
    </div>
  );
}

export default SpaceBackground;
