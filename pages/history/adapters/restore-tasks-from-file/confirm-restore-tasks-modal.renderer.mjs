export class ConfirmRestoreTasksModalRenderer {
  /**
   * @private
   * @readonly
   * @type {string}
   **/
  #modalId = "confirm-restore-tasks-modal";
  /**
   * @private
   * @readonly
   * @type {string}
   **/
  #confirmButtonId = "confirm-restore-tasks";
  /**
   * @private
   * @readonly
   * @type {string}
   **/
  #rejectButtonId = "reject-restore-tasks";

  /**
   * @param {Function} [onConfirm = () => {}]
   **/
  setupModal(onConfirm = () => {}) {
    const modal = this.#getModal();

    if (!modal) {
      throw new UnableToInitializeBootstrapModalError(this.#modalId);
    }

    const confirmButton = document.getElementById(this.#confirmButtonId);
    const rejectButton = document.getElementById(this.#rejectButtonId);

    function handleConfirmation() {
      onConfirm();
      modal.hide();
    }

    function handleRejection() {
      modal.hide();
    }

    confirmButton.addEventListener("click", handleConfirmation, { once: true });
    rejectButton.addEventListener("click", handleRejection, { once: true });

    return modal;
  }

  #getModal() {
    const modalElement = document.getElementById(this.#modalId);
    const bootstrapModal = bootstrap.Modal.getOrCreateInstance(modalElement);

    return bootstrapModal;
  }
}
