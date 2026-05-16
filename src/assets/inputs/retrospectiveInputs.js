import { data } from "./dataRef.js";
import { config } from "../fetchConfig.js";
import { checkLength, buildDateString } from "./validators.js";

// Forms 4, 6, 7 — Retrospective audit update flow

export const retrospectiveInputs = {
  auditID: {
    val: "",
    label: "Audit ID",
    form: [4, 6],
    info: "Audit ID is required when updating the audit data for an episode. It is used to find the correct episode record.",
    minLength() {
      return config.value.validation.auditID.length;
    },
    maxLength() {
      return config.value.validation.auditID.length;
    },
    /**
     * Validates the auditID.
     * @returns {boolean} - True if the audit ID is valid, false otherwise.
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
     * Validates the protocol end date/time.
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

  protocolStartDate: {
    val: "",
    label: "Protocol start date",
    form: [7],
    info: "The protocol start date is used to check that the patient hash is being added to the correct episode.",
    /**
     * Validates the protocol start date.
     * @returns {boolean} - True if the date is valid, false otherwise.
     */
    isValid() {
      this.errors = "";
      if (isNaN(Date.parse(this.val))) {
        this.errors =
          "A valid date must be entered for protocol start date. ";
        return false;
      }
      return true;
    },
    errors: "",
  },

  other: {
    privacyLabel: "Other data recorded",
    form: [],
    privacyInfo:
      "In addition to the input fields above, the following data are recorded to enable audit, security and performance monitoring: <ul><li>The audit ID (unique to for each care pathway generated) which is also printed on the generated PDF document and can be used for audit data linkage</li><li>Software version of the DKA Calculator used for the episode</li><li>The results of the calculations performed by the DKA Calculator including DKA severity, fluid and insulin calculations, corrected sodium and effective osmolality calculations</li><li>The date/time when the protocol was generated</li><li>The browser type (useragent) used to access the DKA Calculator</li><li>The IP address of the device used to access the DKA Calculator</li></ul>",
  },
};
