export class HasAlreadyExistingTasksUseCase {
  /**
   * @private
   * @readonly
   * @typedef {import('../../../add-task/ports/tasks.repository.port.mjs').TaskRepository} TaskRepository
   * @type {TaskRepository}
   */
  #taskRepository = null;

  /**
   * @param {TaskRepository} taskRepository
   */
  constructor(taskRepository) {
    this.#taskRepository = taskRepository;
  }

  /**
   * @returns {Promise<boolean>}
   */
  async execute() {
    const alreadyExistingTasksCount = await this.#taskRepository.count();
    return alreadyExistingTasksCount > 0;
  }
}
