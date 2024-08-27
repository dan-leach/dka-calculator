<script setup>
import { ref, onMounted } from "vue";
import { data } from "../assets/data.js";
import Swal from "sweetalert2";
import router from "../router";

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
  if (data.value.form.isValid(1)) {
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

/**
 * Lifecycle hook that runs when the component is mounted.
 * Checks the validity of previous form steps and redirects if necessary.
 * Scrolls to the top of the page.
 */
onMounted(() => {
  if (!data.value.form.isValid(0)) {
    router.push("/form-disclaimer");
  } else {
    setMinMaxPatientDOB();
    // Scroll to top
    window.scrollTo(0, 0);
  }
});
</script>

<template>
  <form id="form-patient-details" class="container my-4 needs-validation">
    <h2 class="display-3">Patient details</h2>
    <p class="mx-1">
      To generate a care pathway for your patient please complete the form
      below. For more information about how this data is used click the
      <font-awesome-icon :icon="['fas', 'circle-info']" /> icon by each field or
      refer to the
      <RouterLink to="/privacy-policy" target="_blank" class=""
        >privacy policy</RouterLink
      >.
    </p>
    <!--patientName-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="patientName"
            v-model="data.inputs.patientName.val"
            @change="data.inputs.patientName.isValid()"
            placeholder="x"
            :minlength="data.inputs.patientName.minLength"
            :maxlength="data.inputs.patientName.maxLength"
            required
            autocomplete="off"
          />
          <label for="patientName">{{ data.inputs.patientName.label }}</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#patientNameInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger mx-1"
        id="patientNameErrors"
      >
        {{ data.inputs.patientName.errors }}
      </div>
      <div class="collapse form-text mx-1" id="patientNameInfo">
        {{ data.inputs.patientName.info }}
      </div>
    </div>
    <!--patientDOB-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="date"
            class="form-control"
            id="patientDOB"
            v-model="data.inputs.patientDOB.val"
            @change="data.inputs.patientDOB.isValid()"
            placeholder="x"
            max=""
            min=""
            required
            autocomplete="off"
          />
          <label for="patientDOB">{{ data.inputs.patientDOB.label }}</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#patientDOBInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger mx-1"
        id="patientDOBErrors"
      >
        {{ data.inputs.patientDOB.errors }}
      </div>
      <div
        class="collapse form-text mx-1"
        id="patientDOBInfo"
        v-html="data.inputs.patientDOB.info"
      ></div>
    </div>
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
      <div class="form-check form-switch ms-1 my-1">
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
    <!--hospital number alternative-->
    <Transition>
      <div
        class="mb-4"
        id="patientHospNumCollapse"
        v-if="data.inputs.patientNHS.optOut.val"
      >
        <div class="input-group">
          <div class="form-floating">
            <input
              type="text"
              class="form-control"
              id="patientHospNum"
              v-model="data.inputs.patientHospNum.val"
              @change="data.inputs.patientHospNum.isValid()"
              placeholder="x"
              :minlength="data.inputs.patientHospNum.minLength"
              :maxlength="data.inputs.patientHospNum.maxLength"
              autocomplete="off"
              required
            />
            <label for="patientHospNum">{{
              data.inputs.patientHospNum.label
            }}</label>
          </div>
          <span
            class="input-group-text"
            data-bs-toggle="collapse"
            data-bs-target="#patientHospNumInfo"
            ><font-awesome-icon :icon="['fas', 'circle-info']"
          /></span>
        </div>
        <div
          v-if="showErrors"
          class="form-text text-danger mx-1"
          id="patientHospNum"
        >
          {{ data.inputs.patientHospNum.errors }}
        </div>
        <div
          class="collapse form-text mx-1"
          id="patientHospNumInfo"
          v-html="data.inputs.patientHospNum.info"
        ></div>
      </div>
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

    <div class="d-flex flex-row justify-content-evenly">
      <!--back-->
      <div class="text-center">
        <button
          type="button"
          @click="router.push('/form-disclaimer')"
          class="btn btn-lg btn-secondary"
        >
          Back
        </button>
      </div>
      <!--next-->
      <div class="text-center">
        <button
          type="button"
          @click="continueClick"
          class="btn btn-lg btn-primary"
        >
          Continue
        </button>
      </div>
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
</style>
