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
        {/* Short 48px Signature Blue Line above heading */}
        <div className="mb-6 h-[1.5px] w-12 bg-[#27D0FF]" aria-hidden="true" />

        <div className="mb-8">
          <span className="text-xs font-light tracking-widest text-white/45">
            UNCONSTRAINED CHRONOLOGY
          </span>
        </div>

        {/* Wide Quiet Architectural Photo */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-lg bg-neutral-900">
          <Image
            src="/open-247.jpg"
            alt="INFINIQ athletic floor during serene midnight hours"
            fill
            sizes="100vw"
            className="object-cover photo-luxury"
          />
          <div className="grain-overlay" aria-hidden="true" />
          {/* Subtle gradient vignette to heighten quiet mood */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#07090C]/80 via-transparent to-[#07090C]/40"
            aria-hidden="true"
          />
        </div>

        {/* Singular Sentence */}
        <div className="mt-10 max-w-2xl">
          <p className="text-2xl font-light tracking-[-0.02em] text-white sm:text-3xl md:text-4xl leading-[1.2]">
            No closing time. Train when your day allows.
          </p>
        </div>
      </div>
    </section>
  );
}
