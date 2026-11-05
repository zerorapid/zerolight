import React from 'react';

export interface SlidingIndicatorProps {
  top: number;
  height: number;
  opacity: number;
  backgroundColor: string;
  borderRadius: string;
  className?: string;
}

/**
 * Kinetic GPU-accelerated sliding hover backplate
 * Smoothly tracks cursor position across list items with zero latency.
 */
export const SlidingIndicator: React.FC<SlidingIndicatorProps> = ({
  top,
  height,
  opacity,
  backgroundColor,
  borderRadius,
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      style={{
        backgroundColor,
        borderRadius,
        transform: `translateY(${top}px)`,
        height: `${height}px`,
        opacity,
      }}
      className={`sliding-hover-indicator pointer-events-none absolute left-1.5 right-1.5 will-change-transform ${className}`}
    />
  );
};
