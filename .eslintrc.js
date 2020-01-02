module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "plugin:react/recommended",
    "standard",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "immutable"
  ],
  rules: {
    "max-len": ["error", {"code": 100}],
    "@typescript-eslint/no-unused-vars": ["error"],
    "quotes": ["error", "double"],
    "linebreak-style": ["error", "unix"],
    "object-curly-spacing": ["error", "always"],
    "semi": ["error", "never"],
    "immutable/no-let": 2,
    "immutable/no-this": 2,
    "immutable/no-mutation": 2,
    "no-var": "error",
    "no-undef": "error",
    "no-param-reassign": "error"
  }
}
