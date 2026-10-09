module.exports = [
  {ignores: ["node_modules/**"]},
  {
    files: ["*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {console: "readonly"},
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
      "no-unreachable": "error",
      "no-dupe-keys": "error",
      "no-constant-condition": "error",
    },
  },
];
