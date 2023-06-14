module.exports = {
  env: {
    node: true, // Add 'node' environment
    es2020: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
};
