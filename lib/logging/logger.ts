/* eslint-disable no-console */

import { getCurrentTimestamp, Logger } from './internal/utils.js';

// Runtime cache for re-using loggers to reduce memory footprint.
const cache = new Map<string, Logger>();

interface Opts {
  showTimestamp: boolean;
}

const DefaultOpts: Opts = {
  showTimestamp: true,
} as const;

/**
 * Factory for creating a Logger instance.
 * @param scopes
 * @returns
 */
export function makeLogger(scope: string, opts: Partial<Opts> = {}): Logger {
  const config: Opts = {
    ...DefaultOpts,
    ...opts,
  };

  // Check for an existing logger. If one exists return it.
  // This enforces singular loggers per scope, and prevents memory bloat from
  // using the same scope in multiple files.
  const existing = cache.get(scope);
  if (existing) {
    return existing;
  }

  const prefix = `[${scope}]`;
  const logger: Logger = {
    log: (...data): void => {
      const datestr = config.showTimestamp ? `${getCurrentTimestamp()} ` : '';
      console.log(datestr + prefix, ...data);
    },
    warn: (...data): void => {
      const datestr = config.showTimestamp ? `${getCurrentTimestamp()} ` : '';
      console.warn(datestr + prefix, ...data);
    },
    info: (...data): void => {
      const datestr = config.showTimestamp ? `${getCurrentTimestamp()} ` : '';
      console.info(datestr + prefix, ...data);
    },
    error: (...data): void => {
      const datestr = config.showTimestamp ? `${getCurrentTimestamp()} ` : '';
      console.error(datestr + prefix, ...data);
    },
    subscope: (...subscopes): Logger =>
      makeLogger([scope, ...subscopes].join(':'), config),
  };

  cache.set(scope, logger);
  return logger;
}
