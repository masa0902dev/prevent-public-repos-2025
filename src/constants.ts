export const targetActions = ["created", "publicized"];

export const issueTexts = {
  create: {
    title: (repoName: string) => `🚨CAUTION🚨 new PUBLIC repository ${repoName} created`,
    body: (repoName: string) => `A new public repository ${repoName} was created.`,
  },
  publicize: {
    title: (repoName: string) => `🚨CAUTION🚨 existing repository ${repoName} PUBLICIZED`,
    body: (repoName: string) =>
      `The repository ${repoName} was changed from private to public.`,
  },
};
