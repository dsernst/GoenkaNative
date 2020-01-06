module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'sort-keys-fix', 'typescript-sort-keys'],
  rules: {
    'no-alert': ['off'],
    semi: ['error', 'never'],
    'sort-keys-fix/sort-keys-fix': 'warn',
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'react/jsx-sort-props': ['warn'],
    'typescript-sort-keys/interface': 2,
    'typescript-sort-keys/string-enum': 2,
  },
}
