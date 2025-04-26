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
   * @typedef {import("../core/domain/task.mjs").Task} Task
   * @param {Task[]} records - An array of tasks to insert.
   * @returns {Promise<void>} Resolves when the insertion is complete.
   */
  async insertMany(records) {
    throw new Error("clear() must be implemented");
  }

  /**
   * Retrieves all tasks from the repository.
   *
   * @throws {MethodNotImplementedError} Thrown when the method is not implemented.
   * @returns {Promise<Array<Task>>} A promise that resolves to an array of tasks.
   */
  findAll() {
    throw new MethodNotImplementedError();
  }

  /**
   * Finds tasks within a specific date range.
   * @param {Date} startDate - The start date in JS Date format.
   * @param {Date} endDate - The end date in JS Date format.
   * @throws {MethodNotImplementedError} Thrown when the method is not implemented.
   * @returns {Promise<Array<Task>>} A promise that resolves to an array of tasks within the date range.
   */
  async findAllByDates(startDate, endDate) {
    throw new MethodNotImplementedError();
  }

  /**
   * Finds the latest task in the repository.
   * @throws {MethodNotImplementedError} Thrown when the method is not implemented.
   * @returns {Promise<Task>} A promise that resolves to the latest task.
   */
  async findLatest() {
    throw new MethodNotImplementedError();
  }

  /**
   * Deletes all tasks from the database.
   * @throws {MethodNotImplementedError} Thrown when the method is not implemented.
   * @returns {Promise<void>} A promise that resolves when the tasks are deleted.
   */
  async delete() {
    throw new MethodNotImplementedError();
  }

  /**
   * Counts the number of tasks in the database.
   * @throws {MethodNotImplementedError} Thrown when the method is not implemented.
   * @returns {Promise<number>} A promise that resolves to the number of tasks.
   */
  async count() {
    throw new MethodNotImplementedError();
  }
}
