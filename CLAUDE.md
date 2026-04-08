# CLAUDE.md — 8tools.org

8tools.orgは無料Webツール集。計算・変換ツールを量産するサイト。

## コマンド
- Dev: `npm run dev`
- Build: `npm run build`
- Lint/Format: `npx biome check --apply .`
- Type check: `npx tsc --noEmit`

## 技術スタック
- Next.js 15 (App Router) / Vercel / Tailwind CSS / shadcn/ui
- TypeScript strict mode
- Font: Inter + Noto Sans JP
- DB: Supabase（UGAリクエスト保存用。必要時のみ接続）

## アーキテクチャ
- 各ツールは `src/app/tools/[slug]/page.tsx` に1ファイルで実装
- 共通レイアウトは `src/components/tools/ToolLayout.tsx` を必ず使う
- ツールメタデータは `src/data/tools.json` で一元管理
- ページは6種のみ: `/`, `/about`, `/contact`, `/privacy`, `/terms`, `/tools/[slug]`

## コーディング規約
- 関数コンポーネント + hooks。`"use client"` は必要箇所のみ
- 全UIテキストは日本語で書く。英語にしない
- 環境変数はプレースホルダー `{{VAR_NAME}}` で記述し注釈を添える

## ツール実装パターン
各ツールの構造は必ず以下の順序:
1. タイトル（h1）
2. 説明（1行）
3. 入力フィールド
4. 計算ボタン（1つ）
5. 結果表示（大きく）
6. 計算式の説明（SEO用テキスト）
7. 免責事項

## やらないこと
- ログイン / アカウント / 認証機能
- サイドバー
- ダークモード
- 既存ツールへの機能追加（新しいツールとして分離する）
- 画像・イラスト・グラデーション・シャドウの装飾

## LLM Wiki

プロジェクトのナレッジベース。RAGではなく、LLMが構造化Wikiを漸進的に構築・維持するパターン。

### 構造（3層）

| 層 | パス | 説明 |
|---|---|---|
| Raw Sources | `wiki/sources/` | 元資料（記事・論文・データ）。LLMは読むだけ。改変しない |
| Wiki | `wiki/` | LLMが生成・維持するMarkdownページ群。エンティティ・概念・比較・要約等 |
| Schema | この`CLAUDE.md`のセクション | Wiki構造・規約・ワークフローの定義 |

### ファイル規約

- `wiki/index.md` — 全ページのカタログ。カテゴリ別にリンク＋1行要約。取り込み時に必ず更新
- `wiki/log.md` — 追記専用の操作ログ。`## [YYYY-MM-DD] 種別 | タイトル` 形式
- Wikiページは `wiki/` 直下にケバブケース `.md` で作成（例: `wiki/nextjs-app-router.md`）
- ページ間は `[リンクテキスト](ファイル名.md)` で相互参照
- 矛盾がある場合はページ内で明示的にフラグする

### 操作

**取り込み (ingest)**
1. ソースを `wiki/sources/` に配置
2. LLMがソースを読み、要点を抽出
3. 新規ページ作成 or 既存ページ更新（要約・エンティティ・相互参照）
4. `wiki/index.md` を更新
5. `wiki/log.md` にエントリ追記

**質問 (query)**
1. `wiki/index.md` を読み関連ページを特定
2. 関連ページを読み回答を合成（出典付き）
3. 有用な回答はWikiページとして保存可能

**整合チェック (lint)**
1. 矛盾・古い記述・孤立ページ・欠落リンクを検出
2. データギャップを特定し、調査すべき新しいソース・質問を提案

### やらないこと（Wiki）
- ソースファイルの改変
- index.md / log.md 以外のメタファイル増殖
- Wikiページへの主観的意見の記載（事実とソースのみ）

