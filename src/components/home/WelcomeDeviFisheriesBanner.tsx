import React from 'react';

interface WelcomeDeviFisheriesBannerProps {
  className?: string;
}

export const WelcomeDeviFisheriesBanner: React.FC<WelcomeDeviFisheriesBannerProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`w-full min-h-[190px] sm:min-h-[210px] md:min-h-[220px] rounded-2xl md:rounded-[24px] overflow-hidden border border-[#BAE6FD]/90 shadow-subtle relative select-none flex items-center px-6 sm:px-10 md:px-12 bg-gradient-to-r from-white via-[#E6F6FB] via-[#D3F0F8] to-[#99E3EE] ${className}`}
    >
      {/* 1. Ambient Ocean Light Gradients (Teal, Sky Blue, Pure White) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 80% at 90% 20%, rgba(0, 167, 188, 0.35) 0%, transparent 70%),
            radial-gradient(circle 350px at 75% 90%, rgba(14, 165, 233, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 50% 100% at 0% 50%, rgba(255, 255, 255, 0.95) 0%, transparent 70%)
          `,
        }}
      />

      {/* 2. Delicate Oceanic Wave Accents (Subtle Vector Lines) */}
      <svg
        className="absolute right-0 top-0 h-full w-2/3 pointer-events-none opacity-25"
        viewBox="0 0 700 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120 C180 80 320 180 500 130 C600 100 660 140 700 110 L700 220 L0 220 Z"
          fill="url(#wave-teal-grad-1)"
        />
        <path
          d="M60 80 C240 160 400 90 560 150 C630 180 670 140 700 160 L700 220 L60 220 Z"
          fill="url(#wave-teal-grad-2)"
          opacity="0.6"
        />
        <defs>
          <linearGradient id="wave-teal-grad-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00a7bc" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="wave-teal-grad-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00a7bc" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3. Banner Typography Content */}
      <div className="relative z-10 flex flex-col justify-center py-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#BAE6FD] text-[#00899B] text-xs font-bold tracking-tight mb-3 w-fit shadow-2xs backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-[#00a7bc] animate-pulse" />
          <span>Devi Fisheries Limited • Enterprise Portal</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B0F19] tracking-tight leading-tight">
          Welcome Devi Fisheries
        </h1>

        <p className="text-xs sm:text-sm font-medium text-slate-600 mt-2 leading-relaxed max-w-xl">
          Unified operations console for aquaculture farming, pre-processing, coldstore inventory, and global seafood exports.
        </p>
      </div>
    </div>
  );
};
