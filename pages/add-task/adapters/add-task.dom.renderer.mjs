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
   * @type {AddNewTaskUseCase}
   **/
  #addNewTaskUseCase = null;

  /**
   * @private
   * @readonly
   * @type {"add-task"}
   **/
  #formId = "add-task";

  /**
   * @param {AddNewTaskUseCase} addNewTaskUseCase
   */
  constructor(addNewTaskUseCase) {
    super();
    this.#addNewTaskUseCase = addNewTaskUseCase;
    this.#initializeForm();
  }

  #initializeForm() {
    this.#setDefaultStartDateTime();
    this.#setDefaultEndDateTime();

    const self = this;

    document.getElementById("add-task-button").addEventListener("click", async function onButtonClick() {
      const taskDTO = self.#getTaskDTOFromForm(self.#getForm());
      await self.#handleAddTask(taskDTO);
    });
  }

  async #handleAddTask(taskDTO) {
    try {
      AddNewTaskInputValidator.validate(taskDTO);

      await this.#addNewTaskUseCase.execute(taskDTO);

      this.#notifySuccess();
      this.#clearFormFields();
    } catch (error) {
      this.handleError(error);
    }
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
      console.log(error);

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
