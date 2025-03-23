import { NegativeDurationError } from "../errors/duration-can-not-be-negative.error.mjs";
import { InvalidDateObjectError } from "../errors/invalid-date-object.error.mjs";
import { StartedAtMustBeEarlierThanEndedAtError } from "../errors/started-at-must-be-earlier-than-ended-at.error.mjs";

export class TaskDuration {
  /** @type {number} */
  #durationInMilliseconds;

  /**
   * Private constructor to prevent direct instantiation.
   * Use static factory methods instead.
   * @param {number} durationInMilliseconds
   * @private
   */
  constructor(durationInMilliseconds) {
    if (durationInMilliseconds < 0) {
      throw new NegativeDurationError(durationInMilliseconds);
    }
    this.durationInMilliseconds = durationInMilliseconds;
  }

  get durationInMilliseconds() {
    return this.#durationInMilliseconds;
  }

  /**
   * Factory method to create TaskDuration from start and end timestamps.
   * @param {Date} startedAt - The start time.
   * @param {Date} endedAt - The end time.
   * @returns {TaskDuration} A new TaskDuration object.
   */
  static fromTimestamps(startedAt, endedAt) {
    if (!(startedAt instanceof Date)) throw new InvalidDateObjectError("startedAt");

    if (!(endedAt instanceof Date)) throw new InvalidDateObjectError("endedAt");

    if (startedAt > endedAt) throw new StartedAtMustBeEarlierThanOrEqualToEndedAtError(startedAt, endedAt);

    const durationInMilliseconds = endedAt - startedAt;
    return new TaskDuration(durationInMilliseconds);
  }
}
