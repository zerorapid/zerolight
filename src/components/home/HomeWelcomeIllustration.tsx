import React from 'react';

interface HomeWelcomeIllustrationProps {
  className?: string;
}

export const HomeWelcomeIllustration: React.FC<HomeWelcomeIllustrationProps> = ({
  className = 'w-48 sm:w-64 h-16 sm:h-20',
}) => {
  return (
    <svg
      viewBox="0 0 320 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Soft Ambient Brand Glow */}
        <radialGradient
          id="bg-glow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(240 50) rotate(90) scale(60 100)"
        >
          <stop stopColor="#00a7bc" stopOpacity="0.16" />
          <stop offset="1" stopColor="#00a7bc" stopOpacity="0" />
        </radialGradient>

        {/* Ocean Wave Linear Gradient */}
        <linearGradient id="wave-grad" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e6f6f8" />
          <stop offset="0.5" stopColor="#b3e5eb" />
          <stop offset="1" stopColor="#e6f6f8" />
        </linearGradient>

        <linearGradient id="wave-deep" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#33b9c9" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="#00a7bc" stopOpacity="0.4" />
          <stop offset="1" stopColor="#007584" stopOpacity="0.25" />
        </linearGradient>

        {/* Hull Gradient */}
        <linearGradient id="hull-grad" x1="160" y1="52" x2="270" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00545e" />
          <stop offset="1" stopColor="#007584" />
        </linearGradient>
      </defs>

      {/* Ambient Radial Background Pill */}
      <rect x="140" y="8" width="170" height="84" rx="42" fill="url(#bg-glow)" />

      {/* Satellite / Telemetry Orbit Rings (Floating in upper sky) */}
      <circle cx="90" cy="28" r="18" stroke="#b3e5eb" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
      <circle cx="90" cy="28" r="8" stroke="#00a7bc" strokeWidth="1.5" opacity="0.8" />
      <circle cx="90" cy="28" r="3" fill="#00a7bc" />

      {/* Connectivity Pulse line from Satellite to Vessel */}
      <path
        d="M96 33L190 52"
        stroke="#00a7bc"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.4"
      />

      {/* Horizon Background Coastal Silhouette */}
      <path
        d="M20 78C60 76 110 77 150 78C200 79 260 77 310 78"
        stroke="#e6f6f8"
        strokeWidth="1.5"
      />

      {/* Ocean Vessel Hull (Cargo / Reefer Ship) */}
      <path
        d="M174 58L186 73C188 75.5 191.5 77 195 77H255C259 77 262.5 75 264.5 71.5L274 54L266 54L264 58H174Z"
        fill="url(#hull-grad)"
      />
      {/* Keel waterline stripe */}
      <path
        d="M188 74H258"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Vessel Bridge / Superstructure */}
      <rect x="245" y="42" width="14" height="16" rx="2" fill="#003238" />
      <rect x="247" y="44" width="10" height="4" rx="1" fill="#e6f6f8" />
      <line x1="252" y1="36" x2="252" y2="42" stroke="#007584" strokeWidth="1.5" />
      <circle cx="252" cy="35" r="1.5" fill="#00a7bc" />

      {/* High-Cube Reefer Containers Stacked on Deck */}
      {/* Tier 1 Containers */}
      <rect x="180" y="50" width="18" height="8" rx="1.5" fill="#00a7bc" />
      <rect x="201" y="50" width="18" height="8" rx="1.5" fill="#33b9c9" />
      <rect x="222" y="50" width="18" height="8" rx="1.5" fill="#007584" />

      {/* Tier 2 Containers */}
      <rect x="190" y="43" width="18" height="7" rx="1.5" fill="#4dc1d0" />
      <rect x="211" y="43" width="18" height="7" rx="1.5" fill="#00a7bc" />

      {/* Soft Foreground Ocean Waves (Smooth Curves) */}
      <path
        d="M10 82C40 79 70 85 105 82C140 79 175 84 210 82C245 80 275 85 310 82"
        stroke="url(#wave-deep)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 89C70 86 110 91 150 88C190 85 230 90 270 87C290 85.5 305 87 318 88"
        stroke="url(#wave-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Subtle Data Metric Nodes in Sky */}
      <g opacity="0.85">
        <circle cx="295" cy="24" r="2" fill="#00a7bc" />
        <circle cx="295" cy="24" r="5" stroke="#b3e5eb" strokeWidth="0.8" />
      </g>
    </svg>
  );
};
