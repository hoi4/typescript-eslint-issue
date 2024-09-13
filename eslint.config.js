// @ts-check

const globals = require('globals');
const tseslint = require('typescript-eslint');
const js = require('@eslint/js');
const jsoncParser = require('jsonc-eslint-parser');
const nx = require('@nx/eslint-plugin');
const eslint = require('@eslint/js');

// - - - - - - - - - - - - - - - - - - - - - - -
// Tooling: npx @eslint/config-inspector@latest
// - - - - - - - - - - - - - - - - - - - - - - -

module.exports = tseslint.config(
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },

  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {},
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      '@nx': nx,
    },
    languageOptions: {
      // necessary to make sure that something like 'module.exports' can be used without an eslint error
      globals: globals.node,
    },
    extends: [js.configs.recommended],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },

  ...tseslint.config({
    name: 'custom-typescript',
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    rules: {
      // ESLINT BUILT-IN
      curly: 'error',
      eqeqeq: ['error', 'always'],
      'no-param-reassign': 'error',
      'no-useless-escape': 'off',
      'default-case': 'error',
      'max-classes-per-file': ['error', 1],
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-irregular-whitespace': 'off',
      'no-new-func': 'error',
      'no-template-curly-in-string': 'error',
      radix: 'error',
      'object-shorthand': ['error', 'always'],
      'no-useless-rename': 'error',

      // TYPESCRIPT ESLINT
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/typedef': [
        'error',
        {
          arrayDestructuring: false,
          arrowParameter: true,
          memberVariableDeclaration: true,
          objectDestructuring: false,
          parameter: true,
          propertyDeclaration: true,
          variableDeclaration: false,
          variableDeclarationIgnoreFunction: true,
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },

        // Force leading underscore for private variables
        {
          selector: [
            'classProperty',
            'classMethod',
            'parameterProperty',
            'accessor',
          ],
          format: ['camelCase'],
          leadingUnderscore: 'require',
          trailingUnderscore: 'forbid',
          modifiers: ['private'],
        },

        // Allow class properties to be in PascalCase and UPPER_CASE
        // This is convenient for binding enums and constants to the template in order to keep the same name between the
        // enum / constant itself and the property
        {
          selector: 'classProperty',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
        },

        // static class properties should be UPPER_CASE (does not apply to private static properties)
        {
          selector: 'classProperty',
          format: ['UPPER_CASE'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
          modifiers: ['static'],
        },

        // Avoid checking object literals etc. as we do not have control over third party libraries like e.g. froala etc.
        {
          selector: [
            'objectLiteralProperty',
            'objectLiteralMethod',
            'typeProperty',
          ],
          format: null,
        },

        // Allow unused parameters to start with an underscore (this is in sync with typescript's noUnusedParameters option)
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
          modifiers: ['unused'],
        },

        // don't start interface name with I (e.g. IInterfaceName)
        {
          selector: 'interface',
          format: ['StrictPascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          // These are the rule's default options. When not explicitly specifying them, it does
          // not work for some things (e.g., public method after private method is ok then for some
          // reason)
          default: [
            // Index signature
            'signature',
            'call-signature',

            // Fields
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            '#private-static-field',

            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            '#private-instance-field',

            'public-abstract-field',
            'protected-abstract-field',

            'public-field',
            'protected-field',
            'private-field',
            '#private-field',

            'static-field',
            'instance-field',
            'abstract-field',

            'field',

            // Static initialization
            'static-initialization',

            // Constructors
            'public-constructor',
            'protected-constructor',
            'private-constructor',

            'constructor',

            // Methods
            'public-static-method',
            'protected-static-method',
            'private-static-method',
            '#private-static-method',

            'public-decorated-method',
            'protected-decorated-method',
            'private-decorated-method',

            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
            '#private-instance-method',

            'public-abstract-method',
            'protected-abstract-method',

            'public-method',
            'protected-method',
            'private-method',
            '#private-method',

            'static-method',
            'instance-method',
            'abstract-method',

            'decorated-method',

            'method',
          ],
        },
      ],
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'no-public',
        },
      ],
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: true,
        },
      ],
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-meaningless-void-operator': [
        'error',
        {
          checkNever: true,
        },
      ],
    },
  }),

  // Global ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      '.jest-cache/',
      '**/mockServiceWorker.js',
      '.nx/**',
      '.angular/**',
      '**/eslint.config.js',
      '**/tsconfig*.json',
    ],
  }
);
