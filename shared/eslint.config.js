import rootConfig from '../eslint.config.js';

export default [
  ...rootConfig,
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },
];
