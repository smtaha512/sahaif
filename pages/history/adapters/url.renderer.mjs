export class UrlRenderer {
  /**
   * Retrieves the current query parameters from the URL and parses them into a structured object.
   * @returns {Object} An object containing the parsed query parameters:
   * - `startedAt` {Date|null}: The start date parsed from the "startedAt" query parameter, or `null` if not present or invalid.
   * - `endedAt` {Date|null}: The end date parsed from the "endedAt" query parameter, or `null` if not present or invalid.
   */
  getCurrentQueryParams() {
    const url = new URL(window.location.href);
    const startedAt = url.searchParams.get("startedAt");
    const endedAt = url.searchParams.get("endedAt");
    return {
      startedAt: startedAt ? new Date(startedAt) : null,
      endedAt: endedAt ? new Date(endedAt) : null,
    };
  }

  /**
   * @private
   * @param {Date} startedAt
   * @param {Date} endedAt
   */
  updateQueryParams(startedAt, endedAt) {
    const url = new URL(window.location.href);
    if (startedAt) {
      url.searchParams.set("startedAt", dateFns.format(startedAt.toISOString(), "yyyy-MM-dd"));
    } else {
      url.searchParams.delete("startedAt");
    }
    if (endedAt) {
      url.searchParams.set("endedAt", dateFns.format(endedAt.toISOString(), "yyyy-MM-dd"));
    } else {
      url.searchParams.delete("endedAt");
    }
    window.history.pushState({}, "", url);
  }
}
