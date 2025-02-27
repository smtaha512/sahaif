import { AddNewTaskInputDTO } from "./add-new-task.input.dto.mjs";

export class AddNewTaskUseCase {
  /**
   * @param {TaskRepository} taskRepository
   */
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  /**
   * Execute the use case and inserts the task
   * @param {AddNewTaskInputDTO} taskDTO - Task data from the form
   * @returns {Promise<void>}
   */
  async execute(taskDTO) {
    const newTask = taskDTO.toTaskEntity();

    await this.taskRepository.insert(newTask);
  }
}
