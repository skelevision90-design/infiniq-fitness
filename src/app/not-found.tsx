import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#07090C] px-6 text-center text-white">
      <div className="mb-6 h-[1.5px] w-12 bg-[#27D0FF]" aria-hidden="true" />
      <span className="text-xs font-light tracking-widest text-white/45">404 • UNLOCATED</span>
      <h1 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl">
        This space does not exist.
      </h1>
      <p className="mt-4 max-w-sm text-sm font-light text-white/60">
        The requested pathway is outside the sanctuary parameters.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center border border-white/20 px-6 text-xs font-light tracking-wider text-white transition-colors duration-200 hover:border-[#27D0FF] hover:text-[#27D0FF]"
        >
          Return to INFINIQ
        </Link>
      </div>
    </main>
  );
}
