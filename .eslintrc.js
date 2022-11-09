module.exports = {
    parse: "@typescript-eslint/parser",
    extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
    ],
    parseOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    rules: {},
};
