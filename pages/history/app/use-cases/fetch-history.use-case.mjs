import { convertDateAndTimeToJSDate } from "../../../../shared/utils/date.utils.mjs";
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
  /**
   * @private
   * @readonly
   * @typedef {import("../../app/use-cases/fetch-latest-task.use-case.mjs").FetchLatestTaskUseCase} FetchLatestTaskUseCase
   * @type {FetchLatestTaskUseCase}
   */
  #fetchLatestTaskUseCase = null;

  constructor(taskRepository, fetchLatestTaskUseCase) {
    this.#taskRepository = taskRepository;
    this.#fetchLatestTaskUseCase = fetchLatestTaskUseCase;
  }

  /**
   * Executes the use case to group tasks by their formatted date.
   * @param {number} [currentPage=1] - The current page number for pagination
   * @returns {Promise<Tuple<string, Task[]>[]>} An array of tuples where each tuple contains a formatted date string
   * and an array of task objects associated with that date.
   */
  async execute(startedAt = null, endedAt = null) {
    debugger;
    if (startedAt && endedAt) {
      // parse the dates
      startedAt = convertDateAndTimeToJSDate(startedAt);
      endedAt = convertDateAndTimeToJSDate(endedAt);
    }

    if (!startedAt && !endedAt) {
      const latestTask = await this.#fetchLatestTaskUseCase.execute();
      endedAt = dateFns.endOfDay(latestTask.startedAt);
      startedAt = dateFns.startOfDay(dateFns.subMonths(endedAt, 1));
    }

    if (!startedAt && endedAt) {
      startedAt = dateFns.startOfDay(dateFns.subMonths(convertDateAndTimeToJSDate(endedAt), 1));
    }

    if (startedAt && !endedAt) {
      endedAt = dateFns.endOfDay(dateFns.addMonths(convertDateAndTimeToJSDate(startedAt), 1));
    }

    // swap the dates if startedAt is after endedAt
    if (dateFns.isAfter(startedAt, endedAt)) {
      const temp = startedAt;
      startedAt = endedAt;
      endedAt = temp;
    }

    const tasks = await this.#taskRepository.findAllByDates(startedAt, endedAt);

    if (!tasks?.length) {
      return [];
    }

    // Group tasks by date
    const groupedTasks = tasks
      .filter((task) => task.startedAt)
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
    const end = !task.endedAt ? null : dateFns.startOfDay(task.endedAt);
    const dayCount = dateFns.differenceInCalendarDays(end, start) + 1;

    return Array.from({ length: dayCount }, (_, i) => {
      const currentDay = dateFns.addDays(start, i);
      const currentDate = dateFns.formatISO(currentDay, { representation: "date" });

      const startedAt = i === 0 ? task.startedAt : dateFns.startOfDay(currentDay);
      const endedAt = end === null ? null : i === dayCount - 1 ? task.endedAt : dateFns.endOfDay(currentDay);

      const splitTask = new Task({ ...task, startedAt, endedAt });

      return { date: currentDate, task: splitTask };
    });
  }
}
