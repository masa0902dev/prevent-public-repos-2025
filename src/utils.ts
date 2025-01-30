import crypto from "crypto";
import { VercelRequest } from "@vercel/node";

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

/**
 * GitHub Webhook の署名を検証する
 */
export function verifySignature(req: VercelRequest): boolean {
  const signature = req.headers["x-hub-signature-256"] as string;
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  hmac.update(JSON.stringify(req.body));
  const digest = `sha256=${hmac.digest("hex")}`;

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
