import { MethodNotImplementedError } from "../../../shared/errors/method-not-implemented.error.mjs";

/**
 * @interface
 * @description The port interface that allows interaction with a TaskNameRepository.
 * This port defines the contract for task name storage and retrieval operations.
 */
export class TaskNamesRepository {
  /**
   * Inserts a task name into the repository.
   * @param {string} name The task name to insert.
   * @returns {Promise<void>}
   */
  insert(name) {
    throw new MethodNotImplementedError();
  }

  /**
   * Retrieves all task names in sorted order.
   * @returns {Promise<string[]>} A promise that resolves to a sorted list of task names.
   */
  findAllSorted() {
    throw new MethodNotImplementedError();
  }
}
