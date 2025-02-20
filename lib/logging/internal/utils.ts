/**
 * Modified logger interface.
 *
 * Meant to represent a logging object that provides custom logging functions
 * that wrap normal loggers with additional information, such as log scopes
 * and date/time information.
 */
export interface Logger {
  /**
   * Modified version of `console.log`.
   */
  log: typeof console.log;
  /**
   * Modified version of `console.warn`.
   */
  warn: typeof console.warn;
  /**
   * Modified version of `console.info`.
   */
  info: typeof console.info;
  /**
   * Modified version of `console.error`.
   */
  error: typeof console.error;
  /**
   * Factory for creating a new Logger instance with additional scopes.
   *
   * @example
   * ```
   * const EntityLogger = makeLogger("entities");
   * const Log = EntityLogger.subscope("player");
   *
   * Log.info("Player is moving around when they shouldn't be");
   * // -> [entities:player] Player is moving around when they shouldn't be
   * ```
   *
   * @param subscopes A spread of scopes to include.
   * @returns A new Logger instance.
   */
  subscope: (...subscopes: string[]) => Logger;
}

/**
 * Helper for getting current timestamp as an ISO string.
 * Used in custom loggers as an optional prefix.
 *
 * @returns The current timestamp as an ISO string.
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
