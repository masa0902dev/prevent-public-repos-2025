import { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySignature } from "../utils.js";
import { targetActions } from "../constants.js";

export function validateRequest(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return false;
  }

  if (!req.body.repository || !req.body.action || !req.body.installation) {
    res.status(400).json({ error: "Invalid payload structure" });
    return false;
  }

  if (!targetActions.includes(req.body.action)) {
    // Skip irrelevant actions
    res.status(204).end();
    return false;
  }

  if (!verifySignature(req)) {
    res.status(401).json({ error: "Invalid signature" });
    return false;
  }

  return true;
}
