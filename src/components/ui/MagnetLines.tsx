import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  baseAngle?: number;
  className?: string;
}

export const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 11,
  columns = 19,
  lineColor = 'rgba(255, 255, 255, 0.42)',
  lineWidth = '3px',
  lineHeight = '32px',
  baseAngle = 0,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    let rafId: number | null = null;
    // Initial pointer position at window center so field is immediately aligned
    let mouseX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    let mouseY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

    const updateLines = () => {
      rafId = null;
      const items = itemsRef.current;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;

        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Geometric angle facing directly toward the pointer
        const rad = Math.atan2(deltaY, deltaX);
        const deg = rad * (180 / Math.PI) + 90;

        // Vivid reactive magnetic glow when cursor is within proximity
        if (dist < 320) {
          const intensity = 1 - dist / 320;
          item.style.backgroundColor = `rgba(0, 167, 188, ${0.45 + intensity * 0.55})`;
          item.style.boxShadow = `0 0 ${12 * intensity}px rgba(0, 167, 188, ${0.6 + intensity * 0.4})`;
          item.style.transform = `rotate(${deg}deg) scale(${1 + intensity * 0.15})`;
        } else {
          item.style.backgroundColor = lineColor;
          item.style.boxShadow = '0 0 1px rgba(255, 255, 255, 0.1)';
          item.style.transform = `rotate(${deg}deg) scale(1)`;
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updateLines);
      }
    };

    // Initial render call
    updateLines();

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [rows, columns, lineColor, baseAngle]);

  const totalLines = rows * columns;

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full h-full grid place-items-center pointer-events-none select-none overflow-hidden',
        className
      )}
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {Array.from({ length: totalLines }).map((_, idx) => (
        <div key={idx} className="flex items-center justify-center w-full h-full p-2">
          <span
            ref={(el) => {
              if (el) itemsRef.current[idx] = el;
            }}
            className="rounded-full transition-transform duration-75 will-change-transform"
            style={{
              width: lineWidth,
              height: lineHeight,
              backgroundColor: lineColor,
              transform: `rotate(${baseAngle}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};
