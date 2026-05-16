import { data } from "./dataRef.js";
import { config } from "../fetchConfig.js";

// Form 3 — Audit Details
// episodeType is Form 8 (Protocol Purpose), grouped here as it is audit-related

export const auditInputs = {
  episodeType: {
    val: "",
    label: "What is this protocol being used for?",
    privacyLabel: "Episode type",
    form: [2],
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
    form: [5, 9],
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
    form: [5, 9],
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
    form: [5, 7],
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
    form: [5, 7],
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
    form: [5, 7],
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
};
