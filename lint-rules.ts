module.exports = {
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'sort-keys-fix', 'typescript-sort-keys', 'sort-destructure-keys', 'unicorn'],
  root: true,
  rules: {
    'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
    'no-alert': ['off'],
    'no-template-curly-in-string': 1,
    'no-warning-comments': [2, { location: 'anywhere', terms: ['nocommit'] }],
    'prefer-const': 2,
    'react-native/no-inline-styles': ['off'],
    'react/jsx-sort-props': ['warn'],
    semi: ['error', 'never'],
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'sort-keys': 2,
    'sort-keys-fix/sort-keys-fix': 'warn',
    'typescript-sort-keys/interface': 2,
    'typescript-sort-keys/string-enum': 2,
    'unicorn/expiring-todo-comments': 2,
  },
}
