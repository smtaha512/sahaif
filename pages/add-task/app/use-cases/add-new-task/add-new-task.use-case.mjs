import { DraftTaskRepository } from "../../../ports/draft-task.repository.port.mjs";
import { AddNewTaskInputDTO } from "./add-new-task.input.dto.mjs";

export class AddNewTaskUseCase {
  /** @type {TaskRepository} */
  #taskRepository;

  /** @type {DraftTaskRepository} */
  #draftTaskRepository;

  /**
   * @param {TaskRepository} taskRepository
   * @param {DraftTaskRepository} draftTaskRepository
   */
  constructor(taskRepository, draftTaskRepository) {
    this.#taskRepository = taskRepository;
    this.#draftTaskRepository = draftTaskRepository;
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
  }
}
