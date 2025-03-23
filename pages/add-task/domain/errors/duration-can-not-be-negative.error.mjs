export class NegativeDurationError extends TypeError {
  /**
   * @param {number} duration
   */
  constructor(duration) {
    super(`Duration can not be negative`);
    this.args = { duration };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
