# CLAUDE.md — 8TOOLS

8TOOLSは無料Webツール集。計算・変換ツールを量産するサイト。

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


