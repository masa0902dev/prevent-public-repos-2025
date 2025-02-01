# prevent-public-repos-2025

[English](README.md) | [日本語](README.ja.md)

This is a GitHub App that monitors the creation of public repositories and changes from private to public within a GitHub Organization.  
It was created as a replacement for [`Prevent Public Repos`](https://github.com/issc29/probot-prevent-public-repos) by issc29, which is no longer functioning.

## Features

Actions Monitored:

- Creation of public repositories
- Changes from private to public

How This GitHub App Works:

- Creates an issue in both the affected repository and the `org-settings` repository.

Rate Limit:

- Currently, the monitored actions are limited to a maximum of **50 times per hour**.

<br />
※ Currently, the functionality to apply configurations from `.github/prevent-public-repos.yml` in the `org-settings` repository is not implemented.

## Installation in an Organization

1. [Install this GitHub App in your Organization](https://github.com/apps/prevent-public-repos-2025)

2. Create a repository named `org-settings` and add a `.github/prevent-public-repos.yml` file inside it. (Currently, this configuration file is not utilized.)

3. To test its functionality, try creating a public repository. An issue should be created in both that repository and the `org-settings` repository.

## Contribution

Contributions are welcome!

- There are no strict rules for PRs or issues.
- Contributions to the TODO section below would be greatly appreciated.
- Currently, merging requires approval from the CODEOWNER (`masa0902dev`).

## TODO

- [ ] Implement the functionality to apply settings from `.github/prevent-public-repos.yml` in the `org-settings` repository.

<br />

- [ ] Implement automatic reversion of public repositories to private (currently, only issue creation is supported).
- [ ] Add the ability to register repositories that should not be monitored for public status changes (currently, all repositories are monitored).
- [ ] Allow customization of issue title and body (currently, values from `constants.ts` are used).
- [ ] Implement email notification functionality for specified users.

## Special Thanks

- **issc29**: Author of [`Prevent Public Repos`](https://github.com/issc29/probot-prevent-public-repos)

※ This GitHub App `prevent-public-repos-2025` is independent of `Prevent Public Repos` by issc29, and no code has been reused, so if this GitHub App stops working, please open an issue in this repository.

- **tmknom**: Author of [`GitHubセキュリティ Organization運用のベストプラクティス`](https://zenn.dev/tmknom/books/github-organization-security)
