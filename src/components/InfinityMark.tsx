import React from 'react';

interface InfinityMarkProps {
  className?: string;
}

/**
 * 1px Hairline Infinity Line
 * Silver on the left loop (#A3A3A3), Signature Blue (#27D0FF) on the right loop.
 */
export function InfinityMark({ className = '' }: InfinityMarkProps) {
  return (
    <svg
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="INFINIQ emblem"
    >
      {/* Left Loop - Silver */}
      <path
        d="M 24 12 C 18 3.5 6 3.5 4 12 C 2 20.5 14 20.5 24 12"
        stroke="#A3A3A3"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Right Loop - Signature Blue #27D0FF */}
      <path
        d="M 24 12 C 30 20.5 42 20.5 44 12 C 46 3.5 34 3.5 24 12"
        stroke="#27D0FF"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
