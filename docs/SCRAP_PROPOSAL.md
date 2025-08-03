# Scrap一覧機能 設計案

## 概要

Obsidianで記述したメモ（以下、Scrap）をGitHubリポジトリ経由でWebサイトのトップページに一覧表示するためのAPI機能。

## アーキテクチャ方針

パフォーマンスと将来の拡張性を考慮し、Cloudflare D1データベースとGitHub APIを組み合わせたハイブリッドなアプローチを採用する。

-   **メタデータ管理:** Cloudflare Workersの定期実行（Cron Trigger）を用いて、GitHubリポジトリ内のScrapファイル（Markdown）のメタデータ（ファイル名、パス、更新日時など）を定期的に取得し、Cloudflare D1データベースに保存・同期する。
-   **コンテンツ取得:** APIリクエストに応じて、D1からメタデータを、GitHub APIからScrapの本文（Markdown）をそれぞれ取得する。

これにより、一覧表示の高速化（D1から取得）と、GitHub APIの利用効率の最適化を両立する。

## 処理フロー

### 1. データ同期（定期的）

```
[Scheduled Worker] -> [GitHub API] -> [Cloudflare D1]
```

1.  **トリガー:** CloudflareのCron Triggerが設定された間隔（例: 1時間ごと）でWorkerを起動する。
2.  **ファイル一覧取得:** WorkerがGitHub APIを呼び出し、指定されたリポジトリ・ディレクトリ（例: `scraps/`）内のMarkdownファイル一覧を取得する。
3.  **差分検出:** 取得したファイル一覧と、D1に保存されている現在のメタデータとを比較する。
    -   **追加:** GitHubにのみ存在するファイルは、新しいメタデータとしてD1に追加する。
    -   **削除:** D1にのみ存在するファイルは、メタデータをD1から削除する。
    -   **更新:** （任意）更新日時を比較し、変更があればD1のメタデータを更新する。

### 2. APIリクエスト

#### Scrap一覧取得

```
[Browser] <-> [Cloudflare Worker (API)] <-> [Cloudflare D1]
```

-   **エンドポイント:** `GET /api/scraps`
-   **処理:**
    1.  APIリクエストを受け付ける。
    2.  D1データベースに接続し、保存されているScrapのメタデータ一覧を取得する。
    3.  取得したメタデータ一覧をJSON形式でクライアントに返す。

#### Scrap詳細取得

```
[Browser] <-> [Cloudflare Worker (API)] <-> [D1 & GitHub API]
```

-   **エンドポイント:** `GET /api/scraps/:filename`
-   **処理:**
    1.  APIリクエストでファイル名を受け取る。
    2.  D1データベースを検索し、該当するファイルのメタデータ（特にGitHub上のパス）を取得する。
    3.  取得したパスを元にGitHub APIを呼び出し、Markdownファイルの本文を取得する。
    4.  D1のメタデータとGitHubの本文を組み合わせ、JSON形式でクライアントに返す。

## データベーススキーマ（D1）

`scraps`テーブル

| カラム名    | 型      | 説明                               |
| :---------- | :------ | :--------------------------------- |
| `id`        | INTEGER | 主キー（自動インクリメント）       |
| `filename`  | TEXT    | ファイル名 (例: `my-first-scrap.md`) |
| `path`      | TEXT    | GitHubリポジトリ内のファイルパス   |
| `sha`       | TEXT    | ファイルのSHAハッシュ              |
| `created_at`| INTEGER | 作成日時（UNIXタイムスタンプ）     |
| `updated_at`| INTEGER | 最終更新日時（UNIXタイムスタンプ） |

## 必要な技術要素

-   **Cloudflare Workers:** APIロジック、定期実行
-   **Cloudflare D1:** メタデータストレージ
-   **Hono:** ルーティング
-   **Drizzle ORM:** D1へのアクセス
-   **GitHub API:** ファイル一覧・内容の取得
-   **ライブラリ:** `@octokit/rest`（GitHub APIクライアント）
