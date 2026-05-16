import { data } from "./dataRef.js";
import { config } from "../fetchConfig.js";
import { checkLength, formatPostcode, ageInYears } from "./validators.js";

// Form 1 — Patient Details
// (some fields also appear in forms 4 and 6 for the retrospective update flow)

export const patientInputs = {
  patientName: {
    val: "",
    label: "Full name",
    form: [3],
    info: "Patient name is printed onto the generated care pathway document in the patient demographics area. It is not stored by the DKA Calculator.",
    minLength: 5,
    maxLength: 80,
    /**
     * Validates the patient name.
     * @returns {boolean} - True if the name is valid, false otherwise.
     */
    isValid() {
      const errors = [];
      checkLength(this.val, this.minLength, this.maxLength, errors, "Name");
      this.errors = errors.join(" ");
      return !errors.length;
    },
    errors: "",
  },

  patientDOB: {
    val: "",
    label: "Date of birth",
    form: [3, 8],
    info: "Patient date of birth is printed onto the generated care pathway document in the patient demographics area. It is not stored directly by the DKA Calculator, but is used to calculate a patient age (in decimal years) which is used to check the patient weight is within the expected range. The decimal age is stored for audit purposes. To allow linkage of audit data between episodes the patient date of birth is also used (together with the NHS number) to generate a unique patient ID which is stored. The patient date of birth cannot be found from the calculated unique patient ID (<a href='https://www.codecademy.com/resources/blog/what-is-hashing/' target='_blank'>read more about secure cryptographic hashing</a>).",
    updateInfo:
      "Patient date of birth is not stored directly by the DKA Calculator. It is used to generate a unique patient ID which is compared with the unique ID generated when the episode was created to ensure the correct record is being updated. The patient date of birth cannot be found from the calculated unique patient ID (<a href='https://www.codecademy.com/resources/blog/what-is-hashing/' target='_blank'>read more about secure cryptographic hashing</a>).",
    /**
     * Builds the patient's age in years from the date of birth.
     */
    patientAge: {
      build() {
        this.val = ageInYears(data.value.inputs.patientDOB.val);
      },
    },
    /**
     * Computes the minimum allowable date of birth based on age limit.
     * @returns {Date} - The minimum allowable date.
     */
    minDate() {
      const minDate = new Date();
      minDate.setFullYear(
        minDate.getFullYear() - (config.value.validation.patientAge.max + 1)
      );
      return minDate;
    },
    /**
     * Calculates the age in months from the date of birth.
     * @returns {number} - Age in months.
     */
    ageMonths() {
      return (ageInYears(this.val) * 12).toFixed(0);
    },
    /**
     * Validates the date of birth.
     * @returns {boolean} - True if the date of birth is valid, false otherwise.
     */
    isValid() {
      const errors = [];
      const dateVal = new Date(this.val);
      if (isNaN(Date.parse(this.val)))
        errors.push("A valid date must be entered for date of birth.");
      if (dateVal > new Date())
        errors.push("Date of birth cannot be after today.");

      this.patientAge.build();
      if (this.patientAge.val > config.value.validation.patientAge.max) {
        errors.push(
          `Patient age cannot be greater than ${config.value.validation.patientAge.max.toFixed(
            0
          )} years.`
        );
      }

      this.errors = errors.join(" ");
      return !errors.length;
    },
    errors: "",
  },

  patientSex: {
    val: "",
    label: "Patient sex",
    form: [3],
    info: "Patient sex is printed onto the generated care pathway. It is stored by the DKA Calculator for audit purposes.",
    /**
     * Validates the patient sex.
     * @returns {boolean} - True if the sex is selected, false otherwise.
     */
    isValid() {
      this.errors = this.val ? "" : "Patient sex must be selected.";
      return !this.errors;
    },
    errors: "",
  },

  patientNHS: {
    val: "",
    label: "NHS number",
    form: [3, 8],
    info: "If provided, patient NHS number is printed onto the generated care pathway document in the patient demographics area. It is not stored directly by the DKA Calculator. To allow linkage of audit data between episodes the NHS number is used to generate a unique patient ID which is stored. The patient NHS number cannot be found from the calculated unique patient ID (<a href='https://www.codecademy.com/resources/blog/what-is-hashing/' target='_blank'>read more about secure cryptographic hashing</a>).",
    updateInfo:
      "Patient NHS number is not stored directly by the DKA Calculator. It is used to generate a unique patient ID which is compared with the unique ID generated when the episode was created to ensure the correct record is being updated. The patient NHS number cannot be found from the calculated unique patient ID (<a href='https://www.codecademy.com/resources/blog/what-is-hashing/' target='_blank'>read more about secure cryptographic hashing</a>).",
    min: 1000000000, // a 10-digit integer cannot have a value less than this
    max: 9999999999, // a 10-digit integer cannot have a value greater than this
    /**
     * Validates the NHS number.
     * @returns {boolean} - True if the NHS number is valid, false otherwise.
     */
    isValid() {
      this.errors = "";
      if (this.optOut.val) return true;
      if (this.val < this.min)
        this.errors +=
          "NHS number must be at least " +
          this.min.toString().length +
          " characters in length. ";
      if (this.val > this.max)
        this.errors +=
          "NHS number must be no more than " +
          this.max.toString().length +
          " characters in length. ";
      return !this.errors;
    },
    errors: "",
    optOut: {
      val: false,
      label: "I don't have an NHS number for my patient",
      msg: {
        text: "Please consider using an NHS number rather than a local patient ID number. This allows linkage of anonymous audit data from different episodes.",
        show: true,
      },
    },
  },

  patientHospNum: {
    val: "",
    label: "Hospital number",
    form: [3],
    info: "If used instead of the patient NHS number, patient hospital number is printed onto the generated care pathway document in the patient demographics area. It is not stored by the DKA Calculator.",
    minLength: 4,
    maxLength: 20,
    /**
     * Validates the hospital number.
     * @returns {boolean} - True if the hospital number is valid, false otherwise.
     */
    isValid() {
      const errors = [];
      if (!data.value.inputs.patientNHS.optOut.val) return true;
      checkLength(
        this.val,
        this.minLength,
        this.maxLength,
        errors,
        "Hospital number"
      );
      this.errors = errors.join(" ");
      return !errors.length;
    },
    errors: "",
  },

  patientPostcode: {
    val: "",
    label: "Postcode",
    form: [3, 7],
    info: "The patient postcode is not stored by the DKA Calculator. It is used to find an Index of Multiple Deprivation (IMD) decile which is stored for audit purposes.",
    minLength: 5, // valid postcodes will never be shorter than this
    maxLength: 8, // valid postcodes will never be longer than this
    pattern:
      "([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))s?[0-9][A-Za-z]{2})",
    /**
     * Formats the postcode by converting to uppercase and removing spaces.
     */
    formatVal() {
      this.val = formatPostcode(this.val);
    },
    /**
     * Validates the postcode.
     * @returns {boolean} - True if the postcode is valid, false otherwise.
     */
    isValid() {
      this.errors = "";
      const errors = [];
      if (this.optOut.val) {
        return true;
      }
      this.formatVal();
      if (!new RegExp(this.pattern).test(this.val))
        errors.push("Must be a valid UK postcode.");
      this.errors = errors.join(" ");
      return !errors.length;
    },
    errors: "",
    optOut: {
      val: false,
      label: "I don't have a postcode for my patient",
      msg: {
        text: "Please consider providing a postcode. This allows us to audit patient's Index of Multiple Deprivation (IMD) deciles for DKA episodes.",
        show: true,
      },
    },
  },
};
