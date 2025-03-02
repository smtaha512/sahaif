import { TaskDuration } from "../value-objects/task-duration.mjs";

export class Task {
  /** @type {string} */
  id = null;

  /** @type {string} */
  name = null;

  /** @type {Date} */
  startedAt = "";

  /** @type {Date} */
  endedAt = "";

  constructor({ id, name, startedAt, endedAt } = {}) {
    this.id = id;
    this.name = name;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
  }

  /**
   * Calculates the duration of the task in milliseconds.
   * Returns 0 if either the start or end time is not set.
   * @returns {TaskDuration} The duration in milliseconds, or 0 if the duration is invalid.
   */
  get duration() {
    return TaskDuration.fromTimestamps(this.startedAt, this.endedAt);
  }
}
