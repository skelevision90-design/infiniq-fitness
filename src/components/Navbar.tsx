import React from 'react';

export function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 w-full border-b border-white/[0.08] bg-[#07090C]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 md:px-12">
        {/* Logo Wordmark */}
        <a
          href="#top"
          className="text-sm font-normal tracking-[0.2em] text-white transition-opacity duration-300 hover:opacity-80"
          aria-label="INFINIQ Home"
        >
          INFINIQ <span className="text-[#27D0FF]">•</span>
        </a>

        {/* Top Pre-register action */}
        <a
          href="#pre-register"
          className="inline-flex items-center justify-center bg-[#27D0FF] px-4 py-2 text-xs font-normal tracking-wide text-[#07090C] transition-colors duration-200 hover:bg-[#0B8FCF] focus:outline-none focus:ring-1 focus:ring-[#27D0FF]"
        >
          Pre-register
        </a>
      </div>
    </header>
  );
}
