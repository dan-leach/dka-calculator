<script setup>
import { ref } from "vue";
import { data } from "../assets/data.js";
import Swal from "sweetalert2";
import router from "../router";
import { useFormGuard } from "../composables/useFormGuard.js";
import FormField from "../components/FormField.vue";

// Reactive variable to control error display.
let showErrors = ref(false);

/**
 * Function to handle the 'Continue' button click event.
 * Validates the patient details form and navigates to the clinical details form if valid.
 */
const continueClick = () => {
  showErrors.value = true;
  document
    .getElementById("form-patient-details")
    .classList.add("was-validated");
  if (data.value.form.isValid(3)) {
    router.push("/form-clinical-details");
  }
};

/**
 * Sets the minimum and maximum allowed dates for the patient date of birth input field.
 */
const setMinMaxPatientDOB = () => {
  const today = new Date();
  document.getElementById("patientDOB").max = today
    .toISOString()
    .substring(0, 10);
  document.getElementById("patientDOB").min = data.value.inputs.patientDOB
    .minDate()
    .toISOString()
    .substring(0, 10);
};

/**
 * Handles the opt-out click event for the NHS number or postcode inputs.
 * Displays an alert if not shown previously, and clears input value if opt-out confirmed.
 * @param {string} i - The input identifier.
 */
const optOutClick = (i) => {
  let input = data.value.inputs[i];
  if (input.optOut.msg.show) {
    Swal.fire({
      text: input.optOut.msg.text,
      confirmButtonColor: "#0d6efd",
    });
  }
  input.optOut.msg.show = false;
  if (input.optOut.val) {
    input.val = "";
  }
  if (!input.optOut.val && i === "patientNHS") {
    data.value.inputs.patientHospNum.val = "";
  }
};

useFormGuard(
  [
    { formIndex: 1, redirect: "/form-disclaimer" },
    { formIndex: 2, redirect: "/form-protocol-purpose" },
  ],
  () => {
    setMinMaxPatientDOB();
    window.scrollTo(0, 0);
  }
);
</script>

