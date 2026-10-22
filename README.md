# INFINIQ Fitness Club

> Premium 24/7 athletic sanctuary opening soon on Mall Road, Jalandhar, Punjab, India.  
> Quiet luxury, calm and confident, like a high-end spa that happens to have a serious gym.

---

## Architectural Principles & Design System

- **Atmosphere**: Quiet luxury, unhurried restraint, minimalist editorial tone.
- **Color Architecture**:
  - Background: `#07090C` (near-black)
  - Text Levels: 100% (`#FFFFFF`), 70% (`rgba(255, 255, 255, 0.70)`), 45% (`rgba(255, 255, 255, 0.45)`)
  - Hairline Dividers: 12% (`rgba(255, 255, 255, 0.12)`)
  - Signature Blue: Primary `#27D0FF`, Deep `#0B8FCF`, Faint tint `rgba(39, 208, 255, 0.08)`
  - Blue covers < 5% of any screen viewport. No neon, no gradients, no glows.
- **Strict Blue Allocations**:
  1. Main "Reserve my spot" button and top "Pre-register" link (`#27D0FF` -> hover `#0B8FCF`)
  2. Hero photo: subtle 12% cool blue-black tint overlay
  3. Thin 1px infinity line in hero corner (silver left loop, `#27D0FF` right loop)
  4. 48px `#27D0FF` hairline line above each section heading
  5. Form underline focus state & caret (`caret-[#27D0FF]`)
  6. 6px `#27D0FF` pulsing indicator dot before "Pre-registrations open"
  7. Singular occurrence of "24/7" in hero headline
  8. Hover state on the 7 club spaces
- **Typography**: Light refined grotesk via `next/font/google` (`Hanken Grotesk`), sentence-case headlines with tight tracking. No uppercase labels, no outlined text.
- **Security**: Full zero-trust validation on `/api/pre-register` with Zod, Cloudflare Turnstile verification, honeypot, time-to-submit check, origin check, request body size limit, and rate limiting.

---

## Production Deployment Checklist

Follow these steps before deploying to production on Vercel:

### 1. Environment Variables Configuration
In your Vercel Project Settings > **Environment Variables**, set:
- `NEXT_PUBLIC_SITE_URL`: Your production custom domain (e.g., `https://infiniqfitness.com`).
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Your live Cloudflare Turnstile site key.
- `TURNSTILE_SECRET_KEY`: Your live Cloudflare Turnstile secret key.

*(For local testing and CI, Cloudflare's official testing keys `1x00000000000000000000AA` / `1x0000000000000000000000000000000AA` can be used)*.

### 2. Replace In-Memory Rate Limiter
The default rate limiter (`src/lib/rate-limiter.ts`) uses an in-memory sliding window (5 requests / 10 minutes per IP).  
Because Vercel serverless functions run across ephemeral instances, swap this with **Upstash Redis**:
```bash
npm install @upstash/ratelimit @upstash/redis
```
In `src/lib/rate-limiter.ts`:
```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const preRegisterLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
});
```

### 3. Wire Up Notifications (Email / CRM / Sheets)
In `src/app/api/pre-register/route.ts`, implement the production TODO:
- Connect [Resend](https://resend.com) to notify gym concierges immediately.
- Or push directly into Google Sheets via Webhook or WhatsApp Business API.

### 4. Verify Security Headers
Deploy to staging and test on [securityheaders.com](https://securityheaders.com):
- Verify **A+ grade** rating:
  - Content Security Policy (CSP)
  - Strict-Transport-Security (HSTS) with `preload`
  - X-Frame-Options (`DENY`)
  - X-Content-Type-Options (`nosniff`)
  - Referrer-Policy (`strict-origin-when-cross-origin`)
  - Permissions-Policy (`camera=(), microphone=(), geolocation=(), payment=()`)
  - Cross-Origin-Opener-Policy (`same-origin`)

---

## Local Development & Testing

```bash
# Install exact dependencies
npm install

# Run development server
npm run dev

# Run production build
npm run build
```

The server will be available at `http://localhost:3000`.
