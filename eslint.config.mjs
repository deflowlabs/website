import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  { ignores: ['app/types/sanity.generated.ts'] },
  {
  rules: {
    // Vue
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  },
)
