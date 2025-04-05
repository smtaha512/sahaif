import { MethodNotImplementedError } from "../../../shared/errors/method-not-implemented.error.mjs";

export class HistoryTableBodyRenderer {
  renderTasks(tasks) {
    throw new MethodNotImplementedError();
  }

  updateNavigationButtons(hasEarlierTasks, hasLaterTasks) {
    throw new MethodNotImplementedError();
  }
}
