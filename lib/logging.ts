/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */

export interface Logger {
  log: typeof console.log;
  warn: typeof console.warn;
  info: typeof console.info;
  error: typeof console.error;
  subscope: (...subscopes: string[]) => Logger;
}

type CreateLoggerFn = (...scopes: string[]) => Logger;

export const makeLogger: CreateLoggerFn = (...scopes: string[]): Logger => {
  const scopeStr = scopes.join(":");
  const prefix = `[${scopeStr}]`;

  return {
    log: (...data): void => {
      console.log(prefix, ...data);
    },
    warn: (...data): void => {
      console.warn(prefix, ...data);
    },
    info: (...data): void => {
      console.info(prefix, ...data);
    },
    error: (...data): void => {
      console.error(prefix, ...data);
    },
    subscope: (...subscopes): Logger => makeLogger(scopeStr, ...subscopes),
  };
};
