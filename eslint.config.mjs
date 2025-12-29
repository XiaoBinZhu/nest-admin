import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  typescript: true,
  ignores: [
    '**/*.md',
  ],
}, {
  rules: {
    'no-console': 'off',
    'unused-imports/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 2,

    'ts/consistent-type-imports': 'off',
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/no-contradiction-with-assertion': 'off',
    'ts/no-unused-expressions': 'off',
    'ts/no-unsafe-function-type': 'off',
  },
})
