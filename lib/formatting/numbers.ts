/**
 * Restricts the given value to a certain number of decimal places, but does NOT
 * force that number of places like `.toFixed()` does. Trailing 0's will be removed.
 */
export function restrictDecimals(value: number, maxDecimalPlaces: number): number {
  if (maxDecimalPlaces < 0) return value;
  // When 0, dont use .toFixed since it rounds
  if (maxDecimalPlaces === 0) {
    return Math.floor(value);
  }

  // Force to fixed -> Convert back to number to remove trailing 0's.
  return Number(value.toFixed(maxDecimalPlaces));
}

/**
 * Takes a given duration in milliseconds and formats it into a more readable
 * string value suitable for logging or display.
 *
 * Determines what timescale to use in an opinionated fashion:
 *
 * - Below 0.1ms switches to microseconds for more readability.
 * - Between 0.1ms - 999ms displays milliseconds.
 * - Between 1s - 59s displays seconds.
 * - Over 1m will display Xminutes Yseconds.
 *
 * The timescale choices try to enforce readability patterns that make it easier
 * to visually understand how much time something takes. Large values that could
 * be dislayed as a smaller value at a larger timescale are preferred, as they
 * require less mental math to understand.
 */
export function formatDuration(durationMs: number): string {
  // Show microseconds when below 0.1ms
  if (0.1 > durationMs) {
    return `${restrictDecimals(durationMs * 1000, 0).toString(10)}μs`;
  }

  // Show milliseconds when below 1s
  if (1000 > durationMs) {
    return `${restrictDecimals(durationMs, 2).toString(10)}ms`;
  }

  const totalSeconds = restrictDecimals(durationMs / 1000, 2);
  // Handle just seconds
  if (60 > totalSeconds) {
    return `${totalSeconds.toString(10)}s`;
  }

  // Handle seconds/minutes handling
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formatted: string[] = [];
  if (1 >= minutes) formatted.push(`${minutes.toString(10)}m`);
  formatted.push(`${seconds.toString(10)}s`);

  return formatted.join(' ');
}
