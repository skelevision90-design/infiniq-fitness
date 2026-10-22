import React from 'react';
import Image from 'next/image';
import { InfinityMark } from './InfinityMark';

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#07090C] px-6 pt-24 pb-12 sm:px-8 md:px-12 md:pb-16"
      aria-label="INFINIQ Hero"
    >
      {/* Background Hero Gym Floor Image with Quiet Luxury Treatment */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-gym.jpg"
          alt="INFINIQ quiet luxury gym floor with precision athletic platforms"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center photo-luxury"
        />

        {/* 12% Subtle Cool Blue-Black Tint Overlay */}
        <div
          className="absolute inset-0 z-[1] hero-tint-overlay"
          aria-hidden="true"
        />

        {/* Soft Film Grain */}
        <div className="grain-overlay" aria-hidden="true" />
      </div>

      {/* Hero Corner Emblem: Thin 1px Infinity Line in upper right */}
      <div className="relative z-10 flex w-full justify-end pt-8 md:pt-6">
        <div className="opacity-90 transition-opacity duration-300 hover:opacity-100">
          <InfinityMark />
        </div>
      </div>

      {/* Hero Bottom-Left Typography Block */}
      <div className="relative z-10 mt-auto max-w-3xl animate-hero-fade">
        {/* Short 48px Signature Blue Line above section heading */}
        <div className="mb-6 h-[1.5px] w-12 bg-[#27D0FF]" aria-hidden="true" />

        {/* Pulsing 6px Blue Indicator Dot before 'Pre-registrations open' */}
        <div className="mb-5 flex items-center gap-2.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#27D0FF] animate-subtle-pulse inline-block"
            aria-hidden="true"
          />
          <span className="text-xs font-light tracking-wider text-white/70">
            Pre-registrations open
          </span>
        </div>

        {/* Main Headline: Large, light, sentence-case, tight tracking */}
        <h1 className="text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08]">
          A new revolution in fitness.
        </h1>

        {/* Subhead with singular '24/7' signature blue highlight */}
        <p className="mt-4 text-base font-light tracking-tight text-white/70 sm:text-lg md:text-xl">
          Premium. Open <span className="text-[#27D0FF]">24/7</span>. Opening soon in Jalandhar.
        </p>

        {/* One Underlined Link: Reserve your place */}
        <div className="mt-8">
          <a
            href="#pre-register"
            className="group inline-block border-b border-white/60 pb-1 text-sm font-light text-white/90 transition-colors duration-300 hover:border-[#27D0FF] hover:text-white focus:outline-none focus:ring-1 focus:ring-[#27D0FF]"
          >
            Reserve your place
          </a>
        </div>
      </div>
    </section>
  );
}
