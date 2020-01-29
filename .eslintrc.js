module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "plugin:import/typescript",
    "plugin:import/errors",
    "plugin:import/warnings",
    "react-app",
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
    "import"
  ],
  rules: {
    "import/order": ["error", {"alphabetize": {"order": "asc"}}],
    "@typescript-eslint/no-unused-vars": ["error"],
    "quotes": ["error", "double"],
    "linebreak-style": ["error", "unix"],
    "object-curly-spacing": ["error", "always"],
    "semi": ["error", "never"],
    "no-var": "error",
    "no-undef": "error",
    "no-param-reassign": "error",
    "default-case": "error",
    "one-var": ["error", "never"],
  }
}
