// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import cypress from 'eslint-plugin-cypress';

export default [
  {
    ignores: ['dist/', 'build/', 'node_modules/'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    // Disable unknown-property check for Three.js/React Three Fiber
    files: ['**/components/Animation/**/*.jsx'],
    rules: {
      'react/no-unknown-property': 'off',
    },
  },
  {
    files: [
      'cypress/**/*.cy.{js,ts,jsx,tsx}',
      'cypress/**/*.spec.{js,ts,jsx,tsx}',
      'cypress/support/**/*.js',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
    plugins: {
      cypress,
    },
    rules: {
      ...cypress.configs.recommended.rules,
    },
  },
];
