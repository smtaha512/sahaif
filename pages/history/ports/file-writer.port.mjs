import { MethodNotImplementedError } from "../../../shared/errors/method-not-implemented.error.mjs";

export class FileWriterPort {
  /**
   * @typedef {import('../../add-task/domain/entities/task.mjs').Task} Task
   * @param {Task[]} formattedTasks
   * @param {string[]} taskNames
   * @returns {Promise<void>}
   */
  buildFile(formattedTasks, taskNames) {
    throw new MethodNotImplementedError();
  }

  /**
   * @typedef {import('xlsx').WorkBook} WorkBook
   * @param {WorkBook} workbook
   * @param {string} fileName
   * @returns {Promise<void>}
   */
  async writeFile(workbook, fileName) {
    throw new MethodNotImplementedError();
  }
}
