export class MethodNotImplementedError extends Error {
  constructor() {
    super(`Method not implemented: ${this.name}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
