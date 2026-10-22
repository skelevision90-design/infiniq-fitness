import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1, 'NEXT_PUBLIC_TURNSTILE_SITE_KEY is required'),
  TURNSTILE_SECRET_KEY: z.string().min(1, 'TURNSTILE_SECRET_KEY is required'),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error('Invalid environment variables configuration:', parsed.error.format());
  throw new Error('Environment variables validation failed. See above error for missing or invalid keys.');
}

export const env = parsed.data;
