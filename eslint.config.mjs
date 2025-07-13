import { defineConfig } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default defineConfig([
    {
        extends: compat.extends('standard', 'plugin:prettier/recommended'),

        plugins: {
            prettier,
        },

        rules: {
            'prettier/prettier': 'error',
        },
    },
    {
        files: ['src/frontend/**/*.js'],

        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        files: ['src/backend/**/*.js'],

        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['tests/**/*.js'],

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
                ...globals.jasmine,
            },
        },
    },
])
