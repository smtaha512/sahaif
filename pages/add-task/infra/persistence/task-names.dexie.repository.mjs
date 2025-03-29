import { TaskNamesRepository } from "../../ports/task-names.repository.port.mjs";

/**
 * @typedef {import('../../shared/indexedDB/indexedDB.mjs').IndexedDB} IndexedDB
 * @typedef {import('../../ports/task-names.repository.port.mjs').TaskNamesRepository} TaskNameRepository
 *
 * @export
 * @class TaskNamesDexieRepository
 * @implements {TaskNameRepository}
 */
export class TaskNamesDexieRepository extends TaskNamesRepository {
  /**
   * @private
   * @readonly
   * @typedef {import("../../../../core/infra/persistence/datasource.mjs").TasksDatabase} TasksDatabase
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
   * Inserts a task name into the taskNames store
   * @param {string} name
   */
  async insert(name) {
    try {
      console.log(this.#datasource.taskNames);

      await this.#datasource.taskNames.add({ name, createdAt: new Date(), updatedAt: new Date() });
    } catch (error) {
      if (error.name !== "ConstraintError") {
        console.error("Failed to insert task name:", error);
      }
    }
  }

  /**
   * Retrieves all task names in sorted order
   * @returns {Promise<string[]>}
   */
  async findAllSorted() {
    console.log(await this.#datasource.taskNames.orderBy("name").keys());
    return this.#datasource.taskNames.orderBy("name").keys();
  }
}
