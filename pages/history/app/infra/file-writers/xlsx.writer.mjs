import { FileWriterPort } from "../../../ports/file-writer.port.mjs";

export class XlsxWriter extends FileWriterPort {
  /**
   * Builds an Excel workbook from the provided tasks.
   * @param {Task[]} task
   */
  buildFile(tasks, taskNames = []) {
    const { tasks: formattedTasks, maxColumnWidths } = this.#prepareTasksForExport(tasks);

    const worksheet1 = XLSX.utils.aoa_to_sheet([this.#headerRow, ...formattedTasks]);
    worksheet1["!cols"] = this.#buildColumnWidths(maxColumnWidths);

    const worksheet2 = XLSX.utils.aoa_to_sheet([["Task Names"], ...taskNames.map((name) => [name])]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, "Tasks");
    XLSX.utils.book_append_sheet(workbook, worksheet2, "Names");

    if (taskNames?.length) {
      worksheet1["!dataValidation"] = this.#getValidationRulesForTasks({ tasks, taskNames });
    }
    return workbook;
  }

  /**
   * Saves the workbook to a file.
   * @param {XLSX.WorkBook} workbook - The workbook to save.
   * @param {string} fileName - The name of the file to save.
   */
  writeFile(workbook, fileName) {
    XLSX.writeFile(workbook, fileName);
  }

  #prepareTasksForExport(tasks) {
    return tasks.reduce(
      (acc, task, index) => {
        const row = this.#formatTaskRow(task, index);

        const updatedMaxWidths = acc.maxColumnWidths.map((prevWidth, colIdx) => {
          const value = typeof row[colIdx]?.v === "string" ? row[colIdx].v : "";
          return Math.max(prevWidth, value.length);
        });

        acc.tasks[index] = row;

        return {
          tasks: acc.tasks,
          maxColumnWidths: updatedMaxWidths,
        };
      },
      {
        tasks: new Array(tasks.length),
        maxColumnWidths: [4, 11, 11, 10, 10], // starting with header lengths
      }
    );
  }

  get #headerRow() {
    return ["Task", "Started at", "Ended at", "Date", "Time spent"];
  }

  #formatTaskRow(task, index) {
    return [
      { t: "s", v: task.name },
      this.#formatTimeCell(task.startedAt),
      this.#formatTimeCell(task.endedAt),
      this.#formatDateCell(task.startedAt),
      this.#formatDurationFormula(index),
    ];
  }

  #formatTimeCell(date) {
    if (!date) return { t: "s", v: "" };
    return {
      t: "n",
      z: "hh:mm:ss AM/PM",
      v: undefined,
      f: `TIME(${dateFns.format(date, "HH,mm,ss")})`,
    };
  }

  #formatDateCell(date) {
    if (!date) return { t: "s", v: "" };
    return {
      t: "n",
      z: "MM/DD/YYYY",
      v: undefined,
      f: `DATE(${dateFns.format(date, "yyyy,MM,dd")})`,
    };
  }

  #formatDurationFormula(index) {
    const row = index + 2;
    return {
      t: "n",
      z: "[hh]:mm:ss",
      f: `IF(AND(NOT(B${row}), NOT(C${row})), "0:00:00", IF(NOT(C${row}), B${row}, C${row}) - B${row})`,
    };
  }

  #buildColumnWidths(maxColumnWidths) {
    return maxColumnWidths.map((wch) => ({ wch: wch + 2 })); // add padding
  }

  #getValidationRulesForTasks({ tasks, taskNames }) {
    const namesRange = `Names!$A$2:$A$${taskNames.length + 1}`; // skip header row

    // Apply data validation on column A (excluding header)
    const validationRules = new Array(tasks.length - 2).map((_, index) => ({
      sqref: `A${index + 2}`,
      type: "list",
      allowBlank: true,
      showInputMessage: true,
      showErrorMessage: false,
      formula1: namesRange,
    }));

    return validationRules;
  }
}
