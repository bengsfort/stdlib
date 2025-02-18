/**
 * Determines if an unknown value is `Error` like with a valid `message` prop.
 * Asserts the object type if it is sufficiently Error-like.
 * 
 * @param error The object to test.
 * @returns Whether it is an error.
 */
function isErrorWithMessage(error: unknown): error is Error {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    );
  }
  
  /**
   * Converts an unknown value to a usable Error instance.
   * 
   * If the value is not a usable Error-like object, will attempt to JSON
   * stringify the value as an error message, falling back to attempting to
   * stringify the value directly.
   * 
   * @param maybeError The potential error object.
   * @returns A valid error instance with the message.
   */
  function toErrorWithMessage(maybeError: unknown): Error {
    if (isErrorWithMessage(maybeError)) {
      return maybeError;
    }
  
    try {
      if (typeof maybeError === 'string') {
        return new Error(maybeError);
      }

      if (typeof maybeError === 'number') {
        return new Error(String(maybeError));
      }
      
      return new Error(JSON.stringify(maybeError));
    } catch {
      // fallback in case there's an error stringifying the maybeError
      // like with circular references for example.
      return new Error(String(maybeError));
    }
  }
  
  /**
   * Returns an error message for the given error-like value. If an error
   * message cannot be determined, will attempt to stringify the value
   * and return it.
   * 
   * @param error An error or error-like object.
   * @returns The error message.
   */
  export function getErrorMessage(error: unknown): string {
    return toErrorWithMessage(error).message;
  }