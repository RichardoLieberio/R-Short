import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { ESLint } from 'eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        languageOptions: {
            parser: ESLint.parser,
            parserOptions: {
                project: './tsconfig.json',
                sourceType: 'module',
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': [ 'error' ],
            '@typescript-eslint/no-unsafe-argument': 'error',
            '@typescript-eslint/no-unsafe-call': [ 'error' ],
            '@typescript-eslint/explicit-function-return-type': [ 'error' ],
            '@typescript-eslint/typedef': [
                'error',
                {
                    variableDeclaration: true,
                    parameter: true,
                    memberVariableDeclaration: true,
                    propertyDeclaration: true,
                    arrayDestructuring: true,
                    objectDestructuring: true,
                },
            ],
            'indent': [ 'error', 4 ],
            'quotes': [
                'error',
                'single',
                {
                    'avoidEscape': true,
                    'allowTemplateLiterals': true,
                },
            ],
            'jsx-quotes': [ 'error', 'prefer-double' ],
            'array-bracket-spacing': [ 'error', 'always' ],
            'object-curly-spacing': [ 'error', 'always' ],
            'semi': [ 'error', 'always' ],
            'comma-dangle': [
                'error',
                {
                    'arrays': 'always-multiline',
                    'objects': 'always-multiline',
                    'imports': 'always-multiline',
                    'exports': 'always-multiline',
                    'functions': 'never',
                },
            ],
            'arrow-parens': [ 'error', 'always' ],
            'eol-last': [ 'error', 'always' ],
        },
        ignores: [ '**/*.mjs' ],
    },
];

export default eslintConfig;
