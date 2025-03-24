export class LoadDraftTaskUseCase {
  /**
   * @private
   * @readonly
   * @type {DraftTaskRepository} */
  #draftTaskRepository;

  constructor(draftTaskRepository) {
    this.#draftTaskRepository = draftTaskRepository;
  }

  async execute() {
    const draftTask = await this.#draftTaskRepository.find();

    if (!draftTask) {
      return {
        ["name"]: "",
        ["start-date"]: "",
        ["start-time"]: "",
        ["end-date"]: "",
        ["end-time"]: "",
      };
    }

    const formatDate = (date) => (date ? dateFns.format(new Date(date), "yyyy-MM-dd") : "");
    const formatTime = (date) => (date ? dateFns.format(new Date(date), "HH:mm") : "");

    return {
      ["name"]: draftTask.name || "",
      ["start-date"]: formatDate(draftTask.startedAt),
      ["start-time"]: formatTime(draftTask.startedAt),
      ["end-date"]: formatDate(draftTask.endedAt),
      ["end-time"]: formatTime(draftTask.endedAt),
    };
  }
}
