export class StartedAtMustBeEarlierThanEndedAtError extends Error {
  /**
   * @param {Date} startedAt
   * @param {Date} endedAt
   */
  constructor(startedAt, endedAt) {
    super(`startedAt must be earlier than endedAt.`);
    this.args = { dates: { startedAt, endedAt } };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
