import { Task } from "../../../add-task/domain/entities/task.mjs";

export class ExportTasksUseToXlsxUseCase {
  /**
   * @private
   * @readonly
   * @typedef {import('../../app/use-cases/fetch-all-tasks.use-case.mjs').FetchAllTasksUseCase} FetchAllTasksUseCase
   * @type {FetchAllTasksUseCase} fetchAllTasksUseCase
   */
  #fetchAllTasksUseCase;

  /**
   * @private
   * @readonly
   * @typedef {import('../../../../app/use-cases/fetch-task-names.use-case.mjs').FetchTaskNamesUseCase} FetchTaskNamesUseCase
   * @type {FetchTaskNamesUseCase} fetchTaskNamesUseCase
   */
  #fetchTaskNamesUseCase;

  /**
   * @private
   * @readonly
   * @typedef {import('../../ports/file-writer.port.mjs').FileWriterPort} FileWriterPort
   * @type {FileWriterPort} fileWriter
   */
  #fileWriter;

  /**
   * @param {FetchAllTasksUseCase} fetchAllTasksUseCase
   * @param {FetchTaskNamesUseCase} fetchTaskNamesUseCase
   * @param {FileWriterPort} fileWriter
   */
  constructor(fetchAllTasksUseCase, fetchTaskNamesUseCase, fileWriter) {
    console.log(fileWriter);

    this.#fetchAllTasksUseCase = fetchAllTasksUseCase;
    this.#fetchTaskNamesUseCase = fetchTaskNamesUseCase;
    this.#fileWriter = fileWriter;
  }

  async execute() {
    const [tasks, names] = await Promise.all([
      this.#fetchAllTasksUseCase.execute(),
      this.#fetchTaskNamesUseCase.sortedByName(),
    ]);

    if (!tasks.length) {
      alert("No tasks to backup.");
      return;
    }

    await this.#backupTasks(tasks, !names?.length ? [] : names);
  }

  #prepareTasks(tasks) {
    return tasks.map((task) => new Task(task));
  }

  async #backupTasks(tasks, taskNames) {
    const fileName = `Tasks-${dateFns.format(new Date(), "yyyy-MM-dd-HH-mm-ss")}.xlsx`;

    if (!Array.isArray(tasks)) {
      console.error("Export failed: expected an array of tasks, got:", tasks);
      return;
    }

    const formattedTasks = this.#prepareTasks(tasks);
    const workbook = this.#fileWriter.buildFile(formattedTasks, taskNames);
    this.#fileWriter.writeFile(workbook, fileName);
  }
}
