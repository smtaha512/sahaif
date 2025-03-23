import { convertDateAndTimeToJSDate } from "../../../../../shared/utils/date.utils.mjs";
import { EndDateTimeBeforeStartDateTimeError } from "./errors/end-date-time-before-start-date-time.error.mjs";
import { MissingTaskDataError } from "./errors/missing-task-data.error.mjs";

export class AddNewTaskInputValidator {
  /**
   * Validates the provided task object to ensure that all required fields are present
   * and that the end date/time is not before the start date/time.
   *
   * @typedef {import('./add-new-task.input.dto.mjs').AddNewTaskInputDTO} AddNewTaskInputDTO
   * @param {AddNewTaskInputDTO} task - The task object to validate.
   * @throws {MissingTaskDataError} If any required field is missing in the task.
   * @throws {EndDateTimeBeforeStartDateTimeError} If the end date/time is earlier than the start date/time.
   */
  static validate(task) {
    const missingFields = Object.entries(task)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      throw new MissingTaskDataError(missingFields);
    }

    const { startDate, startTime, endDate, endTime } = task;

    const startedAt = convertDateAndTimeToJSDate(startDate, startTime);
    const endedAt = convertDateAndTimeToJSDate(endDate, endTime);

    if (dateFns.isBefore(endedAt, startedAt)) {
      throw new EndDateTimeBeforeStartDateTimeError();
    }
  }
}
