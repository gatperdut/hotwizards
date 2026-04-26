import globals from 'globals';
import rootConfig from '../eslint.config.js';

export default [
  ...rootConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
            properties: 'no-public',
          },
        },
      ],
    },
  },
];
