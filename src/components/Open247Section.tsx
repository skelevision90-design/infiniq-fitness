import React from 'react';
import Image from 'next/image';

export function Open247Section() {
  return (
    <section
      id="access"
      className="relative w-full border-t border-white/[0.12] bg-[#07090C] py-24 sm:py-32 px-6 sm:px-8 md:px-12"
      aria-label="24/7 Access"
    >
      <div className="mx-auto max-w-7xl">
        {/* Wide Quiet Architectural Photo Container with Centered Sentence */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-lg bg-neutral-900 flex items-center justify-center px-6 text-center">
          <Image
            src="/open-247.jpg"
            alt="INFINIQ athletic floor during serene midnight hours"
            fill
            sizes="100vw"
            className="object-cover photo-luxury"
          />
          <div className="grain-overlay" aria-hidden="true" />
          
          {/* Subtle dark vignette overlay for calm focus */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#07090C]/85 via-[#07090C]/50 to-[#07090C]/85"
            aria-hidden="true"
          />

          {/* Centered Heading Content */}
          <div className="relative z-10 max-w-2xl flex flex-col items-center">
            {/* Short 48px Signature Blue Line */}
            <div className="mb-5 h-[1.5px] w-12 bg-[#27D0FF]" aria-hidden="true" />

            <span className="text-xs font-light tracking-widest text-white/45 mb-4">
              UNCONSTRAINED CHRONOLOGY
            </span>

            <p className="text-2xl font-light tracking-[-0.02em] text-white sm:text-3xl md:text-4xl leading-[1.25]">
              No closing time. Train when your day allows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
