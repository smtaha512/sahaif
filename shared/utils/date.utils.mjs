/**
 * Converts date and time parts to a JavaScript Date object.
 *
 * @param {string} datePart - Date in any common format.
 * @param {string} [timePart] - Time in HH:mm or similar.
 * @returns {Date|null} Parsed Date object or null if invalid.
 */
export function convertDateAndTimeToJSDate(datePart, timePart = "") {
  if (datePart instanceof Date) {
    return datePart;
  }

  const hasTime = timePart?.trim() !== "";
  const separators = hasTime ? ["T", " "] : [""];
  const candidates = separators.map((sep) => `${datePart}${sep}${timePart}`.trim());

  const dateTimeFormats = [
    "yyyy-MM-dd'T'HH:mm:ss",
    "yyyy-MM-dd HH:mm:ss",
    "MM/dd/yyyy hh:mm:ss a",
    "dd/MM/yyyy HH:mm",
    "MM-dd-yyyy HH:mm",
    "yyyy/MM/dd HH:mm",
  ];
  const dateOnlyFormats = [
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "dd/MM/yyyy",
    "MMM d, yyyy",
    "MMMM d, yyyy",
    "yyyy/MM/dd",
    "dd-MM-yyyy",
    "MM-dd-yyyy",
  ];

  const formats = hasTime ? dateTimeFormats : dateOnlyFormats;

  for (const candidate of candidates) {
    for (const format of formats) {
      const parsed = dateFns.parse(candidate, format, new Date());
      if (dateFns.isValid(parsed)) return parsed;
    }
  }

  const fallback = new Date(`${datePart} ${timePart}`.trim());
  return dateFns.isValid(fallback) ? fallback : null;
}
