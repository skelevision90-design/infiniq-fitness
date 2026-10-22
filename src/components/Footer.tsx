import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.12] bg-[#07090C] py-16 px-6 sm:px-8 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Left Column: Brand & Details */}
          <div className="max-w-md space-y-4">
            <div className="text-sm font-normal tracking-[0.2em] text-white">
              INFINIQ <span className="text-[#27D0FF]">•</span>
            </div>

            <address className="not-italic text-xs font-light leading-relaxed text-white/45">
              Property no. 712, B-Zone, Mall Road,
              <br />
              near Manbro Chownk, Jalandhar, Punjab
            </address>

            <div className="pt-1">
              <a
                href="tel:+919815320963"
                className="text-xs font-light text-white/70 transition-colors duration-200 hover:text-white"
              >
                Phone: +91 98153 20963
              </a>
            </div>

            <div>
              <a
                href="https://wa.me/919815320963?text=Hi%20INFINIQ%2C%20I%20have%20an%20inquiry%20regarding%20the%20club."
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-light text-white/70 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-[#27D0FF] hover:decoration-[#27D0FF]"
              >
                Message on WhatsApp direct
              </a>
            </div>
          </div>

          {/* Right Column: Legal & Quiet Protocols */}
          <div className="flex flex-col items-start md:items-end justify-between space-y-4 pt-6 md:pt-0 border-t md:border-t-0 border-white/[0.08]">
            <div className="flex items-center gap-6 text-xs font-light text-white/45">
              <a
                href="/privacy"
                className="transition-colors duration-200 hover:text-white"
              >
                Privacy Protocol
              </a>
              <span>•</span>
              <span className="text-white/45">Mall Road Sanctuary</span>
            </div>

            <p className="text-xs font-light text-white/45">
              &copy; {new Date().getFullYear()} INFINIQ Fitness Club. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
