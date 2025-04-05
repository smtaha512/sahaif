import { MethodNotImplementedError } from "../../../shared/errors/method-not-implemented.error.mjs";
import { Task } from "../domain/entities/task.mjs";

export class TaskRepository {
  /**
   * @param {Task} record - Task to insert.
   * @throws {MethodNotImplementedError} Thrown when the method is not implemented.
   * @returns {Promise<void>} Resolves when the insertion is complete.
   */
  async insert(record) {
    throw new MethodNotImplementedError();
  }

  /**
   * Retrieves all tasks from the repository.
   *
   * @throws {MethodNotImplementedError} Thrown when the method is not implemented.
   * @returns {Promise<Array>} A promise that resolves to an array of tasks.
   */
  findAll() {
    throw new MethodNotImplementedError();
  }
}
