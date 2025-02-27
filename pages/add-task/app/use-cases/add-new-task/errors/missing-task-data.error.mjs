export class MissingTasksDataError extends Error {
  /**
   * @param {string[]} missingFields - An array of the names of the missing fields.
   */
  constructor(missingFields) {
    const fieldsList = missingFields.join(", ");
    super(`The following fields are required: ${fieldsList}`);
    this.args = { missingFields };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
