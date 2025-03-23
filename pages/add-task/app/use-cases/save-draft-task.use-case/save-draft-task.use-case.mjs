export class SaveDraftTaskUseCase {
  /**
   * @private
   * @readonly
   * @@typedef {import("../../ports/draft-task.repository.port.mjs").DraftTaskRepository} DraftTaskRepository
   * @type {DraftTaskRepository} */
  #draftTaskRepository;

  constructor(draftTaskRepository) {
    this.#draftTaskRepository = draftTaskRepository;
  }

  /**
   * @typedef {import("../add-new-task/add-new-task.input.dto.mjs").AddNewTaskInputDTO} AddNewTaskInputDTO
   * @param {AddNewTaskInputDTO} task
   */
  async execute(task) {
    await this.#draftTaskRepository.delete();
    await this.#draftTaskRepository.insert(task.toTaskEntity());
  }
}
