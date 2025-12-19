// Flashlight cursor effect - desktop only
import { useEffect, useState } from 'react';

const FlashlightCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Only enable on devices with hover capability (desktop)
    if (window.matchMedia('(hover: none)').matches) {
      return;
    }

    let rafId = null;

    const handleMouseMove = (e) => {
      // Use requestAnimationFrame for smooth performance
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        setIsActive(true);
      });
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <div
      className="flashlight-overlay"
      style={{
        '--mx': `${position.x}px`,
        '--my': `${position.y}px`,
      }}
      aria-hidden="true"
    />
  );
};

export default FlashlightCursor;

