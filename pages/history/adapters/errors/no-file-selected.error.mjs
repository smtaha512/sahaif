export class NoFileSelectedError extends Error {
  constructor(fileType = "") {
    super(`No file selected. Please select a valid file${fileType ? `of type: ${fileType}` : ""}.`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
