/**
 * Converts date and time parts to a JavaScript Date object.
 *
 * @param {string} datePart - The date part in YYYY-MM-DD format.
 * @param {string} timePart - The time part in HH:mm format.
 * @returns {Date} The corresponding JavaScript Date object.
 */
export function convertDateAndTimeToJSDate(datePart, timePart) {
  const combinedDateTime = `${datePart}T${timePart}`;

  return dateFns.parse(combinedDateTime, "yyyy-MM-dd'T'HH:mm", new Date());
}
