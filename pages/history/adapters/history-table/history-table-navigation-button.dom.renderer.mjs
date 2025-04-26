import { UrlRenderer } from "../url.renderer.mjs";

export class HistoryTableNavigationButtonsDomRenderer {
  /**
   * @private
   * @readonly
   * @typedef {import("../../../app/use-cases/fetch-latest-task.use-case.mjs").FetchLatestTaskUseCase} FetchLatestTaskUseCase
   * @type {FetchLatestTaskUseCase}
   */
  #fetchLatestTaskUseCase = null;
  /**
   * @private
   * @readonly
   * @typedef {import("../url.renderer.mjs").UrlRenderer} UrlRenderer
   * @type {UrlRenderer}
   */
  #urlRenderer = null;
  /**
   * @private
   * @readonly
   * @typedef {import("../../../ports/history-table-body.renderer.port.mjs").HistoryTableBodyRenderer} HistoryTableBodyRenderer
   * @type {HistoryTableBodyRenderer}
   */
  #historyTableBodyRenderer = null;

  /**
   * @constructor
   * @param {FetchLatestTaskUseCase} fetchLatestTaskUseCase
   * @param {UrlRenderer} urlRenderer
   * @param {HistoryTableBodyRenderer} historyTableBodyRenderer
   */
  constructor(fetchLatestTaskUseCase, urlRenderer, historyTableBodyRenderer) {
    this.#fetchLatestTaskUseCase = fetchLatestTaskUseCase;
    this.#urlRenderer = urlRenderer;
    this.#historyTableBodyRenderer = historyTableBodyRenderer;
    this.#registerEventListeners();
  }

  #registerEventListeners() {
    const previousButton = document.getElementById("previous-page");
    const nextButton = document.getElementById("next-page");

    if (previousButton) {
      previousButton.addEventListener("click", async () => {
        let { startedAt, endedAt } = this.#urlRenderer.getCurrentQueryParams();

        if (startedAt && endedAt) {
          startedAt = dateFns.addDays(endedAt, 1);
          endedAt = dateFns.subMonths(startedAt, 1);

          this.#urlRenderer.updateQueryParams(startedAt, endedAt);
          this.#historyTableBodyRenderer.renderTasks();
          return;
        }

        if (!startedAt && !endedAt) {
          const latestTask = await this.#fetchLatestTaskUseCase.execute();

          if (!latestTask) {
            return;
          }

          endedAt = dateFns.subMonths(latestTask.startedAt, 1);
          startedAt = dateFns.subMonths(endedAt, 1);
        }

        if (!startedAt && endedAt) {
          endedAt = dateFns.endOfDay(dateFns.subMonths(endedAt, 1));
          startedAt = dateFns.startOfDay(dateFns.subMonths(endedAt, 1));
        }

        if (startedAt && !endedAt) {
          startedAt = dateFns.startOfDay(dateFns.subMonths(startedAt, 1));
          endedAt = dateFns.startOfDay(dateFns.subMonths(startedAt, 1));
        }

        this.#urlRenderer.updateQueryParams(startedAt, endedAt);
        this.#historyTableBodyRenderer.renderTasks();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", async () => {
        let { startedAt, endedAt } = this.#urlRenderer.getCurrentQueryParams();

        if (startedAt && endedAt) {
          startedAt = dateFns.addDays(endedAt, 1);
          endedAt = dateFns.addMonths(startedAt, 1);

          this.#urlRenderer.updateQueryParams(startedAt, endedAt);
          this.#historyTableBodyRenderer.renderTasks();
          return;
        }

        // This should not happen. The button should be disabled if there is no startedAt or endedAt
        if (!startedAt && !endedAt) {
          const latestTask = await this.#fetchLatestTaskUseCase.execute();

          if (!latestTask) {
            return;
          }

          startedAt = dateFns.addDays(dateFns.addMonths(latestTask.startedAt, 1), 1);
          endedAt = dateFns.addMonths(startedAt, 1);
        }

        if (!startedAt && endedAt) {
          endedAt = dateFns.endOfDay(dateFns.addMonths(endedAt, 1));
          startedAt = dateFns.startOfDay(dateFns.subMonths(endedAt, 1));
        }

        if (startedAt && !endedAt) {
          startedAt = dateFns.startOfDay(dateFns.addMonths(startedAt, 1));
          endedAt = dateFns.endOfDay(dateFns.addMonths(startedAt, 1));
        }

        this.#urlRenderer.updateQueryParams(startedAt, endedAt);
        this.#historyTableBodyRenderer.renderTasks();
      });
    }
  }
}
