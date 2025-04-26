import { ParserStrategyNotImplementedError } from "../../parsers/errors/parser-strategy-not-implemented.error.mjs";
import { NoFileSelectedError } from "../errors/no-file-selected.error.mjs";
import { ConfirmRestoreTasksModalRenderer } from "./confirm-restore-tasks-modal.renderer.mjs";

export class RestoreTasksFromFileRenderer {
  /**
   * @private
   * @readonly
   * @typedef {import('../../app/use-cases/restore-tasks.use-case.mjs').RestoreTasksUseCase} RestoreTasksUseCase
   * @type {RestoreTasksUseCase}
   */
  #restoreTasksUseCase = null;

  /**
   * @private
   * @readonly
   * @typedef {import('../../app/use-cases/has-already-existing-tasks.use-case.mjs').HasAlreadyExistingTasksUseCase} HasAlreadyExistingTasksUseCase
   * @type {HasAlreadyExistingTasksUseCase}
   */
  #hasAlreadyExistingTasksUseCase = null;

  /**
   * @private
   * @readonly
   * @typedef {import('../../ports/file-reader.port.mjs').FileReaderPort} FileReaderPort
   * @type {FileReaderPort}
   */
  #fileReader = null;

  /**
   * @private
   * @readonly
   * @typedef {import('../ports/parser.factory.port.mjs').ParserFactory} ParserFactory
   * @type {ParserFactory}
   */
  #parserFactory = null;

  /**
   * @private
   * @readonly
   * @typedef {import('../../ports/history-table-body.renderer.port.mjs').HistoryTableBodyRenderer} HistoryTableBodyRenderer
   * @type {HistoryTableBodyRenderer}
   */
  #historyTableBodyRenderer = null;

  /**
   * @private
   * @readonly
   * @typedef {import('../spinner.renderer.mjs').SpinnerRenderer} .SpinnerRenderer
   * @type {SpinnerRenderer}
   */
  #spinnerRenderer = null;

  /**
   * @param {ImportTasksFromFileUsecase} restoreTasksUseCase
   * @param {HasAlreadyExistingTasksUseCase} hasAlreadyExistingTasksUseCase
   * @param {FileReaderPort} fileReader
   * @param {ParserFactory} parserFactory
   * @param {HistoryTableBodyRenderer} historyTableBodyRenderer
   * @param {SpinnerRenderer} spinnerRenderer
   */
  constructor(
    restoreTasksUseCase,
    hasAlreadyExistingTasksUseCase,
    fileReader,
    parserFactory,
    historyTableBodyRenderer,
    spinnerRenderer
  ) {
    this.#restoreTasksUseCase = restoreTasksUseCase;
    this.#hasAlreadyExistingTasksUseCase = hasAlreadyExistingTasksUseCase;
    this.#fileReader = fileReader;
    this.#parserFactory = parserFactory;
    this.#historyTableBodyRenderer = historyTableBodyRenderer;
    this.#spinnerRenderer = spinnerRenderer;
    this.#registerImportHistoryEventHandler();
  }

  #registerImportHistoryEventHandler() {
    const importHistoryInput = document.getElementById("restore-tasks");

    importHistoryInput.addEventListener("change", async (event) => {
      try {
        this.#spinnerRenderer.showSpinner("Importing tasks...");
        await this.#importTasks(event.target.files[0]);

        event.target.value = null;
      } catch (error) {
        alert("Failed to import tasks");

        console.error(error);
      }
    });
  }

  /**
   * @param {File} [file=null]
   * @param {number} [alreadyExistingTasksCount=0]
   */
  async #importTasks(file = null) {
    if (!file) {
      throw new NoFileSelectedError();
    }

    const parsedTasks = await this.#parseFile(file);
    await this.#handleModalInteraction(parsedTasks);
  }

  /**
   * @private
   * @param {File} [file=null]
   * @returns {Promise<Task[]>}
   */
  async #parseFile(file = null) {
    if (!file) {
      throw new NoFileSelectedError();
    }

    try {
      const data = await this.#fileReader.readAsArrayBuffer(file);
      const parser = this.#parserFactory.createParser(file.type);

      return await parser.parse(data);
    } catch (error) {
      if (!(error instanceof ParserStrategyNotImplementedError)) {
        throw error;
      }

      alert("Invalid file format.");
    }
  }

  /**
   * @private
   * @typedef {import("../../../add-task/domain/entities/task.mjs").Task} Task
   * @param {Task[]} tasks
   * @returns {Promise<void>}
   */
  async #handleModalInteraction(tasks) {
    const hasAlreadyExistingTasks = await this.#hasAlreadyExistingTasksUseCase.execute();

    if (hasAlreadyExistingTasks) {
      new ConfirmRestoreTasksModalRenderer().setupModal(() => this.#importTasksAndRerender(tasks)).show();
    } else {
      this.#importTasksAndRerender(tasks);
    }
  }

  /**
   * @param {Task[]} tasks
   */
  async #importTasksAndRerender(tasks) {
    try {
      await this.#restoreTasksUseCase.execute(tasks);
      await this.#historyTableBodyRenderer.renderTasks();
    } catch (error) {
      console.error(error);
    } finally {
      this.#spinnerRenderer.hideSpinner();
    }
  }
}
