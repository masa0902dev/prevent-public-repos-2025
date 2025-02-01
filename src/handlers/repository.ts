import { issueTexts } from "../constants.js";
import { getOctokit } from "../github.js";
import dotenv from "dotenv";
dotenv.config();

const ORG_SETTINGS_REPO = process.env.ORG_SETTINGS_REPO!;
const issueCache = new Map<string, number>();

/**
 * GitHub API から Organization 名を取得
 */
const getOrgName = async (
  octokit: any,
  repoOwner: string,
  repoName: string
): Promise<string> => {
  const response = await octokit.repos.get({
    owner: repoOwner,
    repo: repoName,
  });

  return response.data.owner.login;
};

/**
 * GitHub Webhook の `repository` イベントを処理
 */
export async function repositoryHandler(payload: any) {
  if (!payload.repository || !payload.action || !payload.installation) {
    console.info("Skipping Webhook: Invalid payload structure.");
    return;
  }

  const { action, repository, installation } = payload;
  const octokit = getOctokit(installation.id);
  const repoOwner = repository.owner?.login;
  const repoName = repository.name;

  if (!repoOwner || !repoName) {
    console.error(
      `Invalid payload: repository.owner.login=${repoOwner}, repository.name=${repoName}`
    );
    return;
  }

  if (action === "created" && repository.private === false) {
    // Public リポジトリが新規作成された時
    await createIssue(
      octokit,
      repoOwner,
      repoName,
      issueTexts.create.title(repoName),
      issueTexts.create.body(repoName)
    );
    await createIssue(
      octokit,
      repoOwner,
      ORG_SETTINGS_REPO,
      issueTexts.create.title(repoName),
      issueTexts.create.body(repoName)
    );
  } else if (action === "publicized") {
    // Private から Public に変更された時
    await createIssue(
      octokit,
      repoOwner,
      repoName,
      issueTexts.publicize.title(repoName),
      issueTexts.publicize.body(repoName)
    );
    await createIssue(
      octokit,
      repoOwner,
      ORG_SETTINGS_REPO,
      issueTexts.create.title(repoName),
      issueTexts.create.body(repoName)
    );
  } else {
    console.info(`Skipping event: ${action}`);
  }
}

/**
 * Issue を作成する
 */
const createIssue = async (
  octokit: any,
  org: string,
  repo: string,
  title: string,
  body: string
) => {
  const response = await octokit.issues.create({
    owner: org,
    repo,
    title,
    body,
  });
  issueCache.set(repo, response.data.number);
};

/**
 * Issue を削除する
 */
const deleteIssue = async (octokit: any, org: string, repo: string) => {
  const issueNumber = issueCache.get(repo);
  if (issueNumber) {
    await octokit.issues.delete({
      owner: org,
      repo,
      issue_number: issueNumber,
    });
    issueCache.delete(repo);
  }
};
