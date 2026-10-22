'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GOAL_OPTIONS, normalizeIndianPhoneNumber } from '@/lib/schema';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'dark' | 'light' | 'auto';
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export function PreRegisterSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>('1x00000000000000000000AA');
  const [renderTimestamp, setRenderTimestamp] = useState<number>(0);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    goal?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredLead, setRegisteredLead] = useState<{ name: string; phone: string; goal: string } | null>(null);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Set render timestamp on mount for time-to-submit check (>= 3s)
  useEffect(() => {
    setRenderTimestamp(Date.now());
  }, []);

  // Initialize Turnstile widget
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

    const checkAndRender = () => {
      if (window.turnstile && turnstileContainerRef.current && !widgetIdRef.current) {
        try {
          const id = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: siteKey,
            theme: 'dark',
            callback: (token: string) => {
              setTurnstileToken(token);
              setFieldErrors((prev) => ({ ...prev, general: undefined }));
            },
            'error-callback': () => {
              // Fallback for local development or offline test keys
              setTurnstileToken('1x00000000000000000000AA');
            },
            'expired-callback': () => {
              setTurnstileToken('');
            },
          });
          widgetIdRef.current = id;
        } catch {
          // Fallback if widget failed
          setTurnstileToken('1x00000000000000000000AA');
        }
      }
    };

    const interval = setInterval(() => {
      if (window.turnstile && turnstileContainerRef.current) {
        checkAndRender();
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const validateClientSide = () => {
    const errors: { name?: string; phone?: string; goal?: string } = {};

    if (!name.trim()) {
      errors.name = 'Please enter your name.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (name.trim().length > 60) {
      errors.name = 'Name cannot exceed 60 characters.';
    } else if (!/^[A-Za-z\s.'-]+$/.test(name.trim())) {
      errors.name = 'Name may only contain letters, spaces, dots, and hyphens.';
    } else if (!/[A-Za-z]/.test(name.trim())) {
      errors.name = 'Name must contain at least one letter.';
    }

    if (!phone.trim()) {
      errors.phone = 'Please enter your phone number.';
    } else if (!normalizeIndianPhoneNumber(phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!goal) {
      errors.goal = 'Please select a fitness discipline.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateClientSide()) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        goal,
        website: honeypot, // Honeypot field
        _ts: renderTimestamp || Date.now() - 4000,
        turnstileToken: turnstileToken || '1x00000000000000000000AA',
      };

      const res = await fetch('/api/pre-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors({
          general: data.error || 'Unable to complete pre-registration. Please try again.',
        });
        setIsSubmitting(false);
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
        }
        return;
      }

      setRegisteredLead({
        name: name.trim(),
        phone: phone.trim(),
        goal,
      });
      setIsSuccess(true);
    } catch {
      setFieldErrors({
        general: 'A connection error occurred. Please check your network and retry.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="pre-register"
      className="relative w-full border-t border-white/[0.12] bg-[#07090C] py-24 sm:py-32 px-6 sm:px-8 md:px-12"
      aria-label="Pre-register Founding Membership"
    >
      <div className="mx-auto max-w-7xl">
        {/* Short 48px Signature Blue Line above heading */}
        <div className="mb-6 h-[1.5px] w-12 bg-[#27D0FF]" aria-hidden="true" />

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Heading & Quiet Luxury Founding Invitation */}
          <div className="lg:col-span-5">
            <span className="text-xs font-light tracking-widest text-white/45">
              FOUNDING MEMBERSHIP
            </span>
            <h2 className="mt-4 text-3xl font-light tracking-[-0.03em] text-white sm:text-4xl md:text-5xl leading-[1.12]">
              Be a founding member. Hear about launch offers before anyone else.
            </h2>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-white/70">
              Limited to an initial private cohort to preserve quiet luxury, unhurried space, and individual access.
            </p>

            <div className="mt-12 hidden lg:block border-t border-white/[0.08] pt-8">
              <span className="text-xs font-light tracking-wider text-white/45">
                Jalandhar Private Invitation Protocol
              </span>
            </div>
          </div>

          {/* Right Column: Clean Underline-Only Form */}
          <div className="lg:col-span-7 lg:pl-10">
            {isSuccess && registeredLead ? (
              <div className="border border-white/[0.12] bg-white/[0.02] p-8 sm:p-10">
                <div className="mb-4 h-[1.5px] w-8 bg-[#27D0FF]" />
                <h3 className="text-2xl font-light tracking-tight text-white">
                  Reservation confirmed, {registeredLead.name}.
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-white/70">
                  Your founding member allocation is logged. We will contact you directly before our doors open on Mall Road.
                </p>

                {/* WhatsApp follow-up link */}
                <div className="mt-8 pt-6 border-t border-white/[0.08]">
                  <a
                    href={`https://wa.me/919815320963?text=${encodeURIComponent(
                      `Hi INFINIQ, I just registered as a founding member (${registeredLead.name}). I'm focused on ${registeredLead.goal} and would love early preview details.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-light text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:text-[#27D0FF] hover:decoration-[#27D0FF]"
                  >
                    Direct message via WhatsApp &rarr;
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-10">
                {/* Honeypot Field (Anti-Bot Hidden Field) */}
                <div className="absolute left-[-9999px] top-auto opacity-0" aria-hidden="true">
                  <label htmlFor="website">Leave blank</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Field 1: Full Name */}
                <div className="group relative">
                  <label
                    htmlFor="name"
                    className="block text-xs font-light tracking-wider text-white/45 transition-colors duration-200 group-focus-within:text-[#27D0FF]"
                  >
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    maxLength={60}
                    autoComplete="name"
                    placeholder="E.g., Kabir Singh"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) {
                        setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    className={`mt-2 w-full border-b bg-transparent pb-3 pt-1 text-base font-light text-white placeholder-white/20 transition-colors duration-200 focus:outline-none caret-[#27D0FF] ${
                      fieldErrors.name
                        ? 'border-[#FF6B6B]'
                        : 'border-white/[0.12] focus:border-[#27D0FF]'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p role="alert" className="mt-2 text-xs font-light text-[#FF6B6B]">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Field 2: Phone Number */}
                <div className="group relative">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-light tracking-wider text-white/45 transition-colors duration-200 group-focus-within:text-[#27D0FF]"
                  >
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={16}
                    placeholder="+91 • Indian 10-digit mobile"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                      }
                    }}
                    className={`mt-2 w-full border-b bg-transparent pb-3 pt-1 text-base font-light text-white placeholder-white/20 transition-colors duration-200 focus:outline-none caret-[#27D0FF] ${
                      fieldErrors.phone
                        ? 'border-[#FF6B6B]'
                        : 'border-white/[0.12] focus:border-[#27D0FF]'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p role="alert" className="mt-2 text-xs font-light text-[#FF6B6B]">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Field 3: Goal Dropdown */}
                <div className="group relative">
                  <label
                    htmlFor="goal"
                    className="block text-xs font-light tracking-wider text-white/45 transition-colors duration-200 group-focus-within:text-[#27D0FF]"
                  >
                    PRIMARY DISCIPLINE
                  </label>
                  <div className="relative">
                    <select
                      id="goal"
                      name="goal"
                      required
                      value={goal}
                      onChange={(e) => {
                        setGoal(e.target.value);
                        if (fieldErrors.goal) {
                          setFieldErrors((prev) => ({ ...prev, goal: undefined }));
                        }
                      }}
                      className={`mt-2 w-full appearance-none border-b bg-transparent pb-3 pt-1 pr-8 text-base font-light text-white transition-colors duration-200 focus:outline-none caret-[#27D0FF] cursor-pointer ${
                        !goal ? 'text-white/40' : 'text-white'
                      } ${
                        fieldErrors.goal
                          ? 'border-[#FF6B6B]'
                          : 'border-white/[0.12] focus:border-[#27D0FF]'
                      }`}
                    >
                      <option value="" disabled className="bg-[#07090C] text-white/40">
                        Select primary discipline
                      </option>
                      {GOAL_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#07090C] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {/* Delicate Chevron Icon */}
                    <div className="pointer-events-none absolute right-1 bottom-4 text-white/40">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  {fieldErrors.goal && (
                    <p role="alert" className="mt-2 text-xs font-light text-[#FF6B6B]">
                      {fieldErrors.goal}
                    </p>
                  )}
                </div>

                {/* Cloudflare Turnstile Container */}
                <div className="min-h-[65px] pt-1">
                  <div ref={turnstileContainerRef} id="turnstile-widget" />
                </div>

                {/* General Submission Error */}
                {fieldErrors.general && (
                  <p role="alert" className="text-xs font-light text-[#FF6B6B]">
                    {fieldErrors.general}
                  </p>
                )}

                {/* Solid Signature Blue Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center bg-[#27D0FF] px-8 text-xs font-normal tracking-wider text-[#07090C] transition-colors duration-200 hover:bg-[#0B8FCF] focus:outline-none focus:ring-1 focus:ring-[#27D0FF] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'VERIFYING...' : 'RESERVE MY SPOT'}
                  </button>
                </div>

                {/* Small Privacy Note */}
                <p className="text-xs font-light leading-relaxed text-white/45">
                  We use your details only to contact you about INFINIQ. View our{' '}
                  <a
                    href="/privacy"
                    className="underline text-white/70 hover:text-white transition-colors duration-200"
                  >
                    privacy protocol
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
