module.exports = {
  env: {
    browser: false,
    es2021: true,
    "react-native/react-native": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-native", "react-hooks"],
  rules: {
    "react-native/no-raw-text": "warn",
    "react-native/no-unused-styles": "off", // Disable the rule for unused styles
    "react-native/split-platform-components": "off", // Disable the rule for split-platform components
    "react-native/no-inline-styles": "off",
    "react-native/no-color-literals": "off",
    "react-hooks/rules-of-hooks": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/prop-types": "off", // Disable props validation
    "react/react-in-jsx-scope": "off",
    'react-native/sort-styles': 'off', // Disable sorting styles error

    // Custom rules for missing imports and missing props
    "react/jsx-uses-vars": "error", // Check for missing props
  },
};
