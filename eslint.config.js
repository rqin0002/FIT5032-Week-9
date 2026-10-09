import vue from 'eslint-plugin-vue'

export default [
  { ignores: ['node_modules/**', 'dist/**', '.agents/**', '.claude/**', '.git/**', 'functions/**', '.emulator-data/**', '.eslintrc.cjs'] },
  ...vue.configs['flat/essential'],
  {
    files: ['src/**/*.{js,vue}', 'scripts/**/*.mjs', 'tests/**/*.cjs', '*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        URL: 'readonly', console: 'readonly', window: 'readonly', document: 'readonly', navigator: 'readonly',
        setTimeout: 'readonly', clearTimeout: 'readonly', setImmediate: 'readonly',
        AbortController: 'readonly', AbortSignal: 'readonly', fetch: 'readonly',
        process: 'readonly', require: 'readonly', module: 'readonly', __dirname: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  }
]
