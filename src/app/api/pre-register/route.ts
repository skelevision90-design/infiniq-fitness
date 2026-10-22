import { NextResponse } from 'next/server';
import { preRegisterInputSchema } from '@/lib/schema';
import { preRegisterLimiter } from '@/lib/rate-limiter';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { env } from '@/lib/env';

const MAX_BODY_BYTES = 2048; // Strict 2KB limit

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }
  return req.headers.get('x-real-ip')?.trim() || '127.0.0.1';
}

function methodNotAllowedResponse() {
  return new NextResponse(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'POST',
      },
    }
  );
}

export async function GET() {
  return methodNotAllowedResponse();
}

export async function PUT() {
  return methodNotAllowedResponse();
}

export async function DELETE() {
  return methodNotAllowedResponse();
}

export async function PATCH() {
  return methodNotAllowedResponse();
}

export async function HEAD() {
  return methodNotAllowedResponse();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'POST',
    },
  });
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // 1. IP-based Rate Limiting (5 requests per 10 minutes)
    const rateCheck = preRegisterLimiter.check(clientIp);
    if (!rateCheck.success) {
      const retryAfterSeconds = Math.ceil((rateCheck.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.max(1, retryAfterSeconds)),
          },
        }
      );
    }

    // 2. Validate Content-Type
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected application/json.' },
        { status: 415 }
      );
    }

    // 3. Request body size check (< 2KB) via Content-Length header
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request body exceeds maximum size of 2KB.' },
        { status: 413 }
      );
    }

    // 4. Origin & Referer verification (Strict anti-CSRF check)
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const host = req.headers.get('host');

    let checkTarget: string | null = origin;
    if (!checkTarget && referer) {
      try {
        checkTarget = new URL(referer).origin;
      } catch {
        return NextResponse.json(
          { error: 'Invalid referer header.' },
          { status: 403 }
        );
      }
    }

    if (checkTarget) {
      try {
        const originUrl = new URL(checkTarget);
        const siteUrlObj = new URL(env.NEXT_PUBLIC_SITE_URL);
        const matchesHost = host && originUrl.host === host;
        const matchesConfigured = originUrl.host === siteUrlObj.host;

        if (!matchesHost && !matchesConfigured) {
          return NextResponse.json(
            { error: 'Cross-origin request blocked.' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid origin header.' },
          { status: 403 }
        );
      }
    }

    // 5. Read body text safely and verify byte length
    let rawText: string;
    try {
      rawText = await req.text();
    } catch {
      return NextResponse.json(
        { error: 'Unable to read request payload.' },
        { status: 400 }
      );
    }

    if (new TextEncoder().encode(rawText).length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Request payload too large.' },
        { status: 413 }
      );
    }

    let rawJson: unknown;
    try {
      rawJson = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    // 6. Server-side validation with Zod
    const validationResult = preRegisterInputSchema.safeParse(rawJson);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstIssue ? firstIssue.message : 'Invalid form submission.' },
        { status: 400 }
      );
    }

    const { name, phone, goal, turnstileToken } = validationResult.data;

    // 7. Verify Cloudflare Turnstile token (Fail-closed)
    const isTokenValid = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!isTokenValid) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // 8. Safely log validated lead for demo
    const maskedPhone = `${phone.slice(0, 5)}*****`;
    console.info('[INFINIQ LEAD]', {
      name,
      phone: maskedPhone,
      goal,
      timestamp: new Date().toISOString(),
    });

    /**
     * PRODUCTION INTEGRATION TODO:
     * 1. Dispatch email notification to team via Resend.
     * 2. Append lead row to Google Sheets via Google Sheets API or Webhook.
     * 3. Sync into CRM / WhatsApp Business API.
     */

    // 9. Return clean success response
    return NextResponse.json(
      {
        success: true,
        message: 'Pre-registration confirmed.',
        lead: {
          name,
          phone,
          goal,
        },
      },
      { status: 200 }
    );
  } catch {
    // Generic error message - never leak stack trace or internal error
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again shortly.' },
      { status: 500 }
    );
  }
}
