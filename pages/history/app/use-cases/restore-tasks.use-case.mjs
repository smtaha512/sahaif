import { AddNewTaskInputDTO } from "../../../add-task/app/use-cases/add-new-task/add-new-task.input.dto.mjs";
import { TasksDexieEntity } from "../../../add-task/infra/persistence/tasks.dexie.entity.mjs";

export class RestoreTasksUseCase {
  /**
   * @private
   * @readonly
   * @typedef {import('../../../add-task/ports/tasks.repository.port.mjs').TaskRepository} TaskRepository
   * @type {TaskRepository}
   */
  #taskRepository = null;

  /**
   * @private
   * @readonly
   * @typedef {import('../../../add-task/ports/task-names.repository.port.mjs').TaskNamesRepository} TaskNamesRepository
   * @type {TaskNamesRepository}
   */
  #taskNamesRepository = null;

  /**
   * @constructor
   * @param {TaskRepository} taskRepository - The task repository to interact with tasks.
   * @param {TaskNamesRepository} taskNamesRepository - The task names repository to interact with task names.
   */
  constructor(taskRepository, taskNamesRepository) {
    this.#taskRepository = taskRepository;
    this.#taskNamesRepository = taskNamesRepository;
  }

  /**
   * @param {AddNewTaskInputDTO[]} tasksDTO - Task data from the form
   * @returns {Promise<void>}
   */
  async execute(tasksDTO) {
    await this.#taskRepository.delete();

    const taskEntitiesToSave = tasksDTO.map((taskDTO) => TasksDexieEntity.build(taskDTO.toTaskEntity()));
    const savedTasks = await this.#taskRepository.insertMany(taskEntitiesToSave);

    const taskNamesToSave = taskEntitiesToSave.map((task) => task.name).filter((name) => name?.trim());
    await this.#taskNamesRepository.delete();
    await this.#taskNamesRepository.insertMany(taskNamesToSave);

    return savedTasks;
  }
}
