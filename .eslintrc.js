module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'sort-keys-fix', 'typescript-sort-keys', 'sort-destructure-keys'],
  rules: {
    'lines-between-class-members': ['warn'],
    'no-alert': ['off'],
    'react/jsx-sort-props': ['warn'],
    semi: ['error', 'never'],
    'sort-keys-fix/sort-keys-fix': 'warn',
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'typescript-sort-keys/interface': 2,
    'typescript-sort-keys/string-enum': 2,
    'react-native/no-inline-styles': ['off'],
    'sort-destructure-keys/sort-destructure-keys': 2,
    'prefer-const': 2,
  },
}
