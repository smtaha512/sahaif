import { TasksDatabase } from "../../../../core/infra/persistence/datasource.mjs";
import { setCssVariables } from "../../../../shared/utils/set-css-variables.mjs";
import { TaskNamesDexieRepository } from "../../../add-task/infra/persistence/task-names.dexie.repository.mjs";
import { TasksDexieRepository } from "../../../add-task/infra/persistence/tasks.dexie.repository.mjs";
import { FileReaderAdapter } from "../../adapters/file-reader.adapter.mjs";
import { HistoryTableBodyDomRenderer } from "../../adapters/history-table/history-table-body.dom.renderer.mjs";
import { HistoryTableNavigationButtonsDomRenderer } from "../../adapters/history-table/history-table-navigation-button.dom.renderer.mjs";
import { RestoreTasksFromFileRenderer } from "../../adapters/restore-tasks-from-file/restore-tasks-from-file.renderer.mjs";
import { SpinnerRenderer } from "../../adapters/spinner.renderer.mjs";
import { UrlRenderer } from "../../adapters/url.renderer.mjs";
import { TaskMapper } from "../../domain/task-mapper.mjs";
import { ParserFactory } from "../../parsers/parser.factory.mjs";
import { FetchHistoryUseCase } from "../use-cases/fetch-history.use-case.mjs";
import { FetchLatestTaskUseCase } from "../use-cases/fetch-latest-task.use-case.mjs";
import { HasAlreadyExistingTasksUseCase } from "../use-cases/has-already-existing-tasks.use-case.mjs";
import { RestoreTasksUseCase } from "../use-cases/restore-tasks.use-case.mjs";

document.addEventListener("DOMContentLoaded", async function () {
  const navigationIds = ["top-nav", "bottom-nav"];
  setCssVariables(...navigationIds);

  await initializeHistoryApplication();
});

async function initializeHistoryApplication() {
  const tasksDatabase = new TasksDatabase();
  const tasksRepository = new TasksDexieRepository(tasksDatabase);
  const taskNamesRepository = new TaskNamesDexieRepository(tasksDatabase);

  const fetchLatestTaskUseCase = new FetchLatestTaskUseCase(tasksRepository);
  const fetchHistoryUseCase = new FetchHistoryUseCase(tasksRepository, fetchLatestTaskUseCase);
  const restoreTasksUseCase = new RestoreTasksUseCase(tasksRepository, taskNamesRepository);
  const hasAlreadyExistingTasksUseCase = new HasAlreadyExistingTasksUseCase(tasksRepository);
  const fileReader = new FileReaderAdapter();
  const parserFactory = new ParserFactory(new TaskMapper());

  const spinnerRenderer = new SpinnerRenderer();
  const urlRenderer = new UrlRenderer();
  const historyTableBodyDomRenderer = new HistoryTableBodyDomRenderer(
    fetchHistoryUseCase,
    fetchLatestTaskUseCase,
    spinnerRenderer,
    urlRenderer
  );
  new RestoreTasksFromFileRenderer(
    restoreTasksUseCase,
    hasAlreadyExistingTasksUseCase,
    fileReader,
    parserFactory,
    historyTableBodyDomRenderer,
    spinnerRenderer
  );
  new HistoryTableNavigationButtonsDomRenderer(fetchLatestTaskUseCase, urlRenderer, historyTableBodyDomRenderer);
}
