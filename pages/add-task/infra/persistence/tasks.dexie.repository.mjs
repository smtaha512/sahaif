import { TasksDatabase } from "../../../../core/infra/persistence/datasource.mjs";
import { TaskRepository } from "../../ports/tasks.repository.port.mjs";
import { TasksDexieEntity } from "./tasks.dexie.entity.mjs";

export class TasksDexieRepository extends TaskRepository {
  /**
   * @private
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
   * Inserts a task into the database.
   * @param {TasksDexieEntity} task - Task to insert.
   * @returns {Promise<void>} Resolves when the insertion is complete.
   */
  async insert(task = null) {
    if (!task) {
      return;
    }

    await this.#datasource.tasks.add(TasksDexieEntity.build(task));
  }

  /**
   * @param {TasksDexieEntity[]} tasks - An array of tasks to insert.
   * @returns {Promise<void>} Resolves when the insertion is complete.
   */
  async insertMany(tasks = []) {
    if (!tasks?.length) {
      return;
    }

    return this.#datasource.tasks.bulkAdd(tasks);
  }

  /**
   * Retrieves all tasks from the database.
   * @returns {Promise<Array<TasksDexieEntity>} A promise that resolves to an array of tasks.
   */
  async findAll() {
    return await this.#datasource.tasks.toArray();
  }

  /**
   * Finds tasks within a specific date range.
   * @param {Date} startDate - The start date in JS Date format.
   * @param {Date} endDate - The end date in JS Date format.
   * @returns {Promise<Array<TasksDexieEntity>>} A promise that resolves to an array of tasks within the date range.
   */
  async findAllByDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.#datasource.tasks
      .where("startedAt")
      .between(start, end, true, true)
      .or("endedAt")
      .between(start, end, true, true)
      .sortBy("startedAt");
  }

  /**
   * Finds the latest task in the repository.
   * @returns {Promise<TasksDexieEntity>} A promise that resolves to the latest task.
   */
  async findLatest() {
    const tasks = await this.#datasource.tasks.orderBy("startedAt").reverse().limit(1).toArray();

    return tasks.at(0);
  }

  /**
   * Deletes all tasks from the database.
   * @returns {Promise<void>} A promise that resolves when the tasks are deleted.
   */
  async delete() {
    await this.#datasource.tasks.clear();
  }

  /**
   * Counts the number of tasks in the database.
   * @returns {Promise<number>} A promise that resolves to the number of tasks.
   */
  async count() {
    return await this.#datasource.tasks.count();
  }

  // Use cursor to stream data
  /**
   * Streams tasks from the database.
   * @param {function} callback - A callback function to process each task.
   * @returns {Promise<void>} A promise that resolves when all tasks have been processed.
   */
  async stream(callback) {
    return new Promise(
      (resolve, reject) =>
        this.#datasource.tasks
          .orderBy("startedAt")
          .reverse()
          .limit(10)
          .each((task) => callback(task))
          .then(resolve)
          .catch(reject)
      //   this.#datasource.tasks.
      // .cursor
      // .each((task) => callback(task))
      // .then(resolve)
      // .catch(reject)
    );
  }
}
