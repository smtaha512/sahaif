/**
 * Sets custom CSS variables for the height of elements based on their IDs.
 * The function dynamically sets a CSS variable for each specified element's height
 * in the form of `--<id>-height`. The value is set only if it differs from the
 * current value to avoid redundant updates.
 *
 * @param {string[]} ids - A list of element IDs to target. Each ID will be used
 * to generate a custom property for the element's height.
 * @returns {void}
 *
 * @example
 * setCssVariables('header', 'footer');
 * // This will set --header-height and --footer-height CSS variables with
 * // their respective height values, if they are different from the current ones.
 */
export function setCssVariables(...ids) {
  if (!ids?.length) {
    return;
  }

  const elements = document.querySelectorAll(`:is(${ids.map((id) => `#${id}`).join(", ")})`);
  const rootStyle = document.documentElement.style;

  elements.forEach((element) => {
    const propertyName = `--${element.id}-height`;
    const nextValueToSet = `${element.clientHeight}px`;

    const currentValue = rootStyle.getPropertyValue(propertyName);

    if (currentValue === nextValueToSet) {
      return;
    }

    rootStyle.setProperty(propertyName, nextValueToSet);
  });
}
