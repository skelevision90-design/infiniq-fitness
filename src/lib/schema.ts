import { z } from 'zod';

export const GOAL_OPTIONS = [
  'Build strength',
  'Lose weight',
  'CrossFit and functional training',
  'Pilates and mobility',
  'Recovery and wellness',
  'Not sure yet',
] as const;

export type GoalOption = (typeof GOAL_OPTIONS)[number];

// Allowed name characters: letters, spaces, apostrophes, periods, hyphens
const NAME_REGEX = /^[A-Za-z\s.'-]+$/;

/**
 * Normalizes an Indian phone number string.
 * Strips whitespace, parentheses, and dashes.
 * Removes leading +91, 91 (if 12 digits), or 0 (if 11 digits).
 * Returns normalized 10-digit string or null if invalid.
 */
export function normalizeIndianPhoneNumber(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const digitsOnly = input.replace(/\D/g, '');

  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    const tenDigits = digitsOnly.slice(2);
    return /^[6-9]\d{9}$/.test(tenDigits) ? tenDigits : null;
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    const tenDigits = digitsOnly.slice(1);
    return /^[6-9]\d{9}$/.test(tenDigits) ? tenDigits : null;
  }

  if (digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) {
    return digitsOnly;
  }

  return null;
}

export const preRegisterInputSchema = z
  .object({
    name: z
      .string({ required_error: 'Full name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name must not exceed 60 characters')
      .regex(NAME_REGEX, 'Name may only contain letters, spaces, dots, apostrophes, and hyphens')
      .refine((val) => /[A-Za-z]/.test(val), {
        message: 'Name must contain at least one letter',
      }),
    
    phone: z
      .string({ required_error: 'Phone number is required' })
      .trim()
      .transform((val, ctx) => {
        const normalized = normalizeIndianPhoneNumber(val);
        if (!normalized) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9',
          });
          return z.NEVER;
        }
        return normalized;
      }),

    goal: z.enum(GOAL_OPTIONS, {
      errorMap: () => ({ message: 'Please select a valid fitness goal' }),
    }),

    // Honeypot field - must be empty string
    website: z.string().max(0, 'Spam detected').optional().default(''),

    // Minimum time-to-submit check (rendered timestamp)
    _ts: z
      .number({ required_error: 'Timestamp is missing' })
      .refine(
        (ts) => {
          const elapsed = Date.now() - ts;
          // Must take at least 3000ms (3 seconds) to submit and not be from the future
          return elapsed >= 3000 && elapsed <= 24 * 60 * 60 * 1000;
        },
        { message: 'Submission completed too quickly. Please take a moment to review.' }
      ),

    // Cloudflare Turnstile token
    turnstileToken: z.string({ required_error: 'Verification token is required' }).min(1, 'Verification token is required'),
  })
  .strict(); // Rejects unknown fields strictly

export type PreRegisterInput = z.infer<typeof preRegisterInputSchema>;
