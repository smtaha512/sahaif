import { MethodNotImplementedError } from "../../../shared/errors/method-not-implemented.error.mjs";

export class FileReaderPort {
  /**
   * @param {File} file
   * @returns {unknown}
   */
  async readAsArrayBuffer(file) {
    throw new MethodNotImplementedError();
  }
}
