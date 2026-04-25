import React, { useMemo } from 'react';

export default function Bubbles() {
  // Generate random bubbles
  const bubbles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const size = Math.random() * 60 + 20; // 20px to 80px
      const left = Math.random() * 100; // 0% to 100%
      const duration = Math.random() * 10 + 10; // 10s to 20s
      const delay = Math.random() * 15; // 0s to 15s

      return {
        id: i,
        size,
        left,
        duration,
        delay,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="aero-bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
