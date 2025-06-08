# Flutter Staff Engineer Roadmap

このプロジェクトは、Flutterエンジニアがスタッフエンジニアになるためのロードマップを提供するWebアプリケーションです。

## 概要

このアプリケーションは、Flutterエンジニアとしてのキャリアパスを可視化し、次のステップに進むために必要なスキルや知識を体系的に学ぶことを目的としています。

## 主な使用技術

- **フロントエンド:**
  - [React](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
- **バックエンド:**
  - [Supabase](https://supabase.com/)
- **テスト:**
  - [Vitest](https://vitest.dev/)
  - [Playwright](https://playwright.dev/)
- **UIコンポーネント開発:**
  - [Storybook](https://storybook.js.org/)
- **静的解析・フォーマット:**
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)
- **Gitフック:**
  - [Husky](https://typicode.github.io/husky/)
  - [lint-staged](https://github.com/lint-staged/lint-staged)

## セットアップ

1. **リポジトリをクローンします:**
   ```bash
   git clone https://github.com/your-username/flutter-staff-engineer-roadmap.git
   cd flutter-staff-engineer-roadmap
   ```

2. **依存関係をインストールします:**
   ```bash
   npm install
   ```

3. **環境変数を設定します:**
   `.env.local` ファイルを作成し、SupabaseのプロジェクトURLとAnonキーを設定します。

   ```.env.local
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **開発サーバーを起動します:**
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:5173` を開きます。

## 利用可能なスクリプト

- `npm run dev`: 開発モードでアプリケーションを起動します。
- `npm run build`: 本番用にアプリケーションをビルドします。
- `npm run lint`: ESLintを実行してコードをチェックします。
- `npm run preview`: ビルドされたアプリケーションをプレビューします。
- `npm run storybook`: Storybookを起動します。
- `npm run build-storybook`: Storybookをビルドします。
