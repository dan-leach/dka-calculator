import { data } from "./inputs/dataRef.js";
import { disclaimerInputs } from "./inputs/disclaimerInputs.js";
import { patientInputs } from "./inputs/patientInputs.js";
import { clinicalInputs } from "./inputs/clinicalInputs.js";
import { auditInputs } from "./inputs/auditInputs.js";
import { retrospectiveInputs } from "./inputs/retrospectiveInputs.js";
import { sodiumInputs } from "./inputs/sodiumInputs.js";

/**
 * Central data store for the DKA Calculator.
 * Assembled here from domain-specific input files, then re-exported.
 *
 * All views continue to import { data } from "../assets/data.js" unchanged.
 *
 * Form index reference:
 *   1 — Disclaimer
 *   2 — Protocol purpose
 *   3 — Patient details
 *   4 — Clinical details
 *   5 — Audit details
 *   6 — Sodium / osmolality calculator
 *   7 — Retrospective audit update
 *   8 — Check retrospective status
 *   9 — Add retrospective patient hash
 */
data.value = {
  form: {
    /**
     * Checks if all inputs for the given form index are valid.
     * @param {number} formIndex - The index of the form to validate.
     * @returns {boolean} - True if the form is valid, false otherwise.
     */
    isValid(formIndex) {
      let isValid = true;
      for (let i in data.value.inputs) {
        let input = data.value.inputs[i];
        let isOptional = false;
        if (input.optionalForForms) {
          if (input.optionalForForms.includes(formIndex)) isOptional = true;
        }
        if (input.form && input.form.includes(formIndex)) {
          if (!input.isValid(isOptional)) isValid = false;
        }
      }
      return isValid;
    },
  },
  inputs: {
    ...disclaimerInputs,
    ...patientInputs,
    ...clinicalInputs,
    ...auditInputs,
    ...retrospectiveInputs,
    ...sodiumInputs,
  },
  calculations: {},
  auditID: "",
  retrospectiveEpisode: false,
};

export { data };
