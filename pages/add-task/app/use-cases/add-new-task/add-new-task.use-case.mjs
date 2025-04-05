import { AddNewTaskInputDTO } from "./add-new-task.input.dto.mjs";

export class AddNewTaskUseCase {
  /**
   * @private
   * @readonly
   * @typedef {import("../../../ports/tasks.repository.port.mjs").TaskRepository} TaskRepository
   * @type {TaskRepository} */
  #taskRepository;

  /**
   * @private
   * @readonly
   * @typedef {import("../../../ports/draft-task.repository.port.mjs").DraftTaskRepository} DraftTaskRepository
   * @type {DraftTaskRepository} */
  #draftTaskRepository;

  /**
   * @private
   * @readonly
   * @typedef {import("../../../ports/task-names.repository.port.mjs").TaskNamesRepository} TaskNamesRepository
   * @type {TaskNamesRepository} */
  #taskNamesRepository;

  /**
   * @param {TaskRepository} taskRepository
   * @param {DraftTaskRepository} draftTaskRepository
   */
  constructor(taskRepository, draftTaskRepository, taskNamesRepository) {
    this.#taskRepository = taskRepository;
    this.#draftTaskRepository = draftTaskRepository;
    this.#taskNamesRepository = taskNamesRepository;
  }

  /**
   * Execute the use case and inserts the task
   * @param {AddNewTaskInputDTO} taskDTO - Task data from the form
   * @returns {Promise<void>}
   */
  async execute(taskDTO) {
    const newTask = taskDTO.toTaskEntity();

    await this.#taskRepository.insert(newTask);
    await this.#draftTaskRepository.delete();
    await this.#taskNamesRepository.insert(newTask.name);
  }
}
