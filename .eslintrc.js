module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    semi: ['error', 'never'],
    'sort-keys': ['warn'],
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
  }
};
