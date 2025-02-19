import console from 'node:console';

import { getCurrentTimestamp, Logger } from '../internal/logging-utils.js';

const cache = new Map<string, Logger>();

interface Opts {
  console: typeof console;
  showInStdout: boolean;
  showTimestamp: boolean;
}

const DefaultOpts: Opts = {
  console: console,
  showInStdout: true,
  showTimestamp: true,
} as const;

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

  // Note: if our stdout is already the global console and we did not perform
  // this check, then it would cause duplicate logs. We only want to duplicate
  // IF the console instance is different, and `showInStdout` is true.
  const duplicateToStdout = config.console !== console && config.showInStdout;

  const logger: Logger = {
    log: (...data): void => {
      const datestr = config.showTimestamp ? `${getCurrentTimestamp()} ` : '';
      const formatted: unknown[] = [datestr + prefix, ...data];

      if (duplicateToStdout) {
        console.log(...formatted);
      }

      config.console.log(...formatted);
    },
    warn: (...data): void => {
      const datestr = config.showTimestamp ? `${getCurrentTimestamp()} ` : '';
      const formatted: unknown[] = [datestr + prefix, ...data];

      if (duplicateToStdout) {
        console.warn(...formatted);
      }

      config.console.warn(...formatted);
    },
    info: (...data): void => {
      const datestr = config.showTimestamp ? `${getCurrentTimestamp()} ` : '';
      const formatted: unknown[] = [datestr + prefix, ...data];

      if (duplicateToStdout) {
        console.info(...formatted);
      }

      config.console.info(...formatted);
    },
    error: (...data): void => {
      const datestr = config.showTimestamp ? `${getCurrentTimestamp()} ` : '';
      const formatted: unknown[] = [datestr + prefix, ...data];

      if (duplicateToStdout) {
        console.error(...formatted);
      }

      config.console.error(...formatted);
    },
    subscope: (...subscopes): Logger =>
      makeLogger([scope, ...subscopes].join(':'), config),
  };

  cache.set(scope, logger);
  return logger;
}
