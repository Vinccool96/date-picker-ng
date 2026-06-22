// @ts-check
import tseslint from 'typescript-eslint';

import rootConfig from '../../eslint.config.mjs';

export default tseslint.config(
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'dp',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'dp',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/no-output-native': 'off',
      '@angular-eslint/no-output-on-prefix': 'off',
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
);
