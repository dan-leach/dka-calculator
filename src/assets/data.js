import { ref } from "vue";
import { config } from "./config.js";

export const data = ref({
  form: {
    isValid: function (formIndex) {
      let formValid = true;
      for (let i in data.value.inputs)
        if (
          data.value.inputs[i].form === formIndex &&
          !data.value.inputs[i].isValid()
        )
          formValid = false;

      if (formValid) return true;
      return false;
    },
  },
  inputs: {
    legalAgreement: {
      val: false,
      form: 0,
      isValid: function () {
        if (!this.val) return false;
        return true;
      },
    },
    patientName: {
      val: "",
      label: "Full name",
      form: 1,
      info: "Patient name is printed onto the generated care pathway document in the patient demographics area. It is not stored by the DKA Calculator.",
      minLength: 5,
      maxLength: 80,
      isValid: function () {
        this.errors = "";

        if (this.val.length < this.minLength)
          this.errors +=
            "Name must be at least " +
            this.minLength +
            " characters in length. ";

        if (this.val.length > this.maxLength)
          this.errors +=
            "Name must be no more than " +
            this.maxLength +
            " characters in length. ";

        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    patientDOB: {
      val: "",
      label: "Date of birth",
      form: 1,
      info: "Patient date of birth is printed onto the generated care pathway document in the patient demographics area. It is not stored directly by the DKA Calculator, but is used to calculate a patient age (in years) which is stored for audit purposes.",
      withinYears: 19, //date of birth must be between today and 19 years ago - allowance for adult patients not yet transitioned to adult services
      patientAge: {
        build: function () {
          const today = new Date();
          const birthDate = new Date(data.value.inputs.patientDOB.val);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
        
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        
          this.val = age;
        }
        
        },
        val: null,
      minDate: function () {
        const today = new Date();
        const minDate = new Date(
          today.getFullYear() - this.withinYears,
          today.getMonth(),
          today.getDate()
        );
        return minDate;
      },
      ageMonths: function() {
        let months;
        let today = new Date()
        let dob = new Date(data.value.inputs.patientDOB.val)
        months = (today.getFullYear() - dob.getFullYear()) * 12;
        months -= dob.getMonth();
        months += today.getMonth();
        return months <= 0 ? 0 : months;
      },
      isValid: function () {
        this.errors = "";
        if (isNaN(Date.parse(this.val))) {
          this.errors += "A valid date must be entered for date of birth. ";
          return false;
        }
        const dateVal = new Date(this.val);
        const today = new Date();
        if (dateVal > today)
          this.errors += "Date of birth cannot be after today. ";

        if (dateVal < this.minDate)
          this.errors +=
            "Date of birth cannot be more than " +
            this.withinYears +
            " years ago. ";

        if (this.errors) return false;

        this.patientAge.build()
        if (this.patientAge.val > config.client.ageLimit) {
          this.errors += "Patient age cannot be greater than " + config.client.ageLimit + " years. ";
          return false
        }

        return true;
      },
      errors: "",
    },
    patientSex: {
      val: "",
      form: 1,
      info: "Patient sex is stored by the DKA Calculator for audit purposes.",
      isValid: function () {
        this.errors = "";
        if (!this.val) this.errors += "Patient sex must be selected. ";
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    patientNHS: {
      val: "",
      label: "NHS number",
      form: 1,
      info: "Patient NHS number is printed onto the generated care pathway document in the patient demographics area. It is not stored directly by the DKA Calculator. To allow linkage of audit data between episodes the NHS number is used to generate a unique patient ID which is stored. The patient's NHS number cannot be found from the calculated unique patient ID (<a href='https://www.codecademy.com/resources/blog/what-is-hashing/' target='_blank'>read more about secure hashing</a>).",
      min: 1000000000,
      max: 9999999999,
      isValid: function () {
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

        if (this.errors) return false;
        return true;
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
      form: 1,
      info: "Patient hospital number is printed onto the generated care pathway document in the patient demographics area. It is not stored by the DKA Calculator.",
      minLength: 4,
      maxLength: 20,
      isValid: function () {
        this.errors = "";

        if (!data.value.inputs.patientNHS.optOut.val) return true;

        if (this.val.length < this.minLength)
          this.errors +=
            "Hospital number must be at least " +
            this.minLength +
            " characters in length. ";

        if (this.val.length > this.maxLength)
          this.errors +=
            "Hospital number must be no more than " +
            this.maxLength +
            " characters in length. ";

        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    patientPostcode: {
      val: "",
      label: "Postcode",
      form: 1,
      info: "The patient postcode is not stored by the DKA Calculator. It is used to find an Index of Multiple Deprivation (IMD) decile which is stored for audit purposes.",
      minLength: 5,
      maxLength: 8,
      pattern:
        "([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))s?[0-9][A-Za-z]{2})",
      formatVal: function () {
        this.val = this.val.toUpperCase();
        this.val = this.val.replaceAll(/\s/g, "");
      },
      isValid: function () {
        this.formatVal();
        this.errors = "";

        if (this.optOut.val) return true;

        const regex = new RegExp(this.pattern, "g");

        if (this.val.length < this.minLength) {
          this.errors +=
            "Postcode must be at least " +
            this.minLength +
            " characters in length. ";
        } else if (this.val.length > this.maxLength) {
          this.errors +=
            "Postcode must be no more than " +
            this.maxLength +
            " characters in length. ";
        } else if (!regex.test(this.val)) {
          //uses else if rather than consecutive ifs to avoid adding further invalid error message for short/long postcodes
          this.errors += "Postcode is not valid. ";
        }

        if (this.errors) return false;
        return true;
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
      form: 2,
      info: "The protocol start date/time is used to calculated recommended review date/times on the serial data sheet on the care pathway. It is stored by the DKA Calculator for audit purposes.",
      withinHours: 24,
      todayString: {
        build: function () {
          const today = new Date();
          let todayString = today.getFullYear()
          todayString += '-' + ((today.getMonth()<9) ? '0' : '') + (today.getMonth()+1)
          todayString += '-' + ((today.getDate()<10) ? '0' : '') + today.getDate()
          todayString += 'T' + ((today.getHours()<10) ? '0' : '') + today.getHours()
          todayString += ':' + ((today.getMinutes()<10) ? '0' : '') + today.getMinutes()
          this.val = todayString
        },
        val: ''
      },
      minDate: {
        build: function () {
          const today = new Date();
          const minDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            today.getHours() - data.value.inputs.protocolStartDatetime.withinHours,
            today.getMinutes()
          );
          this.val = minDate;
        },
        val: null
      },
      minDateString: {
        build: function () {
          let minDate = data.value.inputs.protocolStartDatetime.minDate.val
          let minDateString = minDate.getFullYear()
          minDateString += '-' + ((minDate.getMonth()<9) ? '0' : '') + (minDate.getMonth()+1)
          minDateString += '-' + ((minDate.getDate()<10) ? '0' : '') + minDate.getDate()
          minDateString += 'T' + ((minDate.getHours()<10) ? '0' : '') + minDate.getHours()
          minDateString += ':' + ((minDate.getMinutes()<10) ? '0' : '') + minDate.getMinutes()
          this.val = minDateString
        },
        val: ''
      },
      maxDate: {
        build: function () {
          const today = new Date();
          const maxDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            today.getHours() + data.value.inputs.protocolStartDatetime.withinHours,
            today.getMinutes()
          );
          this.val = maxDate;
        },
        val: null
      },
      maxDateString: {
        build: function () {
          let maxDate = data.value.inputs.protocolStartDatetime.maxDate.val
          let maxDateString = maxDate.getFullYear()
          maxDateString += '-' + ((maxDate.getMonth()<9) ? '0' : '') + (maxDate.getMonth()+1)
          maxDateString += '-' + ((maxDate.getDate()<10) ? '0' : '') + maxDate.getDate()
          maxDateString += 'T' + ((maxDate.getHours()<10) ? '0' : '') + maxDate.getHours()
          maxDateString += ':' + ((maxDate.getMinutes()<10) ? '0' : '') + maxDate.getMinutes()
          this.val = maxDateString
        },
        val: ''
      },
      isValid: function () {
        this.errors = "";
        if (isNaN(Date.parse(this.val))) {
          this.errors +=
            "A valid date/time must be entered for protocol start date/time. ";
          return false;
        }
        const dateVal = new Date(this.val);
        if (dateVal <= this.minDate.val || dateVal >= this.maxDate.val)
          this.errors +=
            "Protocol start must be within " +
            this.withinHours +
            " hours of the current date/time. ";

        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    pH: {
      val: null,
      label: "pH",
      form: 2,
      info: "pH is used to determine DKA severity which is used in fluid deficit calculations. It is stored by the DKA Calculator for audit purposes.",
      min: 6.2,
      max: 7.5,
      step: 0.01,
      isValid: function () {
        this.errors = "";
        if (!this.val) {
          this.errors += "pH must be provided. ";
        } else {
          this.val = Number.parseFloat(this.val).toFixed(2);

          if (this.val < this.min)
            this.errors += "pH must be at least " + this.min + ". ";

          if (this.val > this.max)
            this.errors += "pH must be no more than " + this.max + ". ";
        }
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    bicarbonate: {
      val: null,
      label: "Bicarbonate",
      form: 2,
      info: "If provided, these values will be added to the relevant fields in the care pathway. Bicarbonate is used to determine DKA severity which is used in fluid deficit calculations. Bicarbonate, glucose and ketones are stored by the DKA Calculator for audit purposes.",
      min: 0,
      max: 35,
      step: 0.1,
      isValid: function () {
        this.errors = "";
        if (this.val) {
          this.val = Number.parseFloat(this.val).toFixed(1);

          if (this.val < this.min)
            this.errors +=
              "Bicarbonate must be at least " + this.min + " mmol/L. ";

          if (this.val > this.max)
            this.errors +=
              "Bicarbonate must be no more than " + this.max + " mmol/L. ";
        }

        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    glucose: {
      val: null,
      label: "Glucose",
      form: 2,
      min: 3,
      max: 50,
      step: 0.1,
      isValid: function () {
        this.errors = "";
        if (this.val) {
          this.val = Number.parseFloat(this.val).toFixed(1);

          if (this.val < this.min)
            this.errors +=
              "Glucose must be at least " + this.min + " mmol/L. ";

          if (this.val > this.max)
            this.errors +=
              "Glucose must be no more than " + this.max + " mmol/L. ";
        }

        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    ketones: {
      val: null,
      label: "Ketones",
      form: 2,
      min: 0,
      max: 15,
      step: 0.1,
      isValid: function () {
        this.errors = "";
        if (this.val) {
          this.val = Number.parseFloat(this.val).toFixed(1);

          if (this.val < this.min)
            this.errors +=
              "Ketone level must be at least " + this.min + " mmol/L. ";

          if (this.val > this.max)
            this.errors +=
              "Ketone level must be no more than " + this.max + " mmol/L. ";
        }

        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    weight: {
      val: null,
      label: "Weight",
      form: 2,
      info: "Weight is used to calculate fluid volumes for boluses, deficit replacement and maintenance. It is stored by the DKA Calculator for audit purposes.",
      min: 2,
      max: 150,
      step: 0.1,
      limit: {
        lower: function () {
          return config.client.weightLimits[data.value.inputs.patientSex.val].lower[data.value.inputs.patientDOB.ageMonths()]
        },
        upper: function () {
          let upper = config.client.weightLimits[data.value.inputs.patientSex.val].upper[data.value.inputs.patientDOB.ageMonths()]
          if (upper>config.client.weightLimits.max) upper = config.client.weightLimits.max;
          return upper
        },
        exceeded: false,
        override: false,
        overrideConfirm: false,
        overrideLabel: "Override weight limit"
      },
      isValid: function () {
        this.errors = "";
        if (!this.val) {
          this.errors += "Weight must be provided. ";
          return false
        }

        this.val = Number.parseFloat(this.val).toFixed(1);

        if (this.val < this.min) this.errors += "Weight must be at least " + this.min + " kg. ";
        if (this.val > this.max) this.errors += "Weight must be no more than " + this.max + " kg. ";
        if (this.errors) return false;

        if ((this.val < this.limit.lower() || this.val > this.limit.upper())) {
          if (!this.limit.override) this.errors += "Weight must be within 2 standard deviations of the mean for age (upper limit " + config.client.weightLimits.max + "kg) (range " + this.limit.lower() + "kg to " + this.limit.upper() + "kg)."
          this.limit.exceeded = true
        } else {
          this.limit.exceeded = false
          this.limit.override = false
        }
        if (this.errors) return false;
        return true;
      },
      errors: "x",
    },
    shockPresent: {
      val: "",
      label: "Is the patient clinically shocked?",
      form: 2,
      info: "Clinical shock status is stored by the DKA Calculator for audit purposes.",
      isValid: function () {
        this.errors = "";
        if (!this.val)
          this.errors += "Clinical shock status must be selected. ";
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    insulinRate: {
      val: "",
      label: "What starting rate of insulin is required?",
      form: 2,
      info: "Insulin starting rate is stored by the DKA Calculator for audit purposes.",
      isValid: function () {
        this.errors = "";
        if (!this.val)
          this.errors += "Insulin starting rate must be selected. ";
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    preExistingDiabetes: {
      val: "",
      label:
        "Was the patient known to have diabetes prior to the current episode of DKA?",
      form: 2,
      info: "If the patient has pre-existing diabetes is stored by the DKA Calculator for audit purposes.",
      isValid: function () {
        this.errors = "";
        if (!this.val)
          this.errors += "Pre-existing diabetes status must be selected. ";
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    episodeType: {
      val: "",
      label: "What is this protocol being used for?",
      form: 3,
      info: "Episode type is stored by the DKA Calculator for audit purposes.",
      isValid: function () {
        this.errors = "";
        if (!this.val) this.errors += "Episode type must be selected. ";
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    region: {
      val: "",
      label: "Please select your region",
      form: 3,
      info: "Region is stored by the DKA Calculator for audit purposes.",
      isValid: function () {
        this.errors = "";
        if (!this.val) {
          this.errors += "Region must be selected. ";
        } else {
          for (let region of config.client.regions) {
            if (region.name == this.val)
              data.value.inputs.centre.options = region.centres;
          }
        }
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    centre: {
      val: "",
      label: "Please select the treating centre",
      options: [],
      form: 3,
      info: "Treating centre is stored by the DKA Calculator for audit purposes.",
      isValid: function () {
        this.errors = "";
        if (!this.val) this.errors += "Treating centre must be selected. ";
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    ethnicGroup: {
      val: "",
      label: "Please select patient ethnic group",
      form: 3,
      info: "Patient ethnic group is stored by the DKA Calculator for audit purposes.",
      isValid: function () {
        this.errors = "";
        if (!this.val) this.errors += "Patient ethnic group must be selected. ";
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
    preventableFactors: {
      val: [],
      label:
        "Were there any preventable factors which may have contributed to this episode of DKA?",
      options: [
        "Missed diagnosis in primary care",
        "Missed diagnosis in hospital",
        "Failure to refer for same day treatment",
        "Delay in seeking treatment by patient/family",
        "Pump failure",
        "Sensor/CGMS failure",
        "Failure of patient/family to administer insulin",
        "Failure of patient/family to check blood ketones",
      ],
      form: 3,
      info: "Preventable factors are stored by the DKA Calculator for audit purposes.",
      isValid: function () {
        this.errors = "";
        if (!this.val.length)
          this.errors +=
            "Preventable factors must be selected, or choose 'No preventable factors'. ";
        if (this.errors) return false;
        return true;
      },
      errors: "",
    },
  },
  calculations: {},
  auditID: '',
});
