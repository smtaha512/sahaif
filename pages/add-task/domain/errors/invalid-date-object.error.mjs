export class InvalidDateObjectError extends TypeError {
  constructor(propertyName) {
    super(`${propertyName} is not a valid date object.`);
    this.args = { propertyName };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
