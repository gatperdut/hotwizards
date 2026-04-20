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
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
    },
  },
];
