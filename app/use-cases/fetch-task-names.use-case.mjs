export class FetchTaskNamesUseCase {
  /**
   * @private
   * @readonly
   * @typedef {import("../../pages/add-task/ports/task-names.repository.port.mjs").TaskNamesRepository} TaskNamesRepository
   * @type {TaskNamesRepository}
   **/
  #taskNamesRepository = null;

  /**
   * @param {TaskNamesRepository} taskNamesRepository
   */
  constructor(taskNamesRepository) {
    if (!taskNamesRepository) {
      throw new Error("Please provide TaskNamesRepository");
    }
    this.#taskNamesRepository = taskNamesRepository;
  }
  /**
   * Fetches all task names from the repository
   * @returns {Promise<string[]>}
   */
  async sortedByName() {
    try {
      const taskNames = await this.#taskNamesRepository.findAllSorted();
      return taskNames;
    } catch (error) {
      console.error("Failed to fetch task names:", error);
      throw error;
    }
  }
}
