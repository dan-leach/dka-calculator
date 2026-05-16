/**
 * Creates a pseudonymous patient identifier for audit purposes.
 *
 * Generates a one-way SHA-256 hash from the concatenation of the patient's
 * NHS number and date of birth. The hash is stored against audit records so
 * that duplicate or related episodes can be detected across retrospective
 * entries without retaining directly identifiable information in the
 * calculator's own data store.
 *
 * @param {string} patientNHS - The patient's NHS number (digits only, no spaces).
 * @param {string} patientDOB - The patient's date of birth in ISO 8601 format (YYYY-MM-DD).
 * @returns {Promise<string>} A lowercase hexadecimal SHA-256 digest string (64 characters).
 */
async function createPatientHash(patientNHS, patientDOB) {
  const dataToHash = new TextEncoder().encode(patientNHS + patientDOB);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataToHash);
  return Array.from(new Uint8Array(hashBuffer), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export { createPatientHash };
