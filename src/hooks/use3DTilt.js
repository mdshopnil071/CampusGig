import { useState, useCallback } from 'react';

/**
 * Lightweight custom hook for smooth 3D perspective tilt effect on interactive cards
 * Uses e.currentTarget to calculate coordinates without needing ref allocations
 * @param {Object} options
 * @param {number} options.maxTilt - Maximum tilt angle in degrees (default: 8)
 * @param {number} options.scale - Scale factor on hover (default: 1.015)
 * @param {boolean} options.glare - Whether to calculate specular light position (default: true)
 */
export const use3DTilt = ({ maxTilt = 8, scale = 1.015, glare = true } = {}) => {
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease',
  });

  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      const target = e.currentTarget;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: 'transform 0.1s ease-out',
      });

      if (glare) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        setGlarePosition({
          x: percentX,
          y: percentY,
          opacity: 0.25,
        });
      }
    },
    [maxTilt, scale, glare]
  );

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease',
    });
    if (glare) {
      setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [glare]);

  return {
    style,
    glareStyle: glare
      ? {
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(56, 189, 248, ${glarePosition.opacity}), transparent 65%)`,
          pointerEvents: 'none',
        }
      : null,
    bind: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
};
