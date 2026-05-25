import neostandard from 'neostandard'
import prettier from 'eslint-plugin-prettier/recommended'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
    ...neostandard(),
    prettier,
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
