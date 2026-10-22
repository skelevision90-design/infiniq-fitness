/**
 * In-Memory Sliding Window Rate Limiter
 * 
 * Configured for 5 requests per 10 minutes per IP address.
 * 
 * NOTE FOR PRODUCTION DEPLOYMENT:
 * In a multi-region or serverless environment (e.g., Vercel edge/serverless functions),
 * in-memory storage is not shared across isolated function instances.
 * For production, swap this implementation with an external store such as Upstash Redis:
 * 
 * Example Upstash Redis replacement:
 * ```ts
 * import { Ratelimit } from "@upstash/ratelimit";
 * import { Redis } from "@upstash/redis";
 * const ratelimit = new Ratelimit({
 *   redis: Redis.fromEnv(),
 *   limiter: Ratelimit.slidingWindow(5, "10 m"),
 * });
 * const { success, limit, remaining, reset } = await ratelimit.limit(ip);
 * ```
 */

interface RateLimitRecord {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private cache = new Map<string, RateLimitRecord>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 10 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Periodic sweep to prevent memory leak from stale IPs every 5 minutes
    if (typeof setInterval !== 'undefined') {
      const timer = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (timer.unref) {
        timer.unref();
      }
    }
  }

  public check(identifier: string): { success: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const record = this.cache.get(identifier) || { timestamps: [] };
    // Filter timestamps within current sliding window
    const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (activeTimestamps.length >= this.maxRequests) {
      const oldest = activeTimestamps[0];
      const resetTime = oldest + this.windowMs;
      return {
        success: false,
        remaining: 0,
        resetTime,
      };
    }

    activeTimestamps.push(now);
    this.cache.set(identifier, { timestamps: activeTimestamps });

    return {
      success: true,
      remaining: this.maxRequests - activeTimestamps.length,
      resetTime: now + this.windowMs,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    for (const [key, record] of this.cache.entries()) {
      const valid = record.timestamps.filter((ts) => ts > windowStart);
      if (valid.length === 0) {
        this.cache.delete(key);
      } else {
        this.cache.set(key, { timestamps: valid });
      }
    }
  }
}

// Global singleton instance for the route handler
export const preRegisterLimiter = new InMemoryRateLimiter(5, 10 * 60 * 1000);
