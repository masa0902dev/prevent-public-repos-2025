import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { Buffer } from "buffer";
import dotenv from "dotenv";

dotenv.config();

const { GITHUB_APP_ID, GITHUB_PRIVATE_KEY } = process.env;

if (!GITHUB_APP_ID || !GITHUB_PRIVATE_KEY) {
  throw new Error("Missing GitHub App credentials");
}

export const getOctokit = (installationId: number) =>
  new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: GITHUB_APP_ID,
      privateKey: Buffer.from(GITHUB_PRIVATE_KEY, "base64").toString("utf-8"),
      installationId,
    },
  });
