import { env } from './env';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Fails closed if token is invalid or verification fails.
 */
export async function verifyTurnstileToken(token: string, remoteIp?: string): Promise<boolean> {
  // If no token provided, fail immediately
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Cloudflare test tokens: '1x00000000000000000000AA' always passes when using test secret
  if (
    env.TURNSTILE_SECRET_KEY === '1x0000000000000000000000000000000AA' &&
    token.startsWith('1x00000000000000000000')
  ) {
    return true;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!res.ok) {
      return false; // Fail closed
    }

    const data = (await res.json()) as TurnstileVerifyResponse;
    if (!data.success) {
      return false; // Fail closed
    }

    return true;
  } catch {
    return false; // Fail closed on network or system exceptions
  }
}
