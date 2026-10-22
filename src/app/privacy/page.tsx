import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Protocol | INFINIQ Fitness Club',
  description: 'Our strict privacy commitments: no tracking, zero third-party cookies, and minimal data collection.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#07090C] text-white/70 px-6 sm:px-8 md:px-12 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 h-[1.5px] w-12 bg-[#27D0FF]" aria-hidden="true" />
        
        <div className="mb-4">
          <Link
            href="/"
            className="text-xs font-light text-white/45 hover:text-[#27D0FF] transition-colors duration-200"
          >
            &larr; Return to INFINIQ
          </Link>
        </div>

        <h1 className="text-3xl font-light tracking-[-0.03em] text-white sm:text-4xl">
          Privacy Protocol
        </h1>
        <p className="mt-3 text-xs font-light tracking-widest text-white/45">
          LAST REVISED: OCTOBER 2026
        </p>

        <div className="mt-12 space-y-10 text-sm font-light leading-relaxed border-t border-white/[0.12] pt-10">
          <section>
            <h2 className="text-lg font-light text-white mb-2">1. Principle of Quiet Restraint</h2>
            <p>
              At INFINIQ Fitness Club, we treat personal privacy as an essential element of quiet luxury. We do not run third-party advertising trackers, behavioural analytics, pixels, or profiling cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-light text-white mb-2">2. What We Collect</h2>
            <p className="mb-2">
              Our pre-registration service collects only the minimal information strictly required to coordinate your founding membership:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-white/60 pl-2">
              <li><strong className="text-white/80 font-normal">Full Name:</strong> To address you personally during invitation allocation.</li>
              <li><strong className="text-white/80 font-normal">Phone Number:</strong> To send direct SMS/WhatsApp launch notices before our public opening.</li>
              <li><strong className="text-white/80 font-normal">Primary Discipline:</strong> To tailor training facilities and equipment onboarding to your athletic focus.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-light text-white mb-2">3. Zero Selling or Commercial Sharing</h2>
            <p>
              Your contact details are never rented, sold, monetized, or shared with third-party advertisers. They are retained securely and accessed only by the INFINIQ founding membership concierge.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-light text-white mb-2">4. Cloudflare Turnstile Verification</h2>
            <p>
              To protect our pre-registration systems from automated abuse without capturing invasive user tracking data, we use Cloudflare Turnstile. Turnstile validates that a human visitor is submitting the form without reading biometric profiles or personal cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-light text-white mb-2">5. Data Deletion and Inquiries</h2>
            <p>
              You may request immediate deletion of your contact information at any time by messaging our concierge on WhatsApp or emailing{' '}
              <a href="mailto:privacy@infiniqfitness.com" className="text-white hover:text-[#27D0FF] underline">
                privacy@infiniqfitness.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-white/[0.12] pt-8">
          <p className="text-xs text-white/45">
            INFINIQ Fitness Club • Property no. 712, B-Zone, Mall Road, near Manbro Chownk, Jalandhar, Punjab
          </p>
        </div>
      </div>
    </main>
  );
}
