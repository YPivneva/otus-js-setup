module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["jest"],
  rules: {
    "max-len": ["error", { ignoreComments: true, code: 150 }],
    "no-plusplus": "off",
    "import/prefer-default-export": "off",
  },
  ignorePatterns: ["**/dist/*.js"],
};
