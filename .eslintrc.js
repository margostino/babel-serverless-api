module.exports = {
  extends: ['../../.eslintrc.js'],
  overrides: [
    {
      // don't want to apply prettier to automatically generated files
      files: ['./generated/*'],
      rules: {
        'prettier/prettier': 0,
      },
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
  ],
  rules: {
    'import/order': [
      'warn',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'external',
            pattern: 'react+(|-native)',
            position: 'before',
          },
          {
            group: 'external',
            pattern: '@kla*/**',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
      },
    ],
  },
}
