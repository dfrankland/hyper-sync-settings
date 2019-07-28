/* eslint-disable @typescript-eslint/no-var-requires */
const typescriptEslintRecommended = require('@typescript-eslint/eslint-plugin/dist/configs/recommended.json');
const typescriptEslintPrettier = require('eslint-config-prettier/@typescript-eslint');

module.exports = {
  env: {
    node: true,
  },
  parser: 'babel-eslint',
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['.eslintrc.js', 'rollup.config.js'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        devDependencies: [
          'rollup.config.js',
          '.eslintrc.js',
          '**/__tests__/**/*',
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      // NOTE: Workaround for no nested extends possible.
      // See https://github.com/eslint/eslint/issues/8813.
      // Working solution would be following, if we had nested extends:
      // ```
      // extends: [
      //   'airbnb-base',
      //   'plugin:@typescript-eslint/recommended',
      //   'prettier/@typescript-eslint',
      //   'prettier',
      // ],
      // ```
      plugins: ['@typescript-eslint', 'prettier'],
      rules: Object.assign(
        typescriptEslintRecommended.rules,
        typescriptEslintPrettier.rules,
        {
          '@typescript-eslint/explicit-function-return-type': 'error',
        },
      ),
    },
  ],
};
