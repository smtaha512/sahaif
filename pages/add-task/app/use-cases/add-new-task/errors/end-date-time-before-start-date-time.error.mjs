export class EndDateTimeBeforeStartDateTimeError extends Error {
  constructor() {
    super("End date/time cannot be before start date/time.");

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
