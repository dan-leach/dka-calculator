import { config } from "../fetchConfig.js";
import { checkNumberRange } from "./validators.js";

// Form 5 — Sodium / Osmolality standalone calculator

export const sodiumInputs = {
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
};
