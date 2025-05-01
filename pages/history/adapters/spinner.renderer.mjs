export class SpinnerRenderer {
  /**
   * @private
   * @readonly
   * @type {string}
   **/
  #spinnerId = "spinner";

  /**
   * @private
   * @readonly
   * @type {string}
   **/
  #backdropId = "spinner-backdrop";

  constructor() {}

  /**
   * Retrieves or creates a spinner element with a specified message.
   * If the spinner element does not already exist in the DOM, it creates a new one,
   * sets its attributes and classes, and appends it to the document body.
   *
   * @private
   * @param {Object} options - Options for the spinner.
   * @param {string} options.message - The message to display below the spinner.
   * @param {boolean} options.withBackdrop - Whether to include a backdrop behind the spinner.
   * @returns {HTMLDivElement} The spinner element.
   */
  #getSpinner({ message, withBackdrop } = { message: "", withBackdrop: true }) {
    // Create or find the spinner
    let spinnerElement = document.getElementById(this.#spinnerId);
    if (!spinnerElement) {
      spinnerElement = this.#createSpinner({ message, withBackdrop });

      const parentContainer = withBackdrop ? this.#getBackdrop() : document.body;

      parentContainer.appendChild(spinnerElement);
    }

    return spinnerElement;
  }

  /**
   * Creates a spinner element with a specified message and optional backdrop.
   * The spinner is centered on the screen and can be styled with Bootstrap classes.
   *
   * @private
   * @param {Object} options - Options for the spinner.
   * @param {string} options.message - The message to display below the spinner.
   * @param {boolean} options.withBackdrop - Whether to include a backdrop behind the spinner.
   * @returns {HTMLDivElement} The spinner element.
   */
  #createSpinner({ message, withBackdrop } = { message: "", withBackdrop: false }) {
    const spinnerElement = document.createElement("div");
    spinnerElement.id = this.#spinnerId;
    spinnerElement.classList.add(
      "d-flex",
      "justify-content-center",
      "align-items-center",
      "flex-column",
      "spinner-container"
    );

    if (!withBackdrop) {
      spinnerElement.classList.add("position-absolute");
      spinnerElement.style.zIndex = 1051; // Bootstrap modal z-index is 1050
      spinnerElement.style.top = "50%";
      spinnerElement.style.left = "50%";
      spinnerElement.style.transform = "translate(-50%, -50%)";
    }

    spinnerElement.innerHTML = `
        <div class="spinner-border text-primary" role="status">
          ${!message ? '<span class="visually-hidden">Loading...</span>' : ""}
        </div>
        ${message ? `<div class="spinner-message text-white mt-2">${message}</div>` : ""}`;

    return spinnerElement;
  }

  #getBackdrop() {
    // Create or find the backdrop
    let backdrop = document.getElementById(this.#backdropId);
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = this.#backdropId;
      backdrop.classList.add(
        "position-fixed",
        "top-0",
        "start-0",
        "w-100",
        "h-100",
        "bg-dark",
        "bg-opacity-50",
        "d-flex",
        "justify-content-center",
        "align-items-center"
      );
      backdrop.style.zIndex = 1051; // Bootstrap modal z-index is 1050
      backdrop.style.pointerEvents = "none"; // Prevents interaction with the backdrop
      backdrop.style.backdropFilter = "blur(4px)";
      document.body.appendChild(backdrop);
    }

    return backdrop;
  }

  /**
   * Displays a spinner with an optional message and backdrop.
   * If a spinner is already displayed, it updates the message.
   *
   *
   * @param {Object} options - Options for the spinner.
   * @param {string} options.message - The message to display below the spinner.
   * @param {boolean} options.withBackdrop - Whether to include a backdrop behind the spinner. Defaults to true if not specified.
   */
  showSpinner({ message, withBackdrop } = { message: "", withBackdrop: true }) {
    this.spinnerElement = this.#getSpinner({ message, withBackdrop: withBackdrop == undefined ? true : withBackdrop });
  }

  hideSpinner() {
    const spinnerElement = document.getElementById(this.#spinnerId);

    if (!spinnerElement) {
      return;
    }

    const backdrop = this.spinnerElement.parentElement;
    this.spinnerElement.remove();
    this.spinnerElement = null;

    if (backdrop && backdrop.id === "spinner-backdrop") {
      backdrop.remove();
    }
  }
}
