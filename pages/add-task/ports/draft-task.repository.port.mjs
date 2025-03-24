import { MethodNotImplementedError } from "../../../shared/errors/method-not-implemented.error.mjs";

/**
 * @abstract
 */
export class DraftTaskRepository {
  /**
   * Finds and retrieves a task from the repository.
   * This method must be implemented by subclasses.
   *
   * @abstract
   * @throws {MethodNotImplementedError} If the method is not implemented.
   * @returns {Promise<Task>} A promise that resolves to the found task.
   */
  async find() {
    throw new MethodNotImplementedError();
  }

  /**
   * Inserts a new task into the repository.
   * This method must be implemented by subclasses.
   *
   * @abstract
   * @param {Task} task The task to insert.
   * @throws {MethodNotImplementedError} If the method is not implemented.
   * @returns {Promise<void>} A promise that resolves when the task is inserted.
   */
  async insert(task) {
    throw new MethodNotImplementedError();
  }

  /**
   * Deletes a task.
   * This method must be implemented by subclasses.
   *
   * @abstract
   * @throws {MethodNotImplementedError} Throws an error if the method is not implemented.
   */
  async delete() {
    throw new MethodNotImplementedError();
  }
}
