export class TaskRepository {
  /**
   * @typedef {import("../entities/task.mjs").Task} Task
   * @param {Task} record - Task to insert.
   * @returns {Promise<void>}
   */
  async insert(record) {
    throw new Error("insert() must be implemented");
  }
}
