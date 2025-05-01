import { RestoredTaskInputDto } from "./dtos/restored-task.input.dto.mjs";

export class TaskMapper {
  /**
   * @typedef {import('./dtos/restored-task.input.dto.mjs').RestoredTaskInputDto} RestoredTaskInputDto
   * @param {RestoredTaskInputDto} RestoredTaskInputDto
   */

  fromBackup({ task, startedAt, endedAt, date }) {
    return RestoredTaskInputDto.build({
      endDate: date,
      endTime: endedAt,
      name: task,
      startDate: date,
      startTime: startedAt,
    });
  }
}
