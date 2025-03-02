export class CannotFindElementError extends Error {
  code = "CANNOT_FIND_ELEMENT";

  constructor(selector = "") {
    super(`Can not find element by selector: ${selector}`);
  }
}
