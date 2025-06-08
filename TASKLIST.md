# Flutter学習アプリ 開発タスクリスト

Headspaceの求人レベルに到達するためのFlutter学習アプリ開発プロジェクトのタスクリストです。
`rules.md`で定義された技術スタックと設計原則に基づいています。

## フェーズ 1: プロジェクト基盤構築 (Foundation)

- [x] **1.1. 開発ツールチェイン設定**:
    - [x] `ESLint`, `Prettier` をインストールし、`package.json` にスクリプトを追加する。
    - [x] `lint-staged` と `Husky` を設定し、コミット時に自動でLintとFormatが実行されるようにする。
- [x] **1.2. ディレクトリ構成**:
    - [x] `src`配下に `app`, `pages`, `widgets`, `features`, `entities`, `shared` のディレクトリを作成する。
- [x] **1.3. UI基盤**:
    - [x] `Tailwind CSS` の設定を行う。
    - [x] `shadcn/ui` を初期化し、`Button`, `Card`, `Dialog`, `Accordion` コンポーネントを追加する。
    - [x] `Storybook` を導入し、`Button` コンポーネントのStoryを作成する。
- [x] **1.4. アプリケーション設定**:
    - [x] `src/app/providers` に、テーマ管理（ライト/ダーク）のContextProviderを作成する。
    - [x] `src/app/App.tsx` でグローバルなレイアウトとProvider設定を行う。
    - [x] `ErrorBoundary` コンポーネントを `src/app/providers` に作成し、適用する。

## フェーズ 2: バックエンドとデータモデル (Backend & Data Model)

- [x] **2.1. Supabaseプロジェクト設定**:
    - [x] Supabaseプロジェクトを作成し、APIキーを取得する。
    - [x] `.env.local` ファイルを作成し、SupabaseのURLとキーを設定する。
- [x] **2.2. データベーススキーマ定義**:
    - [x] `users`, `modules`, `lessons`, `quizzes`, `user_progress` テーブルを設計する。
    - [x] Supabaseのマイグレーション機能を使って、テーブルを作成するSQLファイルを記述・実行する。
- [x] **2.3. 型定義とAPIクライアント**:
    - [x] `src/shared/api/supabase.ts` にSupabaseクライアントのインスタンスを作成する。
    - [x] `zod` を使って、各テーブルに対応するスキーマ定義を `src/entities/*/model/types.ts` に作成する。
- [x] **2.4. 認証機能**:
    - [x] `TanStack Query` と `Zustand` を使った認証状態管理フック (`src/features/auth/model/useAuth.ts`) を作成する。
    - [x] `src/features/auth` に、SupabaseのEmail/Password認証UIコンポーネントを作成する。
    - [ ] ログイン・ログアウト機能を実装し、ナビゲーションガードを設定する。

## フェーズ 3: コア学習機能 (Core Learning Features)

- [ ] **3.1. 学習データ取得**:
    - [ ] `TanStack Query` を使い、学習モジュールとレッスンの一覧を取得するフック (`src/entities/lesson/api/queries.ts`) を作成する。
- [x] **3.2. 学習画面UI**:
    - [x] `src/pages/LearnPage.tsx` を作成する。
    - [ ] `src/widgets/ModuleAccordion` ウィジェットを作成し、モジュール一覧を表示する。
    - [ ] `src/entities/lesson/ui/LessonItem` コンポーネントを作成し、レッスン情報を表示する。
- [ ] **3.3. 学習詳細表示**:
    - [ ] `src/widgets/LessonDetailModal` ウィジェットを作成する。
    - [ ] レッスンを選択した際に、モーダルで詳細（目的、コンセプト、関連性）を表示する。
- [ ] **3.4. 進捗管理機能**:
    - [ ] `TanStack Query` の `useMutation` を使い、レッスンの完了状態を更新するフック (`src/features/progress/api/mutations.ts`) を作成する。
    - [ ] `LessonItem` 内にチェックボックスを配置し、進捗更新機能を呼び出す。
    - [ ] ユーザーの進捗状況に応じてUIが即座に更新されるようにする（Optimistic Updates）。

## フェーズ 4: クイズ機能 (Quiz Feature)

- [ ] **4.1. クイズデータ取得**:
    - [ ] `TanStack Query` を使い、特定のレッスンに紐づくクイズを取得するフックを作成する。
- [ ] **4.2. クイズ実行UI**:
    - [ ] `src/features/quiz/ui/QuizModal` コンポーネントを作成する。
    - [ ] 質問、選択肢、次の問題へ進むボタンなどを配置する。
- [ ] **4.3. クイズ状態管理**:
    - [ ] `Zustand` を使い、現在の問題番号、選択した回答、スコアなどを管理するストア (`src/features/quiz/model/store.ts`) を作成する。
- [ ] **4.4. クイズ結果表示**:
    - [ ] クイズ完了後、スコアとフィードバックを表示する `QuizResult` コンポーネントを作成する。
    - [ ] クイズ結果を `user_progress` テーブルに保存する処理を追加する。

## フェーズ 5: 補助機能と画面 (Auxiliary Features & Pages)

- [x] **5.1. ホーム画面**:
    - [x] `src/pages/HomePage.tsx` を作成する。
    - [ ] `src/widgets/OverallProgress` ウィジェットを作成し、全体の学習進捗率を円グラフなどで表示する。
    - [ ] 次に取り組むべきレッスンへのショートカットを配置する。
- [x] **5.2. ロードマップ画面**:
    - [x] `src/pages/RoadmapPage.tsx` を作成する。
    - [ ] 全てのレッスンを時系列のビジュアルで表示する。
    - [ ] `user_progress` データと連携し、完了したステップをハイライトする。
- [x] **5.3. プロフィール画面**:
    - [x] `src/pages/ProfilePage.tsx` を作成する。
    - [ ] ユーザー名やアバターの表示・編集機能を追加する。
    - [x] テーマ（ライト/ダーク）切り替え機能を実装する。

## フェーズ 6: テストと品質保証 (Testing & QA)

- [x] **6.1. テスト環境設定**:
    - [x] `Jest` と `React Testing Library` の設定を行う。
    - [ ] `Playwright` の設定を行い、E2Eテストの準備を整える。
- [ ] **6.2. テスト実装**:
    - [ ] `useAuth` や `useProgress` などの重要なカスタムフックに対して単体テストを記述する。
    - [ ] `ModuleAccordion` や `QuizModal` などの主要なウィジェット・フィーチャーに対してコンポーネントテストを記述する。
    - [ ] 「ログイン→レッスン完了→クイズ受験→ログアウト」のユーザーフローでE2Eテストを記述する。

## フェーズ 7: デプロイと公開 (Deployment)

- [ ] **7.1. CI/CDパイプライン構築**:
    - [ ] `GitHub Actions` のワークフローファイルを作成する。
    - [ ] `develop` ブランチへのPR時に、Lint, Test, Buildが実行されるように設定する。
    - [ ] `main` ブランチへのマージ時に、`Vercel` または `Netlify` へ自動でデプロイされるように設定する。
- [ ] **7.2. 本番環境準備**:
    - [ ] 本番用のSupabase環境設定を行う。
    - [ ] OGPやfaviconなどのメタ情報を設定する。