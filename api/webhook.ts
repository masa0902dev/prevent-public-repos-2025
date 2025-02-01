import { VercelRequest, VercelResponse } from "@vercel/node";
import { repositoryHandler } from "../src/handlers/repository.js";
import { rateLimit } from "../src/middlewares/rateLimit.js";
import { validateRequest } from "../src/middlewares/validateRequest.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!validateRequest(req, res)) {
    return;
  }
  if (!rateLimit(req, res)) {
    return;
  }

  try {
    // console.info("Received Webhook Request:", JSON.stringify(req.body, null, 2)); // for debugging
    await repositoryHandler(req.body);
    return res.status(200).json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
