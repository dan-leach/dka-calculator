import { data } from "./dataRef.js";
import { config } from "../fetchConfig.js";
import { checkNumberRange, buildDateString } from "./validators.js";

// Form 2 — Clinical Details

export const clinicalInputs = {
  protocolStartDatetime: {
    val: "",
    label: "Protocol start date/time",
    form: [4],
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
      if (
        dateVal < this.minDate.val &&
        data.value.retrospectiveEpisode === false
      ) {
        this.errors = `Protocol start must be within the past ${config.value.validation.protocolStartDatetime.withinPastHours} hours of the current date/time. `;
        return false;
      }
      if (dateVal > this.maxDate.val) {
        this.errors = `Protocol start must be no more than ${
          config.value.validation.protocolStartDatetime.withinFutureHours
        } ${
          config.value.validation.protocolStartDatetime.withinFutureHours === 1
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
    form: [4],
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
    form: [4],
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
    form: [4, 6],
    optionalForForms: [4],
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
    form: [4],
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
    form: [4],
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

      // If was set to +2SD from override page and then subsequently changed, remove use2SD flag
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
    form: [4],
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
    form: [4],
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
    form: [4, 7],
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
    form: [4],
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
};
