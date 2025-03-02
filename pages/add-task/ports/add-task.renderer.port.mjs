import { MethodNotImplementedError } from "../../../shared/errors/method-not-implemented.error.mjs";

export class AddTaskRendererPort {
  /**
   * Handles adding a task.
   * @param {TaskDTO} taskDTO - The task data transfer object.
   * @returns {Promise<void>}
   */
  async #handleAddTask(taskDTO) {
    throw new MethodNotImplementedError();
  }
}
