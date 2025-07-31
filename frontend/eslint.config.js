// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginCypress from 'eslint-plugin-cypress';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,

      // Customize rules
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/prop-types': 'off',
    },
  },

  // ✅ Cypress support
  {
    files: ['cypress/**/*.cy.{js,ts,jsx,tsx}', 'cypress/**/*.spec.{js,ts,jsx,tsx}', 'cypress/support/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
    plugins: {
      cypress: eslintPluginCypress,
    },
    rules: {
      ...eslintPluginCypress.configs.recommended.rules,
    },
  },
];
