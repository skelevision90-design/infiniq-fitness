import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ClubSection } from '@/components/ClubSection';
import { Open247Section } from '@/components/Open247Section';
import { PreRegisterSection } from '@/components/PreRegisterSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#07090C] text-white">
      {/* Slim Top Bar */}
      <Navbar />

      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: The Club */}
      <ClubSection />

      {/* Section 3: Open 24/7 */}
      <Open247Section />

      {/* Section 4: Pre-register Form */}
      <PreRegisterSection />

      {/* Section 5: Footer */}
      <Footer />
    </main>
  );
}
