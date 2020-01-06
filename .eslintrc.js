module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-alert': ['off'],
    semi: ['error', 'never'],
    'sort-keys': ['warn'],
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'react/jsx-sort-props': ['warn'],
  },
}
