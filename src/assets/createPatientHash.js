async function createPatientHash(patientNHS, patientDOB) {
  const dataToHash = new TextEncoder().encode(patientNHS + patientDOB);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataToHash);
  return Array.from(new Uint8Array(hashBuffer), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export { createPatientHash };
