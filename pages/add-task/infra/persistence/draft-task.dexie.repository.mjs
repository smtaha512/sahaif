import { DraftTaskRepository } from "../../ports/draft-task.repository.port.mjs";

/**
 * @typedef {import("../../../../core/domain/task.mjs").Task} Task
 */

export class DraftTaskDexieRepository extends DraftTaskRepository {
  /**
   * @private
   * @typedef {import("../../../../core/infra/persistence/datasource.mjs").TasksDatabase} TasksDatabase
   * @type {TasksDatabase}
   */
  #datasource = null;

  /**
   * @param {TasksDatabase} datasource
   */
  constructor(datasource) {
    super();
    this.#datasource = datasource;
  }

  /**
   * Finds and retrieves a task from the database.
   * @returns {Promise<Task>} A promise that resolves to the found task.
   */
  async find() {
    return (await this.#datasource.draft.toArray()).at(0);
  }

  /**
   * Inserts a new task into the database.
   * @param {Task} task The task to insert.
   * @returns {Promise<void>} A promise that resolves when the task is inserted.
   */
  async insert(task) {
    await this.#datasource.draft.add(task);
  }

  /**
   * Deletes all drafts from the database.
   * @returns {Promise<void>} A promise that resolves when the drafts are deleted.
   */
  async delete() {
    await this.#datasource.draft.clear();
  }
}
