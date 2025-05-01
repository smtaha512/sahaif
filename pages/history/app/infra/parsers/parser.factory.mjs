import { ParserStrategyNotImplementedError } from "./errors/parser-strategy-not-implemented.error.mjs";
import { XlsxParserStrategy } from "./xlsx-parser.strategy.mjs";

export class ParserFactory {
  /**
   * @private
   * @readonly
   * @type {TaskMapper}
   */
  #mapper;

  /**
   * @typedef {import('../domain/task-mapper.mjs').TaskMapper} TaskMapper
   * @param {TaskMapper} mapper
   */
  constructor(mapper) {
    if (!mapper) {
      throw new Error("Please provide TaskMapper");
    }
    this.#mapper = mapper;
  }

  /**
   * @typedef {import("./parser.strategy.mjs").ParserStrategy} ParserStrategy;
   * @param {"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/vnd.ms-excel"} format
   * @returns {ParserStrategy}
   */
  createParser(format) {
    switch (format) {
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return new XlsxParserStrategy(this.#mapper);
      case "application/vnd.ms-excel":
        return new XlsxParserStrategy(this.#mapper);
      default:
        throw new ParserStrategyNotImplementedError(format);
    }
  }
}
