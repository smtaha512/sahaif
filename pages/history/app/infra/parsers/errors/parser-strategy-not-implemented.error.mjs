export class ParserStrategyNotImplementedError extends Error {
  /**
   * @param {string} format
   */
  constructor(format) {
    super(`Parser strategy not implemented for: ${format} format`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
