import { Task } from "../domain/entities/task.mjs";

export class TaskRepository {
  /**
   * @param {Task} record - Task to insert.
   * @returns {Promise<void>} Resolves when the insertion is complete.
   */
  async insert(record) {
    throw new Error("insert(record) must be implemented");
  }
}
