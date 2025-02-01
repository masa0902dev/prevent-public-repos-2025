import { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySignature } from "../src/utils.js";
import { repositoryHandler } from "../src/handlers/repository.js";

/**
 * GitHub Webhook のエントリポイント
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!verifySignature(req)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  try {
    console.info("Received Webhook Request:", JSON.stringify(req.body, null, 2));
    await repositoryHandler(req.body);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
