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
   * @param {string} [store="tasks"]
   */
  constructor(datasource) {
    super();
    this.#datasource = datasource;
  }

  async insert(task = null) {
    if (!task) {
      return;
    }

    await this.#datasource.tasks.add(TasksDexieEntity.build(task));
  }
}
