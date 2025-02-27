import { convertDateAndTimeToJSDate } from "../../../../../shared/utils/date.utils.mjs";
import { Task } from "../../../domain/entities/task.mjs";
import { AddNewTaskInputValidator } from "./add-new-task.input.validator.mjs";

export class AddNewTaskInputDTO {
  /**
   * @param {Object} params - The input data for the new task.
   * @param {string} params.name - The name of the task.
   * @param {string} params.startDate - The start date of the task in YYYY-MM-DD format.
   * @param {string} params.startTime - The start time of the task in HH:mm format.
   * @param {string} params.endDate - The end date of the task in YYYY-MM-DD format.
   * @param {string} params.endTime - The end time of the task in HH:mm format.
   */
  constructor({ name, startDate, startTime, endDate, endTime }) {
    AddNewTaskInputValidator.validate({ name, startDate, startTime, endDate, endTime });

    this.name = name;
    this.startDate = startDate;
    this.startTime = startTime;
    this.endDate = endDate;
    this.endTime = endTime;
  }

  /**
   * @returns {Task} The created Task entity.
   */
  toTaskEntity() {
    const task = new Task();

    task.endedAt = convertDateAndTimeToJSDate(this.endDate, this.endTime);
    task.startedAt = convertDateAndTimeToJSDate(this.startDate, this.startTime);
    task.name = this.name;

    return task;
  }
}
