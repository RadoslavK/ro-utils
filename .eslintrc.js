module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  "plugins": [
    "react-hooks",
    '@typescript-eslint',
  ],
  "extends": [
    "plugin:react-hooks/recommended",
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "error",
  },
};