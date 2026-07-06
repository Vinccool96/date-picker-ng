// @ts-check
import eslint from '@eslint/js';
import { includeIgnoreFile } from '@eslint/config-helpers';
import vitest from '@vitest/eslint-plugin';
import angular from 'angular-eslint';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default tseslint.config(
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      eslintPluginPrettierRecommended,
      eslintPluginUnicorn.configs.recommended,
      perfectionist.configs['recommended-natural'],
      jsdocPlugin.configs['flat/recommended-typescript-error'],
    ],
    settings: {
      perfectionist: {
        order: 'asc',
        partitionByComment: true,
        type: 'natural',
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      /*
       *****************************************************************************************************************
       * typescript-eslint
       *****************************************************************************************************************
       */

      '@typescript-eslint/explicit-function-return-type': ['error', { allowHigherOrderFunctions: false }],
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowNever: false,
          allowRegExp: false,
        },
      ],
      '@typescript-eslint/strict-boolean-expressions': ['error', { allowNullableObject: false, allowString: false }],
      '@typescript-eslint/unbound-method': [
        'error',
        {
          ignoreStatic: true,
        },
      ],

      /*
       *****************************************************************************************************************
       * eslint
       *****************************************************************************************************************
       */

      'curly': 'error',
      'eqeqeq': 'error',
      'no-multi-assign': 'error',
      'object-shorthand': ['error', 'always'],

      /*
       *****************************************************************************************************************
       * @jsdoc
       *****************************************************************************************************************
       */

      'jsdoc/multiline-blocks': ['error', { noSingleLineBlocks: true }],

      /*
       *****************************************************************************************************************
       * perfectionist
       *****************************************************************************************************************
       */

      'perfectionist/sort-classes': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: '^ngOnChanges$',
              groupName: 'ngOnChanges',
              selector: 'method',
            },
            {
              elementNamePattern: '^ngOnInit$',
              groupName: 'ngOnInit',
              selector: 'method',
            },
            {
              elementNamePattern: '^ngDoCheck$',
              groupName: 'ngDoCheck',
              selector: 'method',
            },
            {
              elementNamePattern: '^ngAfterContentInit$',
              groupName: 'ngAfterContentInit',
              selector: 'method',
            },
            {
              elementNamePattern: '^ngAfterContentChecked$',
              groupName: 'ngAfterContentChecked',
              selector: 'method',
            },
            {
              elementNamePattern: '^ngAfterViewInit$',
              groupName: 'ngAfterViewInit',
              selector: 'method',
            },
            {
              elementNamePattern: '^ngAfterViewChecked$',
              groupName: 'ngAfterViewChecked',
              selector: 'method',
            },
            {
              elementNamePattern: '^ngOnDestroy$',
              groupName: 'ngOnDestroy',
              selector: 'method',
            },
          ],
          groups: [
            'index-signature',
            ['property', 'accessor-property'],
            ['protected-property', 'protected-accessor-property'],
            ['private-property', 'private-accessor-property'],
            'constructor',
            'ngOnChanges',
            'ngOnInit',
            'ngDoCheck',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'ngOnDestroy',
            'method',
            'protected-method',
            'private-method',
            ['get-method', 'set-method'],
            'static-property',
            'static-block',
            'static-method',
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: '^id',
              groupName: 'id',
            },
            {
              elementNamePattern: '^key',
              groupName: 'key',
            },
            {
              elementNamePattern: '^name',
              groupName: 'name',
            },
            {
              elementNamePattern: '^selector',
              groupName: 'selector',
            },
            {
              elementNamePattern: '^imports',
              groupName: 'imports',
            },
            {
              elementNamePattern: '^declarations',
              groupName: 'declarations',
            },
            {
              elementNamePattern: '^standalone',
              groupName: 'standalone',
            },
            {
              elementNamePattern: '^templateUrl',
              groupName: 'templateUrl',
            },
            {
              elementNamePattern: '^template',
              groupName: 'template',
            },
            {
              elementNamePattern: '^styleUrl',
              groupName: 'styleUrl',
            },
            {
              elementNamePattern: '^styleUrls',
              groupName: 'styleUrls',
            },
            {
              elementNamePattern: '^styles',
              groupName: 'styles',
            },
            {
              elementNamePattern: '^component',
              groupName: 'component',
            },
            {
              elementNamePattern: '^provide(rs)?',
              groupName: 'providers',
            },
            {
              elementNamePattern: '^exports',
              groupName: 'exports',
            },
            {
              elementNamePattern: '^bootstrap',
              groupName: 'bootstrap',
            },
            {
              elementNamePattern: '^changeDetection',
              groupName: 'changeDetection',
            },
            {
              elementNamePattern: '^encapsulation',
              groupName: 'encapsulation',
            },
            {
              elementNamePattern: '^viewProviders',
              groupName: 'viewProviders',
            },
            {
              elementNamePattern: '^host',
              groupName: 'host',
            },
            {
              elementNamePattern: '^hostDirectives',
              groupName: 'hostDirectives',
            },
            {
              elementNamePattern: '^inputs',
              groupName: 'inputs',
            },
            {
              elementNamePattern: '^outputs',
              groupName: 'outputs',
            },
            {
              elementNamePattern: '^animations',
              groupName: 'animations',
            },
            {
              elementNamePattern: '^schemas',
              groupName: 'schemas',
            },
            {
              elementNamePattern: '^exportAs',
              groupName: 'exportAs',
            },
            {
              elementNamePattern: '^queries',
              groupName: 'queries',
            },
            {
              elementNamePattern: '^preserveWhitespaces',
              groupName: 'preserveWhitespaces',
            },
            {
              elementNamePattern: '^jit',
              groupName: 'jit',
            },
            {
              elementNamePattern: '^moduleId',
              groupName: 'moduleId',
            },
            {
              elementNamePattern: '^interpolation',
              groupName: 'interpolation',
            },
            {
              elementNamePattern: '^pure',
              groupName: 'pure',
            },
            {
              elementNamePattern: '^path',
              groupName: 'path',
            },
          ],
          groups: [
            'id',
            'key',
            'name',
            'selector',
            'imports',
            'declarations',
            'standalone',
            'templateUrl',
            'template',
            'styleUrl',
            'styleUrls',
            'styles',
            'component',
            'providers',
            'exports',
            'bootstrap',
            'changeDetection',
            'encapsulation',
            'viewProviders',
            'host',
            'hostDirectives',
            'inputs',
            'outputs',
            'animations',
            'schemas',
            'exportAs',
            'queries',
            'preserveWhitespaces',
            'jit',
            'moduleId',
            'interpolation',
            'pure',
            'path',
            'unknown',
          ],
          type: 'natural',
        },
      ],
      'perfectionist/sort-union-types': [
        'error',
        {
          groups: ['keyword', 'unknown', 'nullish'],
          type: 'natural',
        },
      ],

      /*
       *****************************************************************************************************************
       * unicorn
       *****************************************************************************************************************
       */

      'unicorn/consistent-class-member-order': 'off',
      'unicorn/name-replacements': [
        'error',
        {
          replacements: {
            dir: false,
            prod: false,
            ref: false,
            tmpl: { template: true },
            util: false,
            utils: false,
          },
        },
      ],
      'unicorn/no-null': 'off',

      /*
       *****************************************************************************************************************
       * angular-eslint
       *****************************************************************************************************************
       */

      '@angular-eslint/no-output-native': 'off',
      '@angular-eslint/no-output-on-prefix': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'perfectionist/sort-interfaces': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: '^id$',
              groupName: 'first',
            },
          ],
          groups: ['first', 'unknown'],
          type: 'natural',
          useConfigurationIf: {
            declarationMatchesPattern: 'Form$',
          },
        },
        {
          type: 'natural',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
  {
    files: ['**/*.spec.ts', '**/test/*.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      '@typescript-eslint/unbound-method': 'off',
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.builtin,
        ...globals.vitest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['**/dist/**/*'],
  },
);
