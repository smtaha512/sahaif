import { MethodNotImplementedError } from "../../../shared/errors/method-not-implemented.error.mjs";

export class HistoryTableBodyRenderer {
  async renderTasks(tasks) {
    throw new MethodNotImplementedError();
  }

  updateNavigationButtons(hasEarlierTasks, hasLaterTasks) {
    throw new MethodNotImplementedError();
  }
}
