import { convertDateAndTimeToJSDate } from "../../../../shared/utils/date.utils.mjs";
import { HistoryTableBodyRenderer } from "../../ports/history-table-body.renderer.port.mjs";

export class HistoryTableBodyDomRenderer extends HistoryTableBodyRenderer {
  /**
   * @private
   * @readonly
   * @type {string}
   **/
  #taskTableBodyId = "task-table-body";

  /**
   * @private
   * @readonly
   * @typedef {import("../../../app/use-cases/fetch-history.use-case.mjs").FetchHistoryUseCase} FetchHistoryUseCase
   * @type {FetchHistoryUseCase}
   **/
  #fetchHistoryUseCase = null;

  /**
   * @private
   * @readonly
   * @typedef {import("../../../app/use-cases/fetch-latest-task.use-case.mjs").FetchLatestTaskUseCase} FetchLatestTaskUseCase
   * @type {FetchLatestTaskUseCase}
   **/
  fetchLatestTaskUseCase;

  /**
   * @private
   * @readonly
   * @typedef {import("../../spinner.renderer.mjs").SpinnerRenderer} SpinnerRenderer
   * @type {SpinnerRenderer}
   **/
  #spinnerRenderer;

  /**
   * @private
   * @readonly
   * @typedef {import("../../url.renderer.mjs").UrlRenderer} UrlRenderer
   * @type {UrlRenderer}
   **/
  #urlRenderer;

  /**
   * @param {FetchHistoryUseCase} fetchHistoryUseCase
   * @param {FetchLatestTaskUseCase} fetchLatestTaskUseCase
   * @param {SpinnerRenderer} spinnerRenderer
   * @param {UrlRenderer} urlRenderer
   */
  constructor(fetchHistoryUseCase, fetchLatestTaskUseCase, spinnerRenderer, urlRenderer) {
    super();
    this.#fetchHistoryUseCase = fetchHistoryUseCase;
    this.fetchLatestTaskUseCase = fetchLatestTaskUseCase;
    this.#spinnerRenderer = spinnerRenderer;
    this.#urlRenderer = urlRenderer;
    this.taskTableBody = document.getElementById(this.#taskTableBodyId);
    this.renderTasks();
  }

  /**
   * Renders the tasks into the table body efficiently.
   */
  async renderTasks() {
    this.#spinnerRenderer.showSpinner();
    let { startedAt, endedAt } = this.#urlRenderer.getCurrentQueryParams();

    startedAt = startedAt && dateFns.startOfDay(convertDateAndTimeToJSDate(startedAt));
    endedAt = endedAt && dateFns.endOfDay(convertDateAndTimeToJSDate(endedAt));

    const groupedTasks = await this.#fetchHistoryUseCase.execute(startedAt, endedAt);

    const fragment = document.createDocumentFragment();

    if (groupedTasks.length === 0) {
      this.#renderNoTasksMessage(fragment);
    } else {
      // Iterate over tasks and create rows
      groupedTasks.forEach(([date, tasks]) => {
        this.#renderDateCell(fragment, date);
        tasks.forEach(this.#renderTask(fragment));
      });
    }

    // Clear existing table rows and append the fragment
    this.taskTableBody.innerHTML = "";
    this.taskTableBody.appendChild(fragment);

    this.#addStickyRowListener();
    this.#spinnerRenderer.hideSpinner();
  }

  updateNavigationButtons() {
    const previousButton = document.getElementById("previous-page");
    const nextButton = document.getElementById("next-page");

    previousButton.addEventListener("click", async () => {
      // update query params if there is no query param in the url fallback to 1 otherwise increment and set the new query param

      updatePage("previous");
      const currentPage = getCurrentPage();
      await this.renderTasks();

      if (currentPage === 1) {
        previousButton.classList.add("disabled");
      }
      if (currentPage > 1) {
        previousButton.classList.remove("disabled");
      }
    });

    nextButton.addEventListener("click", async () => {
      updatePage("next");
      await this.renderTasks();
    });

    // if (this.#fetchHistoryUseCase.hasPreviousPage()) {
    //   previousButton.classList.remove("disabled");
    // } else {
    //   previousButton.classList.add("disabled");
    // }

    // if (this.#fetchHistoryUseCase.hasNextPage()) {
    //   nextButton.classList.remove("disabled");
    // } else {
    //   nextButton.classList.add("disabled");
    // }
  }

  #renderTask(fragment) {
    return (task) => {
      const row = document.createElement("tr");
      row.classList.add("w-100", "d-flex", "justify-content-between");

      row.innerHTML = `
      ${this.#renderCell(task.name)}
      ${this.#renderTimeCell(task.startedAt)}
      ${this.#renderTimeCell(task.endedAt)}
      ${this.#renderCell(task.duration.toString())}
      `;
      fragment.appendChild(row);
    };
  }

  #renderDateCell(fragment, date) {
    const row = document.createElement("tr");
    row.classList.add("w-100", "d-flex", "justify-content-between", "date-row");

    row.innerHTML = `<td colspan="5" class="text-center p-0 w-100">${dateFns.format(date, "dd MMM, yy")}</td>`;
    fragment.appendChild(row);
  }

  #renderTimeCell(date) {
    if (!date) {
      return `${this.#renderCell("")}`;
    }

    return this.#renderCell(dateFns.format(date, "hh:mm a"));
  }

  /**
   * @param {string} text
   * @return {string}
   */
  #renderCell(text) {
    if (!text.trim()) {
      return `<td class="border-0 w-100"></td>`;
    }

    return `<td class="text-start p-0 w-100">${text}</td>`;
  }

  /**
   * @param {DocumentFragment} fragment
   */
  #renderNoTasksMessage(fragment) {
    const row = document.createElement("tr");
    row.classList.add("w-100", "d-flex", "justify-content-center");
    row.innerHTML = `
      <td colspan="5" class="text-center w-100">No tasks available.</td>
    `;

    fragment.appendChild(row);
  }

  /**
   * Adds a sticky row listener to the task table body.
   * This listener makes the rows sticky when scrolling.
   * It checks the scroll position and updates the sticky class accordingly.
   */
  #addStickyRowListener() {
    const tableBodyContainer = this.taskTableBody;

    const rows = tableBodyContainer.childNodes;
    const rowsArray = Array.from(rows).filter((row) => row.classList.contains("date-row"));
    rows.item(0).classList.add("sticky");
    tableBodyContainer.addEventListener("scroll", function () {
      window.requestAnimationFrame(() => {
        const containerRect = tableBodyContainer.getBoundingClientRect();

        const newStickyRow = rowsArray.reduce((sticky, row) => {
          const rowRect = row.getBoundingClientRect();
          return rowRect.top <= containerRect.top ? row : sticky;
        }, null);

        const currentStickyRow = tableBodyContainer.querySelector(".sticky");

        if (newStickyRow && newStickyRow !== currentStickyRow) {
          if (currentStickyRow) currentStickyRow.classList.remove("sticky");
          newStickyRow.classList.add("sticky");
        }
      });
    });
  }
}
