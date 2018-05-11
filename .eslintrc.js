module.exports = {
  extends: 'airbnb-base',
  rules: {
    "no-param-reassign": ["error", { "props": false }]
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
};
