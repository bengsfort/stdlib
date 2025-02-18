export type Logger = {
    log: typeof console.log;
    warn: typeof console.warn;
    info: typeof console.info;
    error: typeof console.error;
    subscope: (...subscopes: string[]) => Logger;
  };
  
  type CreateLoggerFn = (...scopes: string[]) => Logger;
  
  export const makeLogger: CreateLoggerFn = (...scopes: string[]): Logger => {
    const scopeStr = scopes.join(':');
    const prefix = `[${scopeStr}]`;
  
    return {
      log: (...data) => console.log(prefix, ...data),
      warn: (...data) => console.warn(prefix, ...data),
      info: (...data) => console.info(prefix, ...data),
      error: (...data) => console.error(prefix, ...data),
      subscope: (...subscopes) => makeLogger(scopeStr, ...subscopes),
    };
  };