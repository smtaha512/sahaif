import { Task } from "../../../add-task/domain/entities/task.mjs";

/**
 * @template T, U
 * @typedef {[T, U]} Tuple A tuple containing two values of types T and U.
 */

export class FetchHistoryUseCase {
  /**
   * @private
   * @readonly
   * @typedef {import("../../../add-task/ports/tasks.repository.port.mjs").TaskRepository} TaskRepository
   * @type {TaskRepository} */

  #taskRepository = null;
  constructor(taskRepository) {
    this.#taskRepository = taskRepository;
  }

  /**
   * Executes the use case to group tasks by their formatted date.
   *
   * @returns {Promise<Tuple<string, Task[]>[]>} An array of tuples where each tuple contains a formatted date string
   * and an array of task objects associated with that date.
   */
  async execute() {
    const tasks = await this.#taskRepository.findAll();

    const groupedTasks = Object.entries(
      tasks.reduce((acc, task) => {
        const date = dateFns.formatISO(task.startedAt, { representation: "date" });
        return {
          ...acc,
          [date]: [...(acc[date] || []), new Task(task)],
        };
      }, {})
    );

    return groupedTasks;
  }
}
