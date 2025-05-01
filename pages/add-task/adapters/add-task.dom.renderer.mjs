import { AddNewTaskInputDTO } from "../app/use-cases/add-new-task/add-new-task.input.dto.mjs";
import { AddNewTaskInputValidator } from "../app/use-cases/add-new-task/add-new-task.input.validator.mjs";
import { AddNewTaskUseCase } from "../app/use-cases/add-new-task/add-new-task.use-case.mjs";
import { EndDateTimeBeforeStartDateTimeError } from "../app/use-cases/add-new-task/errors/end-date-time-before-start-date-time.error.mjs";
import { MissingTaskDataError } from "../app/use-cases/add-new-task/errors/missing-task-data.error.mjs";
import { AddTaskRendererPort } from "../ports/add-task.renderer.port.mjs";
import { CannotFindElementError } from "./errors/cannot-find-element.error.mjs";

/**
 * @export
 * @class AddTaskDomRenderer
 * @extends {AddTaskRendererPort}
 */
export class AddTaskDomRenderer extends AddTaskRendererPort {
  /**
   * @private
   * @readonly
   * @typedef {import("../app/use-cases/add-new-task/add-new-task.use-case.mjs").AddNewTaskUseCase} AddNewTaskUseCase
   * @type {AddNewTaskUseCase}
   **/
  #addNewTaskUseCase = null;

  /**
   * @private
   * @readonly
   * @typedef {import("../app/use-cases/load-draft-task.use-case/load-draft-task.use-case.mjs").LoadDraftTaskUseCase} LoadDraftTaskUseCase
   * @type {LoadDraftTaskUseCase}
   **/
  #loadDraftTaskUseCase = null;

  /**
   * @private
   * @readonly
   * @typedef {import("../app/use-cases/save-draft-task.use-case/save-draft-task.use-case.mjs").SaveDraftTaskUseCase} SaveDraftTaskUseCase
   * @type {SaveDraftTaskUseCase}
   **/
  #saveDraftTaskUseCase = null;

  /**
   * @private
   * @readonly
   * @typedef {import("../../../app/use-cases/fetch-task-names.use-case.mjs").FetchTaskNamesUseCase} FetchTaskNamesUseCase
   * @type {FetchTaskNamesUseCase}
   **/
  #fetchTaskNamesUseCase = null;

  /**
   * @private
   * @readonly
   * @type {"add-task"}
   **/
  #formId = "add-task";

  /**
   * @param {AddNewTaskUseCase} addNewTaskUseCase
   * @param {DraftTaskRepository} draftTaskRepository
   */
  constructor(addNewTaskUseCase, loadDraftTaskUseCase, saveDraftTaskUseCase, fetchTaskNamesUseCase) {
    super();
    this.#addNewTaskUseCase = addNewTaskUseCase;
    this.#loadDraftTaskUseCase = loadDraftTaskUseCase;
    this.#saveDraftTaskUseCase = saveDraftTaskUseCase;
    this.#fetchTaskNamesUseCase = fetchTaskNamesUseCase;
    this.#initializeForm();
  }

  #initializeForm() {
    this.#setDefaultStartDateTime();
    this.#setDefaultEndDateTime();
    this.#loadDraftTask();
    this.#saveDraftTaskOnInputBlur();
    this.#populateTaskSuggestions();

    const self = this;

    document.getElementById("add-task-button").addEventListener("click", async function onButtonClick() {
      const taskDTO = self.#getTaskDTOFromForm(self.#getForm());
      await self.#handleAddTask(taskDTO);
    });

