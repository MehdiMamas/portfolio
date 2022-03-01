module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  plugins: ["only-warn"],
  overrides: [
    {
      files: ["bin/*.js", "lib/*.js"],
      excludedFiles: "*.test.js",
      rules: {
        quotes: ["error", "single"]
      }
    }
  ]

}
