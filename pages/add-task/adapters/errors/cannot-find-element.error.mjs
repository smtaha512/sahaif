export class CannotFindElementError extends Error {
  constructor(selector = "") {
    super(`Can not find element by selector: ${selector}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
