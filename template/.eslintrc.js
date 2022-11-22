module.exports = {
  root: true,
  ignorePatterns: [
    '**/dist/**/*',
    '!**/.gitlab-ci.yml',
    '!**/.eslintrc.js',
    'packages/*/src/auto-imports.d.ts',
    '**/*-generated.*',
  ],
  globals: { tc: true, _: true, gql: true },
  extends: ['plugin:tyrecheck/recommended'],
}
