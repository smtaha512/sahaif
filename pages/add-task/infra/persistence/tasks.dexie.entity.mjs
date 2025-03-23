import { Task } from "../../domain/entities/task.mjs";

export class TasksDexieEntity extends Task {
  /** @type {Date} */
  createdAt = null;

  /** @type {Date} */
  updatedAt = null;

  /**
   * @param {Partial<TasksDexieEntity>} task
   */
  constructor(task) {
    super(task);
    Object.assign(this, task);
  }

  /**
   * @static
   * @param {Task & Partial<Pick<TasksDexieEntity, 'createdAt' | 'updatedAt'>>} task
   * @returns {TasksDexieEntity}
   */
  static build(task) {
    const currentDate = new Date();

    return new TasksDexieEntity({
      ...task,
      id: task.id ?? `tsk_${uuid.v4()}`,
      createdAt: task.createdAt ?? currentDate,
      updatedAt: task.updatedAt ?? currentDate,
    });
  }
}
