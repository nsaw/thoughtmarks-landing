// .eslintrc.cjs
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'worker/node_modules/',
    'public/',
    'scripts/build/',
    '*.backup.*',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // We use TypeScript for types.
    'react/prop-types': 'off',
    // React 17+ automatic JSX transform (React doesn't need to be in scope).
    'react/react-in-jsx-scope': 'off',
    // Marketing copy uses apostrophes (e.g. "You're") intentionally.
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['worker/**/*.ts'],
      env: { browser: false, node: true },
    },
  ],
};


