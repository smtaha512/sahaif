import { TasksDatabase } from "../../../../core/infra/persistence/datasource.mjs";
import { setCssVariables } from "../../../../shared/utils/set-css-variables.mjs";
import { AddTaskDomRenderer } from "../../adapters/add-task.dom.renderer.mjs";
import { TasksDexieRepository } from "../../infra/persistence/tasks.dexie.repository.mjs";
import { AddNewTaskUseCase } from "../use-cases/add-new-task/add-new-task.use-case.mjs";

document.addEventListener("DOMContentLoaded", async function () {
  const navigationIds = ["top-nav", "bottom-nav"];
  setCssVariables(...navigationIds);

  await initializeAddTaskApplication();
});

async function initializeAddTaskApplication() {
  const tasksDatabase = new TasksDatabase();

  const tasksRepository = new TasksDexieRepository(tasksDatabase);

  const addTaskUseCase = new AddNewTaskUseCase(tasksRepository);
  new AddTaskDomRenderer(addTaskUseCase);
}