<template>
  <form id="form-patient-details" class="container my-4 needs-validation">
    <h2 class="display-3">Patient details</h2>
    <h3
      class="retrospective-indicator text-danger mx-1"
      v-if="data.retrospectiveEpisode"
    >
      Adding retrospective episode
    </h3>
    <p class="mx-1">
      <span v-if="!data.retrospectiveEpisode"
        >To generate a care pathway for your patient please complete the form
        below. </span
      >For more information about how this data is used click the
      <font-awesome-icon :icon="['fas', 'circle-info']" /> icon by each field or
      refer to the
      <RouterLink to="/privacy-policy" target="_blank" class=""
        >privacy policy</RouterLink
      >.
    </p>

    <!--patientName-->
    <FormField
      fieldId="patientName"
      :input="data.inputs.patientName"
      :showErrors="showErrors"
      type="text"
      :minlength="data.inputs.patientName.minLength"
      :maxlength="data.inputs.patientName.maxLength"
      required
    />

    <!--patientDOB-->
    <FormField
      fieldId="patientDOB"
      :input="data.inputs.patientDOB"
      :showErrors="showErrors"
      type="date"
      required
    />

    <!--patientSex-->
    <div class="mb-4">
      <p class="text-center m-2">
        {{ data.inputs.patientSex.label }}
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#patientSexInfo"
          class="ms-2"
        />
      </p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="patientSex"
            id="male"
            value="male"
            v-model="data.inputs.patientSex.val"
            @change="data.inputs.patientSex.isValid()"
            autocomplete="off"
            required
          />
          <label class="btn btn-outline-secondary me-2" for="male">Male</label>

          <input
            type="radio"
            class="btn-check"
            name="patientSex"
            id="female"
            value="female"
            v-model="data.inputs.patientSex.val"
            @change="data.inputs.patientSex.isValid()"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="female">Female</label>
        </div>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger text-center mx-1"
        id="patientSexErrors"
      >
        {{ data.inputs.patientSex.errors }}
      </div>
      <div class="collapse form-text text-center mx-1" id="patientSexInfo">
        {{ data.inputs.patientSex.info }}
      </div>
    </div>

    <!--patientNHS-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="number"
            class="form-control"
            id="patientNHS"
            v-model="data.inputs.patientNHS.val"
            @change="data.inputs.patientNHS.isValid()"
            placeholder="x"
            :min="data.inputs.patientNHS.min"
            :max="data.inputs.patientNHS.max"
            :disabled="data.inputs.patientNHS.optOut.val"
            autocomplete="off"
            required
          />
          <label for="patientNHS">{{ data.inputs.patientNHS.label }}</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#patientNHSInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div
        v-if="showErrors && !data.inputs.patientNHS.optOut.val"
        class="form-text text-danger mx-1"
        id="patientNHSErrors"
      >
        {{ data.inputs.patientNHS.errors }}
      </div>
      <div
        class="form-check form-switch ms-1 my-1"
        v-if="!data.retrospectiveEpisode"
      >
        <input
          class="form-check-input"
          type="checkbox"
          v-model="data.inputs.patientNHS.optOut.val"
          @change="optOutClick('patientNHS')"
          id="optOutNHS"
        />
        <label class="form-check-label" for="flexSwitchCheckDefault">{{
          data.inputs.patientNHS.optOut.label
        }}</label>
      </div>
      <div
        class="collapse form-text mx-1"
        id="patientNHSInfo"
        v-html="data.inputs.patientNHS.info"
        v-if="!data.inputs.patientNHS.optOut.val"
      ></div>
    </div>

    <!--patientHospNum (shown when NHS number opt-out is selected)-->
    <Transition>
      <FormField
        v-if="data.inputs.patientNHS.optOut.val"
        fieldId="patientHospNum"
        :input="data.inputs.patientHospNum"
        :showErrors="showErrors"
        type="text"
        :minlength="data.inputs.patientHospNum.minLength"
        :maxlength="data.inputs.patientHospNum.maxLength"
        required
        autocomplete="off"
      />
    </Transition>

    <!--patientPostcode-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="patientName"
            v-model="data.inputs.patientPostcode.val"
            @change="data.inputs.patientPostcode.isValid()"
            placeholder="x"
            :minlength="data.inputs.patientPostcode.minLength"
            :maxlength="data.inputs.patientPostcode.maxLength"
            :pattern="data.inputs.patientPostcode.pattern"
            required
            :disabled="data.inputs.patientPostcode.optOut.val"
            autocomplete="off"
          />
          <label for="patientPostcode">{{
            data.inputs.patientPostcode.label
          }}</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#patientPostcodeInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div class="form-check form-switch ms-1 my-1">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="data.inputs.patientPostcode.optOut.val"
          @change="optOutClick('patientPostcode')"
          id="optOutPostcode"
        />
        <label class="form-check-label" for="flexSwitchCheckDefault">{{
          data.inputs.patientPostcode.optOut.label
        }}</label>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger mx-1"
        id="patientPostcodeErrors"
      >
        {{ data.inputs.patientPostcode.errors }}
      </div>
      <div class="collapse form-text mx-1" id="patientPostcodeInfo">
        {{ data.inputs.patientPostcode.info }}
      </div>
    </div>

    <div class="nav-btn-row">
      <!--next — first in DOM so it sits on top when stacked-->
      <button
        type="button"
        @click="continueClick"
        class="btn btn-lg btn-primary"
      >
        Continue
      </button>
      <!--back — pulled left on desktop via .nav-back-->
      <button
        type="button"
        @click="router.push('/form-disclaimer')"
        class="btn btn-lg btn-secondary nav-back"
      >
        Back
      </button>
    </div>
  </form>
</template>

<style scoped>
.container {
  max-width: 750px;
}
.btn-outline-secondary {
  width: 150px;
  background-color: white;
}
.episode-type-btn {
  height: 62px;
}
.v-enter-active {
  transition: all 0.5s ease;
}
.v-enter-from {
  opacity: 0;
}
.retrospective-indicator {
  font-size: 1.5rem;
  font-weight: lighter;
}
</style>
