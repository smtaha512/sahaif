import { TasksDatabase } from "../../../../core/infra/persistence/datasource.mjs";
import { setCssVariables } from "../../../../shared/utils/set-css-variables.mjs";
import { TasksDexieRepository } from "../../../add-task/infra/persistence/tasks.dexie.repository.mjs";
import { HistoryTableBodyDomRenderer } from "../../adapters/history-table-body.dom.renderer.mjs";
import { FetchHistoryUseCase } from "../use-cases/fetch-history.use-case.mjs";

document.addEventListener("DOMContentLoaded", async function () {
  const navigationIds = ["top-nav", "bottom-nav"];
  setCssVariables(...navigationIds);

  await initializeHistoryApplication();
});

async function initializeHistoryApplication() {
  const tasksDatabase = new TasksDatabase();
  const tasksRepository = new TasksDexieRepository(tasksDatabase);

  const fetchHistoryUseCase = new FetchHistoryUseCase(tasksRepository);

  new HistoryTableBodyDomRenderer(fetchHistoryUseCase);
}
