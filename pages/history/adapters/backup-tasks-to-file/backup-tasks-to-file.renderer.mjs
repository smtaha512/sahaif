export class BackupTasksToFileRenderer {
  /**
   * @private
   * @readonly
   * @typedef {import('../../app/use-cases/export-tasks-use-to-xlsx.use-case.mjs').ExportTasksUseToXlsxUseCase} ExportTasksUseToXlsxUseCase
   * @type {ExportTasksUseToXlsxUseCase} exportTasksUseToXlsxUseCase
   */
  #exportTasksUseToXlsxUseCase;

  /**
   * @private
   * @readonly
   * @typedef {import('../spinner.renderer.mjs').SpinnerRenderer} SpinnerRenderer
   * @type {SpinnerRenderer} spinnerRenderer
   */
  #spinnerRenderer;

  /**
   * @param {FetchAllTasksUseCase} fetchAllTasksUseCase
   * @param {FetchTaskNamesUseCase} fetchTaskNamesUseCase
   * @param {TasksExporter} exportTasksUseToXlsxUseCase
   * @param {SpinnerRenderer} spinnerRenderer
   */
  constructor(exportTasksUseToXlsxUseCase, spinnerRenderer) {
    this.#exportTasksUseToXlsxUseCase = exportTasksUseToXlsxUseCase;
    this.#spinnerRenderer = spinnerRenderer;

    this.#registerBackupButtonClickHandler();
  }

  #registerBackupButtonClickHandler() {
    const button = document.getElementById("backup-tasks");
    if (button) {
      button.addEventListener("click", async () => {
        try {
          this.#spinnerRenderer.showSpinner({ message: "Backing up tasks..." });

          await this.#exportTasksUseToXlsxUseCase.execute();
        } catch (error) {
          console.error("Manual backup failed:", error);
        } finally {
          this.#spinnerRenderer.hideSpinner();
        }
      });
    }
  }
}
