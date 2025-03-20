# prevent-public-repos-2025

🔥Github Appの申請に通ったため、利用可能です!🔥

[English](README.md) | [日本語](README.ja.md)

Github Organization での Public レポジトリの作成・Private から Public への変更を監視する Github App です。  
issc29 氏の[`Prevent Public Repos`](https://github.com/issc29/probot-prevent-public-repos) が動かなくなっていたため作成しました。

## 機能

監視するアクション:

- Public レポジトリの作成
- Private から Public への変更

この Github App の動作:

- 該当レポジトリと `org-settings`レポジトリに issue を作成する

rate-limit:

- 現在は、対象アクションに対して 1 時間あたり最大 50 回に制限

<br />
※ 現在は、org-settings レポの.github/prevent-public-repos.yml を設定として適用する機能は未実装です。

## Organization への導入

1. [この Github Apps を Organization にインストール](https://github.com/apps/prevent-public-repos-2025)
2. `org-settings`という名前のレポジトリを作成し、その中に`.github/prevent-public-repos.yml`ファイルを作成（現在はこの設定ファイルを読み取る機能はありません）。
3. 動作確認のために、Public レポジトリを作成してみて下さい。そのレポジトリと`org-settings`レポジトリに issue が作成されるはずです！

## Contribution

Contribution は大歓迎です！

- PR や issue のルールは特にありません。一般的なスタンダードに準じて下さい。
- 下記の TODO セクション内容を contribute して下さるととても助かります。
- 現在は、マージには CODEOWNER (masa0902dev) による approve を必須にしています。

## TODO

- [ ] `org-settings`レポの`.github/prevent-public-repos.yml`から設定を適用する機能

<br />

- [ ] Public に変更されたレポジトリを 自動的に Private に戻す機能 （現在は issue を作成するのみ）
- [ ] Public 監視対象でないレポジトリを登録する機能 (現在は全レポジトリが対象)
- [ ] issue を立てる際の title, body をカスタマイズできる機能 (現在は constants.ts の値を使用)
- [ ] 指定ユーザへのメール送信機能

## Special Thanks

- issc29: [`Prevent Public Repos`](https://github.com/issc29/probot-prevent-public-repos) 作者様

※ この Github App `prevent-public-repos-2025`は issc29 氏の`Prevent Public Repos`からのコード流用がないため依存性はありません。もしこの Github App が動かなくなった場合は本レポジトリ への issue 立てをお願いします。

- tmknom: [`GitHubセキュリティ Organization運用のベストプラクティス`](https://zenn.dev/tmknom/books/github-organization-security) 著者様