    document.getElementById("");
  }

  /**
   * Loads a draft task into the form fields if a task is provided.
   *
   * @private
   * @async
   */
  async #loadDraftTask() {
    const form = this.#getForm();

    const fields = await this.#loadDraftTaskUseCase.execute();

    // Loop through the fields and populate the form values
    Object.entries(fields).forEach(([fieldId, fieldValue]) => {
      const field = form.querySelector(`#${fieldId}`);

      if (!field || !fieldValue) {
        return;
      }

      field.value = fieldValue;
    });
  }

  async #saveDraftTaskOnInputBlur() {
    const form = this.#getForm();

    const inputs = form.querySelectorAll("input");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        const taskDTO = this.#getTaskDTOFromForm(form);
        this.#saveDraftTaskUseCase.execute(taskDTO);
      });
    });
  }

  async #handleAddTask(taskDTO) {
    try {
      AddNewTaskInputValidator.validate(taskDTO);

      await this.#addNewTaskUseCase.execute(taskDTO);

      this.#notifySuccess();
      this.#clearFormFields();
      await this.#populateTaskSuggestions();
    } catch (error) {
      this.handleError(error);
    }
  }

  async #populateTaskSuggestions() {
    const suggestions = await this.#fetchTaskNamesUseCase.sortedByName();

    if (!Array.isArray(suggestions) || suggestions?.length === 0) {
      return;
    }

    // Populate the task suggestions
    const suggestionsContainer = document.getElementById("task-suggestions");
    if (!suggestionsContainer) {
      throw new CannotFindElementError("task-suggestions");
    }

    suggestionsContainer.innerHTML = ""; // Clear previous suggestions
    const fragment = document.createDocumentFragment();

    suggestions.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      fragment.appendChild(option);
    });

    suggestionsContainer.innerHTML = ""; // Clear existing suggestions
    suggestionsContainer.appendChild(fragment);
  }

  #notifySuccess() {
    this.#showAlert("Task added successfully!", "success");
  }

  handleError(error) {
    if (error instanceof MissingTaskDataError) {
      this.#showAlert(error.message, "danger");
    } else if (error instanceof EndDateTimeBeforeStartDateTimeError) {
      this.#showAlert(error.message, "danger");
    } else {
      console.error(error);

      this.#showAlert("An unexpected error occurred. Please try again.", "danger");
    }
  }

  #hideAlert() {
    const alertElement = document.querySelector(".alert");
    if (alertElement) {
      alertElement.classList.remove("show");
      alertElement.classList.add("hide");
      setTimeout(() => {
        alertElement.remove();
      }, 500); // Wait for fade-out effect
    }
  }

  #showAlert(message, type = "success") {
    console.trace();
    const alertContainer = document.getElementById("alert-container");
    const alertHTML = `
      <div id="alert" role="alert" class="alert alert-${type} alert-dismissible fade show mx-auto d-flex align-items-center" role="alert">
        <span>${message}</span>
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </button>
      </div>
          `;
    alertContainer.innerHTML = alertHTML;

    // Auto-hide the alert after 3 seconds
    setTimeout(() => {
      this.#hideAlert();
    }, 3000);
  }

  #clearFormFields() {
    const form = document.getElementById(this.#formId);
    if (!form) {
      throw new CannotFindElementError(this.#formId);
    }
    if (form) {
      form.reset(); // Reset all form fields to their initial values
    }
  }

  #setDefaultDateTime(form, dateFieldName, timeFieldName) {
    const now = new Date();
    const date = dateFns.format(now, "yyyy-MM-dd");
    const time = dateFns.format(now, "HH:mm");

    if (!form[dateFieldName].value) {
      form[dateFieldName].value = date;
    }

    if (!form[timeFieldName].value) {
      form[timeFieldName].value = time;
    }
  }

  #setDefaultStartDateTime() {
    const form = document.getElementById(this.#formId);

    this.#setDefaultDateTime(form, "start-date", "start-time");
  }

  #setDefaultEndDateTime() {
    const form = document.getElementById(this.#formId);
    this.#setDefaultDateTime(form, "end-date", "end-time");
  }

  /**
   * @returns {HTMLFormElement}
   */

  #getForm() {
    const form = document.getElementById(this.#formId);

    if (!form) {
      throw new CannotFindElementError(this.#formId);
    }

    return form;
  }

  /**
   * Extracts and structures task data from the form fields into a DTO.
   * @param {HTMLFormElement} form
   * @returns {AddNewTaskInputDTO} The task data transfer object.
   */
  #getTaskDTOFromForm(form) {
    const formData = new FormData(form);

    const formValues = [...formData.entries()].reduce(
      (acc, [input, value]) => ({ ...acc, [_.camelCase(input)]: (value ?? "").trim() }),
      {}
    );

    return new AddNewTaskInputDTO(formValues);
  }
}
