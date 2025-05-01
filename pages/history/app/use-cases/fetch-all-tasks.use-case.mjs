export class FetchAllTasksUseCase {
  /**
   * @private
   * @readonly
   * @typedef {import('../ports/task.repository.port.mjs').TaskRepositoryPort} TaskRepositoryPort
   * @type {TaskRepositoryPort}
   */
  #taskRepository = null;

  /**
  @constructor
  @param {TaskRepositoryPort}
  taskRepository
  */
  constructor(taskRepository) {
    this.#taskRepository = taskRepository;
  }

  /**
   * @typedef {import('../../../add-task/domain/entities/task.mjs').Task} Task
   * @type {Task}
   * @returns {Promise<Task[]>}
   */
  async execute() {
    const tasks = await this.#taskRepository.findAll();
    return tasks;
  }
}
