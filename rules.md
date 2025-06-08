# 開発ルール (Development Rules)

このプロジェクトは、「HeadspaceのStaff Software Engineer, Flutter求人に合格するレベルの知識を習得する」という明確な目標を持った学習アプリを開発するためのものです。
一貫性、品質、効率性を保つため、以下のルールを遵守します。

## 1. 開発思想 (Development Philosophy)

- **目標志向 (Goal-Oriented)**: すべての機能と学習コンテンツは、Headspaceの求人票に記載されているスキルセット（Flutter, Dart, BLoC, MVVM, TDD, ネイティブ連携など）の習得に直結するものでなければなりません。
- **シンプルさと保守性 (Simplicity & Maintainability)**: 複雑な実装よりも、シンプルで理解しやすく、将来的にメンテナンスしやすいコードを優先します。
- **ベストプラクティスの追求 (Pursuit of Best Practices)**: React, TypeScript, Supabaseの最新のベストプラクティスを積極的に学び、採用します。

## 2. 技術スタック (Tech Stack)

- **フロントエンド**: React, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **状態管理**: Zustand (クライアント状態), TanStack Query (サーバー状態)
- **バックエンド**: Supabase (Auth, Database, Storage)
- **テスト**: Jest, React Testing Library, Storybook, Playwright (E2E)
- **フォーマット/Linter**: Prettier, ESLint

## 3. コーディングスタイルと設計原則 (Coding & Design Principles)

- **フォーマッターとリンター**:
  - `Prettier` と `ESLint` の設定を必須とし、コミット前に `lint-staged` と `Husky` で自動実行します。
- **命名規則**:
  - **コンポーネント**: `PascalCase` (例: `LearningModule.tsx`)
  - **変数・関数**: `camelCase` (例: `learningData`)
  - **型定義・Interface**: `PascalCase` (例: `type Lesson = { ... }`)
  - **カスタムフック**: `use`プレフィックス (例: `useLearningProgress.ts`)
- **ファイル・フォルダ構成 (Feature-Sliced Design思想を取り入れる)**:
  - `src/app`: アプリ全体の設定、プロバイダー、グローバルスタイル。
  - `src/pages`: 各ページのコンポーネント。
  - `src/widgets`: 複数のエンティティや機能を組み合わせた複合コンポーネント（例: ヘッダー、サイドバー）。
  - `src/features`: 特定のビジネスロジックを持つ機能群（例: クイズ機能、進捗更新機能）。
  - `src/entities`: ビジネスエンティティに関連するコンポーネントやロジック（例: User, Lesson）。
  - `src/shared`: プロジェクト全体で再利用可能なUIコンポーネント、ヘルパー関数、型定義、定数など。
- **コンポーネント設計**:
  - **Presentational/Container分離**: ロジックを持つContainerコンポーネントと、UI表示に専念するPresentationalコンポーネントを意識的に分離します。
  - **Storybookの活用**: `src/shared/ui` に配置する汎用コンポーネントは、必ずStorybookでカタログ化し、視覚的なテストを行います。
- **TypeScript**:
  - `any` 型の使用は**厳禁**とします。型が不明な場合は `unknown` を使用し、型ガードで安全に扱います。
  - APIレスポンスなど、外部データの型定義には `zod` を使用してバリデーションと型安全を両立させます。

## 4. 状態管理 (State Management)

- **クライアント状態**: UIの状態やセッション情報など、クライアント側で完結する状態は `Zustand` で管理します。
- **サーバー状態**: Supabaseからのデータ取得・更新・キャッシュは `TanStack Query (React Query)` で管理します。ローディング、エラー、再取得などの複雑な非同期処理はTanStack Queryに一任します。
- **React Context**: 静的な値（テーマ情報など）のDI（依存性注入）に限定して使用します。

## 5. バックエンド連携 (Backend Integration)

- **Supabaseクライアント**: Supabaseクライアントはシングルトンとしてインスタンス化し、`src/shared/api/supabase.ts` で管理します。
- **APIリクエスト**: Supabaseとの通信は、`TanStack Query` の `useQuery`, `useMutation` フックを介して行います。
- **データベーススキーマ**: データベースのテーブル定義や変更は、Supabaseのマイグレーション機能を用いて管理します。

## 6. テスト (Testing)

- **テストの種類**:
  - **単体テスト (Unit Test)**: ヘルパー関数やカスタムフックのロジックを `Jest` でテストします。
  - **コンポーネントテスト (Component Test)**: コンポーネントの振る舞いを `React Testing Library` と `Storybook` でテストします。
  - **E2Eテスト (End-to-End Test)**: 主要なユーザーフロー（例: ログインからクイズ完了まで）を `Playwright` でテストします。
- **テストカバレッジ**: 主要なビジネスロジックについては、カバレッジ **80%** を目標とします。

## 7. Git & GitHub

- **ブランチ戦略**:
  - `main`: 本番環境。直接のコミットは禁止。
  - `develop`: 開発のベース。
  - `feature/issue-name`: 機能開発やバグ修正を行うブランチ。
- **コミットメッセージ**: [Conventional Commits](https://www.conventionalcommits.org/) に従います。
- **Pull Request (PR)**:
  - `develop` へのマージはPRを経由します。
  - CI（Lint, Test, Build）の成功と、1人以上のレビューを必須とします。

## 8. エラーハンドリングとセキュリティ (Error Handling & Security)

- **エラーバウンダリ**: Reactの `ErrorBoundary` コンポーネントを導入し、一部のUIエラーがアプリケーション全体をクラッシュさせないようにします。
- **環境変数**:
  - APIキーなどの機密情報は `.env.local` ファイルで管理し、Gitの追跡対象から除外します。
  - 環境変数は `VITE_` プレフィックスを付けてクライアントサイドで利用可能にします。