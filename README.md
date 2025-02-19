# @bengsfort/stdlib

A collection of utilities that I got tired of re-implementing.

## Architecture

This package is written for use in ES Module environments. It should work out-of-the-box with projects using a bundler like Vite, Rollup, or ESBuild. Currently CommonJS is not supported, but will be in the future if a need arises.

### Platform-specific modules

All top-level utilities should be considered safe for all modern js-based runtimes. They should not include any runtime-specific logic or API's, and any runtime-specific modules can be found in respective `/node` or `/browser` directories.

For example, the [logging](./lib/logging.ts) utility module is runtime agnostic, whereas the [node/logging](./lib/node/logging.ts) utility module is altered to provide more features when running in node, and imports from `node:console` to do so.

```ts
// Something running in the browser or non-node environment
import { makeLogger } from '@bengsfort/stdlib/logging';

// Something running in node that wants node-specific features
import { makeLogger } from '@bengsfort/stdlib/node/logging';
```

## Releasing

### Automated Release Flow

Once a PR hits main, the [release workflow](./.github/workflows/release.yml) will trigger and any changesets will be handled automatically.

### Manual Release Flow

1. When a new feature or change has been made, run `pnpm changes:add` to create a changeset (this should be commited).
2. When ready to release, run `pnpm changes:commit` to apply all changes and update changelogs.
3. Run `pnpm install` to update lockfile and rebuild packages.
4. Commit and run `pnpm ci:publish` to publish.
