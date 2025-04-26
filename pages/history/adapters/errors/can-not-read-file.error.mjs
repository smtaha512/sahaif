export class CannotReadFileError extends Error {
  error = null;
  name = null;

  /**
   * @param {string} name
   * @param {DOMException} error
   */
  constructor(name, error) {
    super(`Cannot read file: ${name}`);
    this.error = error;
    this.name = name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
