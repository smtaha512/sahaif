export class MethodNotImplementedError extends Error {
  constructor() {
    super(`Method not implemented`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
