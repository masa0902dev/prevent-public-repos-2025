import { VercelRequest, VercelResponse } from "@vercel/node";

const MAX_REQUESTS = 50;
const WINDOW_MS = 60 * 60 * 1000;
const CLEANUP_INTERVAL = 60 * 60 * 24 * 1000;

const requestCounts = new Map<string, { count: number; timestamp: number }>();

export function rateLimit(req: VercelRequest, res: VercelResponse): boolean {
  // For Vercel (proxy environment), use x-forwarded-for instead of req.socket.remoteAddress
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";

  if (typeof ip !== "string") {
    res.status(400).json({ error: "Invalid IP address" });
    return false;
  }

  const now = Date.now();
  const record = requestCounts.get(ip);

  if (record) {
    if (now - record.timestamp < WINDOW_MS) {
      if (record.count >= MAX_REQUESTS) {
        console.info(`Rate limit exceeded for IP: ${ip}`);
        res.status(429).json({ error: "Too Many Requests" });
        return false;
      }
      record.count += 1;
    } else {
      requestCounts.set(ip, { count: 1, timestamp: now });
    }
  } else {
    requestCounts.set(ip, { count: 1, timestamp: now });
  }

  return true;
}

// Periodically clean up rate limits
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now - record.timestamp > WINDOW_MS) {
      requestCounts.delete(ip);
      console.info(`Cleaned up rate limit record for IP: ${ip}`);
    }
  }
}, CLEANUP_INTERVAL);
