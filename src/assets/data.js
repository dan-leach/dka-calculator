import { ref } from "vue";
import { config } from "./fetchConfig.js";

// Utility functions
/**
 * Checks the length of a string value against given min and max lengths.
 * @param {string} val - The value to check.
 * @param {number} minLength - Minimum allowable length.
 * @param {number} maxLength - Maximum allowable length.
 * @param {Array} errors - Array to store error messages.
 * @param {string} fieldName - Name of the field being validated.
 */
const checkLength = (val, minLength, maxLength, errors, fieldName) => {
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
const checkNumberRange = (val, units, min, max, errors, fieldName) => {
  if (val < min) errors.push(`${fieldName} must be at least ${min}${units}.`);
  if (val > max)
    errors.push(`${fieldName} must be no more than ${max}${units}.`);
};

/**
 * Formats a UK postcode by converting to uppercase and removing spaces.
 * @param {string} val - The postcode to format.
 * @returns {string} - The formatted postcode.
 */
const formatPostcode = (val) => val.toUpperCase().replace(/\s/g, "");

/**
 * Builds an ISO string for the given date.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
const buildDateString = (date) => {
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
const ageInYears = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);

  const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000; // average year length accounting for leap years
  const ageInMilliseconds = today - birthDate;

  const decimalAge = ageInMilliseconds / millisecondsPerYear;
  return decimalAge;
};

export const data = ref({
  form: {
    /**
     * Checks if the form with the given index is valid.
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
        if (input.form.includes(formIndex)) {
          if (!input.isValid(isOptional)) isValid = false;
        }
      }
      return isValid;
    },
  },
  inputs: {
    legalAgreement: {
      val: false,
      label: "Agreement to legal disclaimer",
      info: "Your agreement to the legal disclaimer is recorded.",
      form: [0],
      isValid() {
        return this.val;
      },
    },
    patientName: {
      val: "",
      label: "Full name",
      form: [1],
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
      form: [1, 4],
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
      form: [1],
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
      form: [1, 4],
      info: "If provided, patient NHS number is printed onto the generated care pathway document in the patient demographics area. It is not stored directly by the DKA Calculator. To allow linkage of audit data between episodes the NHS number is used to generate a unique patient ID which is stored. The patient NHS number cannot be found from the calculated unique patient ID (<a href='https://www.codecademy.com/resources/blog/what-is-hashing/' target='_blank'>read more about secure cryptographic hashing</a>).",
      updateInfo:
        "Patient NHS number is not stored directly by the DKA Calculator. It is used to generate a unique patient ID which is compared with the unique ID generated when the episode was created to ensure the correct record is being updated. The patient NHS number cannot be found from the calculated unique patient ID (<a href='https://www.codecademy.com/resources/blog/what-is-hashing/' target='_blank'>read more about secure cryptographic hashing</a>).",
      min: 1000000000, //a 10 digit integer (length of an NHS number) cannot have a value less than this
      max: 9999999999, //a 10 digit integer (length of an NHS number) cannot have a value greater than this
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
      form: [1],
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
      form: [1],
      info: "The patient postcode is not stored by the DKA Calculator. If provided, it is used to find an Index of Multiple Deprivation (IMD) decile which is stored for audit purposes.",
      minLength: 5, //valid postcodes will never be shorter than this
      maxLength: 8, //valid postcodes will never be longer than this
      pattern:
        "([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))s?[0-9][A-Za-z]{2})",
      /**
       * Formats the postcode by converting to uppercase and removing spaces.
       */
      formatVal() {
        this.val = formatPostcode(this.val);
      },
      /**
       * Validates the postcode

.
       * @returns {boolean} - True if the postcode is valid, false otherwise.
       */
      isValid() {
        this.errors = "";
        const errors = [];
        if (this.optOut.val) {
          return true;
        }
        this.formatVal();
        checkLength(
          this.val,
          this.minLength,
          this.maxLength,
          errors,
          "Postcode"
        );
        if (!new RegExp(this.pattern).test(this.val))
          errors.push("Postcode must match the pattern.");
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
    protocolStartDatetime: {
      val: "",
      label: "Protocol start date/time",
      form: [2],
      info: "The protocol start date/time is used to calculate recommended review date/times on the serial data sheet on the care pathway. It is stored by the DKA Calculator for audit purposes.",
      todayString: {
        /**
         * Generates a string for today's date and assigns it to this.val.
         */
        build() {
          this.val = buildDateString(new Date());
        },
        val: "",
      },
      minDate: {
        /**
         * Generates a datetime object of the earliest allowable time the protocolStartDatetime can be set to and assigns it to this.val.
         */
        build() {
          const today = new Date();
          this.val = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            today.getHours() -
              config.value.validation.protocolStartDatetime.withinPastHours,
            today.getMinutes()
          );
        },
        val: null,
      },
      minDateString: {
        /**
         * Generates a string for minDate and assigns that value to this.val.
         */
        build() {
          this.val = buildDateString(
            data.value.inputs.protocolStartDatetime.minDate.val
          );
        },
        val: "",
      },
      maxDate: {
        /**
         * Generates a datetime object of the latest allowable time the protocolStartDatetime can be set to and assigns it to this.val.
         */
        build() {
          const today = new Date();
          this.val = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            today.getHours() +
              config.value.validation.protocolStartDatetime.withinFutureHours,
            today.getMinutes()
          );
        },
        val: null,
      },
      maxDateString: {
        /**
         * Generates a string for maxDate and assigns that value to this.val.
         */
        build() {
          this.val = buildDateString(
            data.value.inputs.protocolStartDatetime.maxDate.val
          );
        },
        val: "",
      },
      /**
       * Validates the protocol start date/time.
       * @returns {boolean} - True if the date/time is valid, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (isNaN(Date.parse(this.val))) {
          this.errors =
            "A valid date/time must be entered for protocol start date/time. ";
          return false;
        }
        const dateVal = new Date(this.val);
        if (dateVal < this.minDate.val) {
          this.errors = `Protocol start must be within the past ${config.value.validation.protocolStartDatetime.withinPastHours} hours of the current date/time. `;
          return false;
        }
        if (dateVal > this.maxDate.val) {
          this.errors = `Protocol start must be no more than ${
            config.value.validation.protocolStartDatetime.withinFutureHours
          } ${
            config.value.validation.protocolStartDatetime.withinFutureHours ===
            1
              ? "hour"
              : "hours"
          } ahead of the current date/time. `;
          return false;
        }
        return true;
      },
      errors: "",
    },
    pH: {
      val: null,
      label: "pH",
      form: [2],
      info: "pH is added to the relevant field in the care pathway. pH is used to determine DKA severity which is used in fluid deficit calculations. It is stored by the DKA Calculator for audit purposes.",
      min() {
        return config.value.validation.pH.min;
      },
      max() {
        return config.value.validation.pH.max;
      },
      step: 0.01,
      /**
       * Validates the pH value.
       * @returns {boolean} - True if the pH value is valid, false otherwise.
       */
      isValid() {
        const errors = [];
        if (this.val === null || isNaN(this.val) || this.val == "") {
          errors.push("pH must be provided. ");
        } else if (this.val >= config.value.severity.mild.pHRange.upper) {
          // Diagnostic criteria not met based on pH alone. Now check if bicarbonate is provided and is below threshold
          if (
            isNaN(data.value.inputs.bicarbonate.val) ||
            data.value.inputs.bicarbonate.val == null ||
            data.value.inputs.bicarbonate.val == "" ||
            data.value.inputs.bicarbonate.val >=
              config.value.severity.mild.bicarbonateBelow
          ) {
            errors.push(
              `To meet the diagnostic criteria for DKA, pH must be below ${config.value.severity.mild.pHRange.upper}, or bicarbonate must be below ${config.value.severity.mild.bicarbonateBelow}mmol/L. `
            );
          }
        } else {
          this.val = Number.parseFloat(this.val).toFixed(2);
          checkNumberRange(this.val, "", this.min(), this.max(), errors, "pH");
        }
        this.errors = errors.join(" ");
        return !this.errors;
      },
      errors: "",
    },
    bicarbonate: {
      val: null,
      label: "Bicarbonate",
      form: [2],
      info: "If provided, these values will be added to the relevant fields in the care pathway. Bicarbonate is used to determine DKA severity which is used in fluid deficit calculations. Bicarbonate, glucose and ketones are stored by the DKA Calculator for audit purposes.",
      privacyInfo:
        "If provided, bicarbonate will be added to the relevant field in the care pathway. Bicarbonate is used to determine DKA severity which is used in fluid deficit calculations. It is stored by the DKA Calculator for audit purposes.",
      min() {
        return config.value.validation.bicarbonate.min;
      },
      max() {
        return config.value.validation.bicarbonate.max;
      },
      step: 0.1,
      /**
       * Validates the bicarbonate value.
       * @returns {boolean} - True if the bicarbonate value is valid, false otherwise.
       */
      isValid() {
        if (this.val === null || isNaN(this.val) || this.val == "") {
          this.errors = "";
          return true;
        }
        const errors = [];
        this.val = Number.parseFloat(this.val).toFixed(1);
        checkNumberRange(
          this.val,
          "mmol/L",
          this.min(),
          this.max(),
          errors,
          "Bicarbonate"
        );
        this.errors = errors.join(" ");
        data.value.inputs.pH.isValid(); // Update pH validation (for diagnostic criteria message) when bicarbonate changes
        return !this.errors;
      },
      errors: "",
    },
    glucose: {
      val: null,
      label: "Glucose",
      privacyInfo:
        "If provided, glucose will be added to the relevant field in the care pathway. It is stored by the DKA Calculator for audit purposes.",
      form: [2, 5],
      optionalForForms: [2],
      min() {
        return config.value.validation.glucose.min;
      },
      max() {
        return config.value.validation.glucose.max;
      },
      step: 0.1,
      /**
       * Validates the glucose value.
       * @returns {boolean} - True if the glucose value is valid, false otherwise.
       */
      isValid(optional) {
        if (
          optional &&
          (this.val === null || isNaN(this.val) || this.val == "")
        ) {
          this.errors = "";
          return true;
        }
        const errors = [];
        if (this.val === null || isNaN(this.val) || this.val == "") {
          errors.push("Glucose must be provided. ");
        } else {
          this.val = Number.parseFloat(this.val).toFixed(1);
          checkNumberRange(
            this.val,
            "mmol/L",
            this.min(),
            this.max(),
            errors,
            "Glucose"
          );
        }
        this.errors = errors.join(" ");
        return !this.errors;
      },
      errors: "",
    },
    ketones: {
      val: null,
      label: "Ketones",
      privacyInfo:
        "If provided, ketone level will be added to the relevant field in the care pathway. Ketone level is used to check the diagnostic threshold for DKA is reached. It is stored by the DKA Calculator for audit purposes.",
      form: [2],
      min() {
        return config.value.validation.ketones.min;
      },
      max() {
        return config.value.validation.ketones.max;
      },
      step: 0.1,
      /**
       * Validates the ketone level.
       * @returns {boolean} - True if the ketone level is valid, false otherwise.
       */
      isValid() {
        if (this.val === null || isNaN(this.val) || this.val == "") {
          this.errors = "";
          return true;
        }
        const errors = [];
        this.val = Number.parseFloat(this.val).toFixed(1);
        checkNumberRange(
          this.val,
          "mmol/L",
          this.min(),
          this.max(),
          errors,
          "Ketones"
        );
        this.errors = errors.join(" ");
        return !this.errors;
      },
      errors: "",
    },
    weight: {
      val: null,
      label: "Weight",
      form: [2],
      info: "Weight is used to calculate fluid volumes for boluses, deficit replacement and maintenance. It is stored by the DKA Calculator for audit purposes. If the weight provided falls outside 2 standard deviations of the mean for age, whether or not you override this limit is also recorded.",
      min() {
        return config.value.validation.weight.min;
      },
      max() {
        return config.value.validation.weight.max;
      },
      step: 0.01,
      limit: {
        /**
         * Returns the lower weight limit based on patient sex and age in months.
         * @returns {number} - The lower weight limit.
         */
        lower() {
          return config.value.weightLimits[data.value.inputs.patientSex.val]
            .lower[data.value.inputs.patientDOB.ageMonths()];
        },
        /**
         * Returns the upper weight limit based on patient sex and age in months, capped by the maximum allowed weight.
         * @returns {number} - The upper weight limit.
         */
        upper() {
          let upper =
            config.value.weightLimits[data.value.inputs.patientSex.val].upper[
              data.value.inputs.patientDOB.ageMonths()
            ];
          if (upper > config.value.weightLimits.max)
            upper = config.value.weightLimits.max;
          return upper;
        },
        exceeded: false,
        override: false,
        overrideConfirm: false,
        use2SD: false,
        overrideLabel: "Override weight limit",
      },
      /**
       * Validates the weight.
       * @returns {boolean} - True if the weight is valid, false otherwise.
       */
      isValid() {
        if (!this.val) {
          this.errors += "Weight must be provided. ";
          return false;
        }

        //if was set to +2SD from override page and then subsequently changed, remove use2SD flag
        if (this.val != this.limit.upper().toFixed(2))
          this.limit.use2SD = false;

        this.val = Number.parseFloat(this.val).toFixed(2);

        const errors = [];
        checkNumberRange(
          Number.parseFloat(this.val),
          "",
          this.min(),
          this.max(),
          errors,
          "Weight"
        );
        this.errors = errors.join(" ");
        if (errors.length) return false;

        if (
          Number.parseFloat(this.val) < this.limit.lower().toFixed(2) ||
          Number.parseFloat(this.val) > this.limit.upper().toFixed(2)
        ) {
          this.limit.exceeded = true;
          if (!this.limit.override) {
            this.errors += `Weight must be within 2 standard deviations of the mean for age (upper limit ${
              config.value.weightLimits.max
            } kg) (range ${this.limit.lower().toFixed(2)} kg to ${this.limit
              .upper()
              .toFixed(2)} kg).`;
          }
        } else {
          this.limit.exceeded = false;
          this.limit.override = false;
        }
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    shockPresent: {
      val: "",
      label: "Is the patient clinically shocked?",
      privacyLabel: "Clinical shock status",
      form: [2],
      info: "Clinical shock status is used to indicate initial resuscitation strategy on the care pathway and to determine if the initial bolus is subtracted from the fluid deficit as part of the fluid calculations. It is stored by the DKA Calculator for audit purposes.",
      /**
       * Validates the clinical shock status.
       * @returns {boolean} - True if the status is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (!this.val)
          this.errors += "Clinical shock status must be selected. ";
        return !this.errors;
      },
      errors: "",
    },
    insulinRate: {
      val: "",
      label: "What starting rate of insulin is required?",
      privacyLabel: "Insulin starting rate",
      form: [2],
      info: "Insulin starting rate (in Units/kg/hour) is used to calculate an insulin rate in Units/hr. It is stored by the DKA Calculator for audit purposes.",
      /**
       * Validates the insulin starting rate.
       * @returns {boolean} - True if the rate is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (!this.val)
          this.errors += "Insulin starting rate must be selected. ";
        return !this.errors;
      },
      errors: "",
    },
    preExistingDiabetes: {
      val: "",
      label:
        "Was the patient known to have diabetes prior to the current episode of DKA?",
      privacyLabel: "Pre-existing diabetes status",
      form: [2, 4],
      info: "If the patient has pre-existing diabetes, it is used to indicate the approach to managing existing insulin therapy on the care pathway. Pre-existing diabetes status also determines the preventable factors options that can be selected. It is stored by the DKA Calculator for audit purposes.",
      updateInfo:
        "Pre-existing diabetes status determines the preventable factors options that can be selected and is stored by the DKA Calculator for audit purposes.",
      /**
       * Validates the pre-existing diabetes status.
       * @returns {boolean} - True if the status is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (this.val == "false")
          data.value.inputs.insulinDeliveryMethod.val = "";
        if (!this.val)
          this.errors += "Pre-existing diabetes status must be selected. ";
        return !this.errors;
      },
      isValidForUpdateView() {
        this.isValid();
        data.value.inputs.preventableFactors.val = [];
        data.value.inputs.preventableFactors.options.val = [];
        data.value.inputs.preventableFactors.categories.val = [];
      },
      errors: "",
    },
    insulinDeliveryMethod: {
      val: "",
      label: "Which insulin delivery method does the patient use?",
      privacyLabel: "Insulin delivery method",
      form: [2],
      info: "The insulin delivery method that the patient uses (if they have pre-existing diabetes) is stored by the DKA Calculator for audit purposes.",
      /**
       * Validates the insulin delivery method.
       * @returns {boolean} - True if the method is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (!this.val && data.value.inputs.preExistingDiabetes.val == "true")
          this.errors += "Insulin delivery method must be selected. ";
        return !this.errors;
      },
      errors: "",
    },
    episodeType: {
      val: "",
      label: "What is this protocol being used for?",
      privacyLabel: "Episode type",
      form: [3],
      info: "Episode type is stored by the DKA Calculator for audit purposes.",
      /**
       * Validates the episode type.
       * @returns {boolean} - True if the type is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (!this.val) this.errors += "Episode type must be selected. ";
        return !this.errors;
      },
      errors: "",
    },
    region: {
      val: "",
      label: "Please select your region",
      privacyLabel: "Region",
      form: [3],
      info: "Region is stored by the DKA Calculator for audit purposes.",
      /**
       * Validates the region selection and updates the centre options based on the selected region.
       * @returns {boolean} - True if the region is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (!this.val) {
          this.errors += "Region must be selected. ";
        } else {
          for (let region of config.value.regions) {
            if (region.name == this.val)
              data.value.inputs.centre.options = region.centres;
          }
        }
        return !this.errors;
      },
      errors: "",
    },
    centre: {
      val: "",
      label: "Please select the treating centre",
      privacyLabel: "Treating centre",
      options: [],
      form: [3],
      info: "Treating centre is stored by the DKA Calculator for audit purposes.",
      /**
       * Validates the treating centre selection.
       * @returns {boolean} - True if the centre is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (!this.val) this.errors += "Treating centre must be selected. ";
        return !this.errors;
      },
      errors: "",
    },
    ethnicGroup: {
      val: "",
      label: "Please select patient ethnic group",
      privacyLabel: "Patient ethnic group",
      form: [3],
      info: "Patient ethnic group is stored by the DKA Calculator for audit purposes. The list of ethnic groups is taken from the Office for National Statistics.",
      /**
       * Validates the patient ethnic group selection and updates the ethnic subgroup options based on the selected group.
       * @returns {boolean} - True if the ethnic group is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (!this.val) {
          this.errors += "Patient ethnic group must be selected. ";
        } else {
          for (let ethnicGroup of config.value.ethnicGroups) {
            if (ethnicGroup.name == this.val)
              data.value.inputs.ethnicSubgroup.options = ethnicGroup.subgroups;
          }
        }
        return !this.errors;
      },
      errors: "",
    },
    ethnicSubgroup: {
      val: "",
      label: "Please select patient ethnic subgroup",
      privacyLabel: "Patient ethnic subgroup",
      options: [],
      form: [3],
      info: "Patient ethnic subgroup is stored by the DKA Calculator for audit purposes. The list of ethnic groups is taken from the Office for National Statistics.",
      /**
       * Validates the patient ethnic subgroup selection.
       * @returns {boolean} - True if the ethnic subgroup is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (!this.val)
          this.errors += "Patient ethnic subgroup must be selected. ";
        return !this.errors;
      },
      errors: "",
    },
    preventableFactors: {
      val: [],
      label:
        "Were there any preventable factors which may have contributed to this episode of DKA?",
      privacyLabel: "Preventable factors",
      options: {
        val: [],
        list: ["Yes", "No", "Not yet known"],
        /**
         * Updates the preventable factors and resets or sets categories based on the selected option.
         * @param {string} selected - The selected option for preventable factors.
         */
        change(selected) {
          this.val = [];
          this.val.push(selected);
          if (selected === "Yes") {
            data.value.inputs.preventableFactors.categories.val = [];
            data.value.inputs.preventableFactors.val = [];
          } else {
            data.value.inputs.preventableFactors.categories.val = [selected];
            data.value.inputs.preventableFactors.val = [selected];
          }
          data.value.inputs.preventableFactors.isValid();
        },
      },
      categories: {
        val: [],
        list: [
          {
            name: "Missed/delayed diagnosis",
            preExistingDiabetes: ["false"],
          },
          {
            name: "Diabetes technology issue",
            preExistingDiabetes: ["true"],
          },
          {
            name: "Lack of adherence",
            preExistingDiabetes: ["true"],
          },
          {
            name: "Social factors",
            preExistingDiabetes: ["true", "false"],
          },
        ],
      },
      factors: [
        {
          val: "Lack of family awareness of diabetes symptoms",
          categories: ["Missed/delayed diagnosis"],
        },
        {
          val: "Lack of or delayed access to primary care appointment",
          categories: ["Missed/delayed diagnosis"],
        },
        {
          val: "Missed or delayed diagnosis in primary care",
          categories: ["Missed/delayed diagnosis"],
        },
        {
          val: "Suboptimal or incorrect investigation/referral by primary care",
          categories: ["Missed/delayed diagnosis"],
        },
        {
          val: "Missed or delayed diagnosis in secondary/tertiary care",
          categories: ["Missed/delayed diagnosis"],
        },
        {
          val: "Suboptimal or incorrect management by secondary/tertiary care",
          categories: ["Missed/delayed diagnosis"],
        },
        {
          val: "Other diagnosis issue",
          categories: ["Missed/delayed diagnosis"],
        },
        {
          val: "Concern of insulin pump malfunction",
          categories: ["Diabetes technology issue"],
        },
        {
          val: "Concern insulin pump used incorrectly",
          categories: ["Diabetes technology issue", "Lack of adherence"],
        },
        {
          val: "Concern of glucose sensor malfunction",
          categories: ["Diabetes technology issue"],
        },
        {
          val: "Other technology issue",
          categories: ["Diabetes technology issue"],
        },
        {
          val: "Concern of inadequate supervision by parent/carer",
          categories: ["Lack of adherence", "Social factors"],
        },
        {
          val: "Concern of lack of adherence to usual insulin therapy by child/young person",
          categories: ["Lack of adherence"],
        },
        {
          val: "Suboptimal monitoring of glucose or ketones",
          categories: ["Lack of adherence"],
        },
        {
          val: "Sick day rules not followed optimally",
          categories: ["Lack of adherence"],
        },
        {
          val: "Other adherance issue",
          categories: ["Lack of adherence"],
        },
        {
          val: "Language barrier",
          categories: ["Social factors"],
        },
        {
          val: "Other social factor",
          categories: ["Social factors"],
        },
      ],
      form: [3, 4],
      info: "Preventable factors are stored by the DKA Calculator for audit purposes.",
      /**
       * Validates the preventable factors selection.
       * @returns {boolean} - True if an option is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (!this.val.length) {
          this.errors += "An option for preventable factors must be selected. ";
        }
        return !this.errors;
      },
      errors: "",
    },
    auditID: {
      val: "",
      label: "Audit ID",
      form: [4],
      info: "Audit ID is required when updating the audit data for an episode. It is used to find the correct episode record.",
      minLength() {
        return config.value.validation.auditID.length;
      },
      maxLength() {
        return config.value.validation.auditID.length;
      },
      /**
       * Validates the auditID.
       * @returns {boolean} - True if the name is valid, false otherwise.
       */
      isValid() {
        const errors = [];
        checkLength(
          this.val,
          this.minLength(),
          this.maxLength(),
          errors,
          "Audit ID"
        );
        this.errors = errors.join(" ");
        return !errors.length;
      },
      errors: "",
    },
    protocolEndDatetime: {
      val: "",
      label: "Protocol end date/time",
      help: "Use the date/time of the first subcutaneous insulin dose as the end of the DKA protocol",
      form: [4],
      info: "The protocol end date/time is used is stored by the DKA Calculator for audit purposes.",
      minDate: {
        /**
         * Generates a datetime object of the earliest allowable time the protocolEndDatetime can be set to and assigns it to this.val.
         */
        build() {
          const today = new Date();
          this.val = new Date(
            today.getFullYear() -
              config.value.validation.protocolEndDatetime.withinPastYears,
            today.getMonth(),
            today.getDate(),
            today.getHours(),
            today.getMinutes()
          );
        },
        val: null,
      },
      minDateString: {
        /**
         * Generates a string for minDate and assigns that value to this.val.
         */
        build() {
          this.val = buildDateString(
            data.value.inputs.protocolEndDatetime.minDate.val
          );
        },
        val: "",
      },
      maxDate: {
        /**
         * Generates a datetime object of the latest allowable time the protocolEndDatetime can be set to and assigns it to this.val.
         */
        build() {
          this.val = new Date(
            Date.now() +
              config.value.validation.protocolEndDatetime.withinFutureMinutes *
                60 *
                1000
          );
        },
        val: null,
      },
      maxDateString: {
        /**
         * Generates a string for maxDate and assigns that value to this.val.
         */
        build() {
          this.val = buildDateString(
            data.value.inputs.protocolEndDatetime.maxDate.val
          );
        },
        val: "",
      },
      /**
       * Validates the protocol start date/time.
       * @returns {boolean} - True if the date/time is valid, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (isNaN(Date.parse(this.val))) {
          this.errors =
            "A valid date/time must be entered for protocol end date/time. ";
          return false;
        }
        const dateVal = new Date(this.val);
        if (dateVal < this.minDate.val) {
          this.errors = `Protocol end must be within the past ${config.value.validation.protocolEndDatetime.withinPastYears} years of the current date/time. `;
          return false;
        }
        if (dateVal > this.maxDate.val) {
          this.errors = `Protocol end must cannot be in the future. `;
          return false;
        }
        return true;
      },
      errors: "",
    },
    cerebralOedemaConcern: {
      val: "",
      label:
        "Were there any concerns of cerebral oedema during this episode of DKA?",
      privacyLabel: "Cerebral oedema concern",
      form: [4],
      info: "If there were any concerns regarding cerebral oedema during the episode of DKA questions about treatment and imaging will also be asked. These responses are recorded for audit purposes.",
      /**
       * Validates the cerebral oedema status.
       * @returns {boolean} - True if the status is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (this.val === "false") {
          data.value.inputs.cerebralOedemaImaging.val = "";
          data.value.inputs.cerebralOedemaTreatment.val = [];
        }
        if (!this.val)
          this.errors += "Cerebral oedema concern option must be selected. ";
        return !this.errors;
      },
      errors: "",
    },
    cerebralOedemaImaging: {
      val: "",
      label:
        "If imaging was performed did it show any evidence of cerebral oedema?",
      privacyLabel: "Cerebral oedema imaging",
      form: [4],
      info: "Evidence of cerebral oedema on imaging is recorded for audit purposes",
      /**
       * Validates the cerebral oedema imaging status.
       * @returns {boolean} - True if the status is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (data.value.inputs.cerebralOedemaConcern.val === "false")
          return true;
        if (!this.val)
          this.errors += "Cerebral oedema imaging option must be selected. ";
        return !this.errors;
      },
      errors: "",
    },
    cerebralOedemaTreatment: {
      val: [],
      label: "Was any treatment given for cerebral oedema?",
      privacyLabel: "Cerebral oedema treatment",
      form: [4],
      info: "Treatment type given for cerebral oedema is recorded for audit purposes",
      /**
       * Validates the cerebral oedema treatment status.
       * @returns {boolean} - True if the status is selected, false otherwise.
       */
      isValid() {
        this.errors = "";
        if (this.val.includes("no")) this.val = ["no"];
        if (data.value.inputs.cerebralOedemaConcern.val === "false")
          return true;
        if (!this.val.length)
          this.errors += "Cerebral oedema treatment option must be selected. ";
        return !this.errors;
      },
      errors: "",
    },
    sodium: {
      val: null,
      label: "Sodium",
      privacyInfo:
        "Sodium is used to calculate corrected sodium and effective osmolality using the relevant standalone calculator <a href='/sodium-osmo'>found here</a>. It is stored for audit purposes.",
      form: [5],
      min() {
        return config.value.validation.sodium.min;
      },
      max() {
        return config.value.validation.sodium.max;
      },
      step: 0.1,
      /**
       * Validates the sodium value.
       * @returns {boolean} - True if the sodium value is valid, false otherwise.
       */
      isValid() {
        const errors = [];
        if (this.val === null || isNaN(this.val) || this.val == "") {
          errors.push("Sodium must be provided. ");
        } else {
          this.val = Number.parseFloat(this.val).toFixed(1);
          checkNumberRange(
            this.val,
            "mmol/L",
            this.min(),
            this.max(),
            errors,
            "Sodium"
          );
        }
        this.errors = errors.join(" ");
        return !this.errors;
      },
      errors: "",
    },
    other: {
      privacyLabel: "Other data recorded",
      form: [],
      privacyInfo:
        "In addition to the input fields above, the following data are recorded to enable audit, security and performance monitoring: <ul><li>The audit ID (unique to for each care pathway generated) which is also printed on the generated PDF document and can be used for audit data linkage</li><li>Software version of the DKA Calculator used for the episode</li><li>The results of the calculations performed by the DKA Calculator including DKA severity, fluid and insulin calculations, corrected sodium and effective osmolality calculations</li><li>The date/time when the protocol was generated</li><li>The browser type (useragent) used to access the DKA Calculator</li><li>The IP address of the device used to access the DKA Calculator</li></ul>",
    },
  },
  calculations: {},
  auditID: "",
});
