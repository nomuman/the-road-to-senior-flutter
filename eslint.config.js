// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import FlatCompat from '@eslint/compat';

import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  resolvePluginsRelativeTo: import.meta.dirname,
});

export default tseslint.config({ ignores: ['dist'] }, {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...compat.extends(
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
    ),
    prettierConfig, // Prettierとの競合を避ける
  ],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      ...globals.browser,
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    'react-refresh': reactRefresh,
  },
  rules: {
    // React 17以降のJSX変換に対応
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // その他のReactルール
    'react/prop-types': 'off', // TypeScriptを使用するため不要
    'react/display-name': 'off', // 必要に応じて調整
    // react-refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // TypeScript ESLintの推奨ルールを適用
    ...tseslint.configs.recommended.rules,
    // Prettierとの競合を避けるためのルールはeslint-config-prettierが処理
  },
  settings: {
    react: {
      version: compat.config({ settings: { react: { version: 'detect' } } }).settings.react.version,
    },
  },
}, storybook.configs["flat/recommended"]);
