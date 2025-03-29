import { TasksDatabase } from "../../../../core/infra/persistence/datasource.mjs";
import { setCssVariables } from "../../../../shared/utils/set-css-variables.mjs";
import { AddTaskDomRenderer } from "../../adapters/add-task.dom.renderer.mjs";
import { DraftTaskDexieRepository } from "../../infra/persistence/draft-task.dexie.repository.mjs";
import { TaskNamesDexieRepository } from "../../infra/persistence/task-names.dexie.repository.mjs";
import { TasksDexieRepository } from "../../infra/persistence/tasks.dexie.repository.mjs";
import { AddNewTaskUseCase } from "../use-cases/add-new-task/add-new-task.use-case.mjs";
import { LoadDraftTaskUseCase } from "../use-cases/load-draft-task.use-case/load-draft-task.use-case.mjs";
import { SaveDraftTaskUseCase } from "../use-cases/save-draft-task.use-case/save-draft-task.use-case.mjs";

document.addEventListener("DOMContentLoaded", async function () {
  const navigationIds = ["top-nav", "bottom-nav"];
  setCssVariables(...navigationIds);

  await initializeAddTaskApplication();
});

async function initializeAddTaskApplication() {
  const tasksDatabase = new TasksDatabase();

  const tasksRepository = new TasksDexieRepository(tasksDatabase);
  const draftTasksRepository = new DraftTaskDexieRepository(tasksDatabase);
  const taskNamesRepository = new TaskNamesDexieRepository(tasksDatabase);

  const addTaskUseCase = new AddNewTaskUseCase(tasksRepository, draftTasksRepository, taskNamesRepository);
  const loadDraftTaskUseCase = new LoadDraftTaskUseCase(draftTasksRepository);
  const saveDraftTaskUseCase = new SaveDraftTaskUseCase(draftTasksRepository);
  new AddTaskDomRenderer(addTaskUseCase, loadDraftTaskUseCase, saveDraftTaskUseCase, taskNamesRepository);
}
