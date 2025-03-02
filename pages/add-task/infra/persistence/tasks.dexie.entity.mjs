import { Task } from "../../domain/entities/task.mjs";

export class TasksDexieEntity extends Task {
  /**
   * @static
   * @param {Task} task
   * @returns {TasksDexieEntity}
   */
  static build(task) {
    return new Task({ ...task, id: task.id ?? `tsk_${uuid.v4()}` });
  }
}
