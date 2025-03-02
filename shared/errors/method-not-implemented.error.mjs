export class MethodNotImplementedError extends Error {
  code = "METHOD_NOT_IMPLEMENTED";

  constructor() {
    super(`Method not implemented: ${this.name}`);
  }
}
