import React from 'react';
import Image from 'next/image';

const SPACES = [
  {
    num: '01',
    name: 'Luxury Gym',
    desc: 'Precision-engineered biomechanics and bespoke free weights.',
  },
  {
    num: '02',
    name: 'Premium Equipment',
    desc: 'Hand-selected imported strength and conditioning platforms.',
  },
  {
    num: '03',
    name: 'Special CrossFit Zone',
    desc: 'Dedicated turf and Olympic lifting platforms for high-intensity power.',
  },
  {
    num: '04',
    name: 'Pilates Studio',
    desc: 'Reformer sanctuary fostering core alignment, breath, and posture.',
  },
  {
    num: '05',
    name: 'Steam & Sauna',
    desc: 'Cedar-lined dry heat and eucalyptus-infused hydrothermal therapy.',
  },
  {
    num: '06',
    name: 'Recovery Room',
    desc: 'Hyperbaric oxygen, compression protocols, and cold plunge immersion.',
  },
  {
    num: '07',
    name: 'Exclusive Café',
    desc: 'Organic cold-press tonics, artisanal espresso, and clean macro nourishment.',
  },
];

export function ClubSection() {
  return (
    <section
      id="club"
      className="relative w-full border-t border-white/[0.12] bg-[#07090C] py-24 sm:py-32 px-6 sm:px-8 md:px-12"
      aria-label="The Club Sanctuary and Spaces"
    >
      <div className="mx-auto max-w-7xl">
        {/* Short 48px Signature Blue Line above heading */}
        <div className="mb-6 h-[1.5px] w-12 bg-[#27D0FF]" aria-hidden="true" />

        {/* Top Grid: Philosophy on Left, Tall Architectural Photo on Right */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="text-xs font-light tracking-widest text-white/45">
              THE PHILOSOPHY
            </span>
            <h2 className="mt-4 text-3xl font-light tracking-[-0.03em] text-white sm:text-4xl md:text-5xl leading-[1.12]">
              Where strength meets discipline.
            </h2>
            <p className="mt-6 text-base font-light leading-relaxed text-white/70">
              Designed for those who pursue physical mastery in silence. INFINIQ strips away distraction to elevate performance, recovery, and ritual in Jalandhar&apos;s finest architectural athletic sanctuary.
            </p>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-900 lg:col-span-7">
            <Image
              src="/club.jpg"
              alt="INFINIQ hydrothermal steam and cedar sauna suite"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover photo-luxury"
            />
            <div className="grain-overlay" aria-hidden="true" />
          </div>
        </div>

        {/* Below: Two-Column Hairline-Separated List of the Seven Spaces */}
        <div className="mt-20 border-t border-white/[0.12] pt-12">
          <div className="mb-8">
            <span className="text-xs font-light tracking-widest text-white/45">
              SEVEN DEDICATED SPACES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
            {SPACES.map((space) => (
              <div
                key={space.num}
                className="group flex items-center justify-between border-b border-white/[0.12] py-5 transition-colors duration-200"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-light tracking-wider text-white/45">
                    {space.num}
                  </span>
                  <h3 className="text-base sm:text-lg font-light text-white transition-colors duration-200 group-hover:text-[#27D0FF]">
                    {space.name}
                  </h3>
                </div>
                <span className="hidden sm:inline-block text-xs font-light text-white/45 text-right max-w-[200px] lg:max-w-xs truncate">
                  {space.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
