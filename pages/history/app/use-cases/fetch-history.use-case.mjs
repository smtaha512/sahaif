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

    const groupedTasks = tasks
      .flatMap(this.#splitTask)
      .reduce((acc, { date, task }) => ({ ...acc, [date]: [...(acc[date] || []), task] }), {});

    return Object.entries(groupedTasks).toSorted(([firstDate], [secondDate]) =>
      dateFns.compareDesc(new Date(firstDate), new Date(secondDate))
    );
  }

  /**
   * Splits a given task into multiple tasks, each corresponding to a single day.
   *
   * @param {Task} task - The task to be split, containing `startedAt` and `endedAt` properties.
   * @returns {{ date: string, task: Task }[]} An array of objects, each containing a `date` (ISO string)
   * and a `task` (Task instance) for that specific day.
   */
  #splitTask(task) {
    const start = dateFns.startOfDay(task.startedAt);
    const end = dateFns.startOfDay(task.endedAt);
    const dayCount = dateFns.differenceInCalendarDays(end, start) + 1;

    return Array.from({ length: dayCount }, (_, i) => {
      const currentDay = dateFns.addDays(start, i);
      const currentDate = dateFns.formatISO(currentDay, { representation: "date" });

      const splitTask = new Task({
        ...task,
        startedAt: i === 0 ? task.startedAt : dateFns.startOfDay(currentDay),
        endedAt: i === dayCount - 1 ? task.endedAt : dateFns.endOfDay(currentDay),
      });

      return { date: currentDate, task: splitTask };
    });
  }
}
