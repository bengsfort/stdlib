import bengsfort from '@bengsfort/eslint-config-flat';

/** @type {import('eslint').Linter.Config} */
export default [
  {
    ignores: ['dist/'],
  },
  {
    files: ['./lib/**/*.ts'],
  },
  ...bengsfort.configs.strictTypeChecked(import.meta.dirname),
];
