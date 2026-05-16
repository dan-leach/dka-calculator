/**
 * Checks the length of a string value against given min and max lengths.
 * @param {string} val - The value to check.
 * @param {number} minLength - Minimum allowable length.
 * @param {number} maxLength - Maximum allowable length.
 * @param {Array} errors - Array to store error messages.
 * @param {string} fieldName - Name of the field being validated.
 */
export const checkLength = (val, minLength, maxLength, errors, fieldName) => {
  if (val.length < minLength)
    errors.push(`${fieldName} must be at least ${minLength} characters.`);
  if (val.length > maxLength)
    errors.push(`${fieldName} must be no more than ${maxLength} characters.`);
};

/**
 * Checks if a number is within a specified range.
 * @param {number} val - The value to check.
 * @param {string} units - The units applicable to the value being checked.
 * @param {number} min - Minimum allowable value.
 * @param {number} max - Maximum allowable value.
 * @param {Array} errors - Array to store error messages.
 * @param {string} fieldName - Name of the field being validated.
 */
export const checkNumberRange = (val, units, min, max, errors, fieldName) => {
  if (val < min) errors.push(`${fieldName} must be at least ${min}${units}.`);
  if (val > max)
    errors.push(`${fieldName} must be no more than ${max}${units}.`);
};

/**
 * Formats a UK postcode by converting to uppercase and removing spaces.
 * @param {string} val - The postcode to format.
 * @returns {string} - The formatted postcode.
 */
export const formatPostcode = (val) => val.toUpperCase().replace(/\s/g, "");

/**
 * Builds an ISO datetime-local string for the given date.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string (YYYY-MM-DDTHH:MM).
 */
export const buildDateString = (date) => {
  const pad = (num) => (num < 10 ? `0${num}` : num);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Calculates age in years (as a decimal) from the given date of birth.
 * @param {string} dob - Date of birth in ISO format.
 * @returns {number} - Age in years (including decimal).
 */
export const ageInYears = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000; // average year length accounting for leap years
  const ageInMilliseconds = today - birthDate;
  return ageInMilliseconds / millisecondsPerYear;
};
