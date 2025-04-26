export class SpinnerRenderer {
  /**
   * @private
   * @readonly
   * @type {string}
   **/
  #spinnerId = "spinner";
  /**
   * @param {HTMLElement} spinnerElement
   */
  constructor() {}

  #getSpinner(message) {
    let spinnerElement = document.getElementById(this.#spinnerId);

    if (!spinnerElement) {
      // create new spinner element
      spinnerElement = document.createElement("div");
      spinnerElement.id = this.#spinnerId;
      spinnerElement.classList.add(
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "flex-column",
        "spinner-container",
        "position-fixed"
      );
      spinnerElement.innerHTML = `<div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-message">${message}</div>`;
      // Append to the body or a specific container
      document.body.appendChild(spinnerElement);
    }
    return spinnerElement;
  }

  showSpinner(message = "") {
    this.spinnerElement = this.#getSpinner(message);
  }

  hideSpinner() {
    if (!this.spinnerElement) {
      return;
    }
    // Remove the spinner element from the DOM
    this.spinnerElement.remove();
  }
}
