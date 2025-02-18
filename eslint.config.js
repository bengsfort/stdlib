import bengsfort from '@bengsfort/eslint-config-flat';

// @todo: Need to expose tseslint.configs.disableTypeChecked from the eslint config.
// That way we can disable it for __tests__ files

/** @type {import('eslint').Linter.Config} */
export default [
  ...bengsfort.configs.strictTypeChecked(import.meta.dirname),
  {
    files: [
      "./lib/**/*.ts",
    ],
  },
];
