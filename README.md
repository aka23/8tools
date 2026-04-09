# 8tools.org

業務で使える無料の計算・変換ツールを集めたWebサイトです。

https://8tools.org

## ツール一覧（21種）

| カテゴリ | ツール |
|---------|--------|
| 建設・土木 | コンクリート打設量計算、人工計算 |
| 人事・労務 | 障害者雇用率計算、36協定残業時間カウンター、採用コスト計算 |
| 制度変更 | 106万の壁シミュレーター |
| 物流 | CBM計算 |
| 経理 | 稼働率・不良率計算 |
| 不動産 | 建築可能面積計算、減価償却早見 |
| 飲食・小売 | シフト人件費計算 |
| 税金・届出 | ふるさと納税控除額シミュレーター |
| 日付・時間 | 日数計算、時間計算、年齢計算 |
| 給与・人事 | 手取り計算シミュレーター |
| 数学・汎用 | パーセント計算 |
| ショッピング・日常 | 割引計算、税込・税抜計算 |
| 金融・投資 | 複利計算シミュレーター、金利計算 |

## 技術スタック

- [Next.js](https://nextjs.org/) 16 (App Router)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/) (グラフ表示)
- [Biome](https://biomejs.dev/) (Lint / Format)

## セットアップ

```bash
git clone https://github.com/your-username/8tools.git
cd 8tools
npm install
npm run dev
```

http://localhost:3000 で開発サーバーが起動します。

## コマンド

```bash
npm run dev       # 開発サーバー起動
npm run build     # プロダクションビルド
npm run start     # プロダクションサーバー起動
npx biome check . # Lint + Format チェック
npx tsc --noEmit  # 型チェック
```

## アーキテクチャ

```
src/
├── app/
│   ├── page.tsx                    # トップページ（ツール一覧）
│   ├── about/page.tsx              # About
│   ├── contact/page.tsx            # お仕事依頼
│   ├── privacy/page.tsx            # プライバシーポリシー
│   ├── terms/page.tsx              # 利用規約
│   ├── api/request/route.ts        # UGAリクエストAPI
│   └── tools/
│       └── [slug]/page.tsx         # 各ツール（1ファイル完結）
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── tools/ToolLayout.tsx        # ツール共通レイアウト
└── data/
    └── tools.json                  # ツールメタデータ
```

- 各ツールは `src/app/tools/[slug]/page.tsx` に1ファイルで完結
- 共通レイアウトは `ToolLayout` コンポーネントを使用
- すべての計算はクライアントサイドで実行（サーバー送信なし）

## ツールの追加方法

1. `src/data/tools.json` にメタデータを追加
2. `src/app/tools/[slug]/page.tsx` を作成
3. `ToolLayout` でラップし、入力 → 計算 → 結果 → 計算式説明の構造に従う

詳細は [CLAUDE.md](./CLAUDE.md) を参照してください。

## 環境変数（任意）

UGAリクエスト保存機能を有効にする場合のみ必要です。

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## ライセンス

[MIT](./LICENSE)
