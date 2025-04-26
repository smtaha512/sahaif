export class FetchLatestTaskUseCase {
  /**
   * @private
   * @readonly
   * @typedef {import("../../../ports/tasks.repository.port.mjs").TaskRepository} TaskRepository
   * @type {TaskRepository}
   **/
  #taskRepository = null;

  /**
   * @constructor
   * @param {TaskRepository} taskRepository
   */
  constructor(taskRepository) {
    this.#taskRepository = taskRepository;
  }
  /**
   * @typedef {import("../../../add-task/infra/persistence/tasks.dexie.entity.mjs").TasksDexieEntity} TasksDexieEntity
   * @returns {Promise<TasksDexieEntity | null>} The latest task or null if no tasks exist
   * @description This method fetches the latest task from the repository.
   */
  async execute() {
    const latestTask = await this.#taskRepository.findLatest();

    if (!latestTask) {
      return null;
    }

    return latestTask;
  }
}
