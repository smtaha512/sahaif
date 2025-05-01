import { ParserStrategy } from "./parser.strategy.mjs";

export class XlsxParserStrategy extends ParserStrategy {
  /**
   * @typedef {import('../domain/task-mapper.mjs').TaskMapper} TaskMapper
   * @param {TaskMapper} mapper
   */
  constructor(mapper) {
    if (!mapper) {
      throw new Error(`Please provide ${TaskMapper.name}`);
    }
    super(mapper);
  }
  /**
   * @param {string} data
   * @returns {Promise<Task[]>}
   */
  async parse(data) {
    const workbook = await this.#readXlsxFile(data);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = this.#sheetToJson(sheet);

    return rows
      .map((row) => ({ ...row, task: row.task?.trim() ?? "" }))
      .filter(({ task }) => !!task)
      .map(({ task, startedAt, endedAt, date }) => this.mapper.map({ task, startedAt, endedAt, date }));
  }

  /**
   * @private
   * @param {string} data
   * @returns {Promise<Workbook>}
   */
  async #readXlsxFile(data) {
    const workbook = XLSX.read(data, { type: "array" });
    return workbook;
  }

  /**
   * @private
   * @typedef {Object} ParsedRow
   * @property {string} task
   * @property {string} startedAt
   * @property {string} endedAt
   * @property {string} date
   *
   * @param {Sheet} sheet
   * @returns {ParsedRow[]} parsedRows
   */
  #sheetToJson(sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    return rows.slice(1).map(([task, started, ended, date]) => {
      debugger;
      const parsedStart = started == undefined || !started.toString().trim() ? null : XLSX.SSF.parse_date_code(started);
      const parsedEnd = ended == undefined || !ended.toString().trim() ? null : XLSX.SSF.parse_date_code(ended);
      const parsedDate = date ? XLSX.SSF.parse_date_code(date) : null;

      const startDate = withNullFallback(
        parsedStart,
        (parsedStart) => new Date(0, 0, 0, parsedStart.H, parsedStart.M, parsedStart.S)
      );
      const endDate = withNullFallback(
        parsedEnd,
        (parsedEnd) => new Date(0, 0, 0, parsedEnd.H, parsedEnd.M, parsedEnd.S)
      );
      const fullDate = withNullFallback(
        parsedDate,
        (parsedDate) => new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d)
      );

      return {
        task,
        startedAt: withNullFallback(startDate, (startDate) => dateFns.format(startDate, "hh:mm:ss a")),
        endedAt: withNullFallback(endDate, (endDate) => dateFns.format(endDate, "hh:mm:ss a")),
        date: withNullFallback(fullDate, (fullDate) => dateFns.format(fullDate, "MM/dd/yyyy")),
      };
    });
  }
}

/**
 * @template T
 * @template U
 * @param {T | null} value
 * @param {(value: T) => U} callback
 * @returns {T extends null ? null : U}
 */
function withNullFallback(value, callback) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof callback !== "function") {
    throw new Error("Callback must be a function");
  }

  return callback(value);
}
