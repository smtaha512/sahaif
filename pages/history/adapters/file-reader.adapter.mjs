import { FileReaderPort } from "../ports/file-reader.port.mjs";
import { CannotReadFileError } from "./errors/can-not-read-file.error.mjs";

export class FileReaderAdapter extends FileReaderPort {
  /**
   * @param {File} file
   */
  async readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = () => reject(new CannotReadFileError(file.name, reader.error));

      reader.readAsArrayBuffer(file);
    });
  }
}
