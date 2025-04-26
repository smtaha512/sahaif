import { MethodNotImplementedError } from "../../../shared/errors/method-not-implemented.error.mjs";

export class ParserStrategy {
  constructor(mapper) {
    if (!mapper) {
      throw new Error("Please provide TaskMapper.name");
    }
    this.mapper = mapper;
  }

  parse(data) {
    throw new MethodNotImplementedError();
  }
}
