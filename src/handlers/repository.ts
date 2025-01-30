import { getOctokit } from "../github";
import dotenv from "dotenv";

dotenv.config();

const ORG_SETTING_REPO = process.env.ORG_SETTING_REPO!;
const issueCache = new Map<string, number>();

/**
 * GitHub API から Organization 名を取得
 */
const getOrgName = async (octokit: any, repoName: string): Promise<string> => {
  const response = await octokit.repos.get({
    owner: "dummy", // ここは API 内で上書きされる
    repo: repoName,
  });

  return response.data.owner.login;
};

/**
 * GitHub Webhook の `repository` イベントを処理
 */
export async function repositoryHandler(payload: any) {
  const { action, repository, installation } = payload;

  if (!installation || !repository) {
    throw new Error("Invalid payload");
  }
  const octokit = getOctokit(installation.id);

  const repoName = repository.name;
  const orgName = await getOrgName(octokit, repoName);
  const isPublic = repository.private === false;

  const texts = {
    created: {
      title: `New Public Repository: ${repoName}`,
      body: `A new public repository ${repoName} was created.`,
    },
    publicized: {
      title: `Repository Publicized: ${repoName}`,
      body: `The repository ${repoName} was changed from private to public.`,
    },
  };

  if (action === "created" && isPublic) {
    await createIssue(
      octokit,
      orgName,
      repoName,
      texts.created.title,
      texts.created.body
    );
    await createIssue(
      octokit,
      orgName,
      ORG_SETTING_REPO,
      texts.created.title,
      texts.created.body
    );
  } else if (action === "publicized") {
    await createIssue(
      octokit,
      orgName,
      repoName,
      texts.publicized.title,
      texts.publicized.body
    );
    await createIssue(
      octokit,
      orgName,
      ORG_SETTING_REPO,
      texts.publicized.title,
      texts.publicized.body
    );
  } else if (action === "privatized" || action === "deleted") {
    await deleteIssue(octokit, orgName, repoName);
    await deleteIssue(octokit, orgName, ORG_SETTING_REPO);
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
