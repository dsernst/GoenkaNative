module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['**/*.tsx', '**/*.js'],
      rules: {
        'react-hooks/exhaustive-deps': 'off',
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
};
