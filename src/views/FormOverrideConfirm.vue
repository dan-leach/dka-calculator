<script setup>
import { onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router";
import Swal from "sweetalert2";
import { inject } from "vue";
const config = inject("config");

/**
 * Function to handle the 'Continue' button click event
 * Sets the weight limit override confirmation and navigates to the audit details form.
 */
const continueClick = () => {
  data.value.inputs.weight.limit.overrideConfirm = true;
  router.push("/form-audit-details");
};

/**
 * Function to handle the 'use +2SD' button click event
 * Sets the patient weight to 2SD above mean for age and returns the user to the clinical details page to highlight the change
 */
const use2SD = async () => {
  router.push("/form-clinical-details");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  data.value.inputs.weight.val = data.value.inputs.weight.limit.upper();
  data.value.inputs.weight.limit.overrideConfirm = false;
  data.value.inputs.weight.limit.override = false;
  data.value.inputs.weight.isValid();
  data.value.inputs.weight.limit.use2SD = true;
  Swal.fire({
    text: "Weight updated to use +2SD above the mean for age",
    icon: "success",
    toast: true,
    timer: 2000,
    showConfirmButton: false,
  });
};

/**
 * Lifecycle hook that runs when the component is mounted.
 * Checks the validity of previous form steps and redirects if necessary.
 * Scrolls to the top of the page.
 */
onMounted(() => {
  if (!data.value.form.isValid(0)) {
    router.push("/form-disclaimer");
  } else if (!data.value.form.isValid(1)) {
    router.push("/form-patient-details");
  } else if (!data.value.form.isValid(2)) {
    router.push("/form-clinical-details");
  }
  // Scroll to top
  window.scrollTo(0, 0);
});
</script>

<template>
  <form id="form-disclaimer" class="container my-4 needs-validation">
    <h2 class="display-3 text-danger">
      You are overriding the weight safety range
    </h2>
    <div v-if="data.inputs.weight.val > data.inputs.weight.limit.lower()">
      <p>
        You should only continue if you are sure {{ data.inputs.weight.val }}kg
        is the correct weight and you have considered using a maximum weight of
        the 98th centile weight for age as per the care pathway.
      </p>
      <p>
        You can proceed with a weight that is outside the expected range,
        however the calculator has upper limits that cannot be overriden. These
        are based on a maximum weight of 75kg as per the BSPED Guidelines. Any
        calculated values that exceed this will be capped as follows:
      </p>
      <ul>
        <li>
          Daily maintenance volume is capped at 2600mL (Holliday-Segar formula
          for 75kg)
        </li>
        <li>
          Deficit volume is capped at 7500mL for patients with severe DKA (10%
          dehydration for 75kg)
        </li>
        <li>
          Deficit volume is capped at 3750mL for patients with mild or moderate
          DKA (5% dehydration for 75kg)
        </li>
        <li>Bolus volumes are capped at 750mL (10mL/kg for 75kg)</li>
        <li>
          Insulin rate is capped at 7.5 Units/hour if insulin rate of 0.1
          Units/kg/hour is selected (0.1 Units/kg/hour for 75kg patient)
        </li>
        <li>
          Insulin rate is capped at 3.75 Units/hour if insulin rate of 0.05
          Units/kg/hour is selected (0.05 Units/kg/hour for 75kg patient)
        </li>
        <li>Glucose bolus is capped at 150mL (2mL/kg for 75kg patient)</li>
        <li>HHS bolus is capped at 1500mL (20mL/kg for 75kg patient)</li>
      </ul>
      <p>
        <strong
          >Calculations will be based on {{ data.inputs.weight.val }}kg and only
          capped if they exceed the values above.</strong
        ><br />
        Bear in mind that these caps could still allow significantly excessive
        values especially if your patient is much smaller than 75kg.
      </p>
    </div>
    <p v-else mx-4>
      The weight you have entered is less than 2 standard deviations below the
      mean for age.
    </p>
    <p>Proceed if you are sure {{ data.inputs.weight.val }}kg is correct.</p>

    <div class="d-flex flex-row justify-content-evenly flex-wrap">
      <!--back-->
      <div class="text-center mb-2">
        <button
          type="button"
          @click="router.push('/form-clinical-details')"
          class="btn btn-lg btn-secondary"
        >
          Go back and review
        </button>
      </div>
      <!--use +2SD-->
      <div
        class="text-center mx-2 mb-2"
        v-if="
          data.inputs.weight.limit.upper() != config.weightLimits.max &&
          data.inputs.weight.val > data.inputs.weight.limit.lower()
        "
      >
        <button type="button" @click="use2SD" class="btn btn-lg btn-primary">
          Use weight of {{ data.inputs.weight.limit.upper().toFixed(2) }}kg<sup
            >*</sup
          >
          instead
        </button>
        <br /><small>* plus 2 standard deviations above mean for age</small>
      </div>
      <!--proceed-->
      <div class="text-center mb-2">
        <button
          type="button"
          @click="continueClick"
          class="btn btn-lg btn-danger"
          v-html="
            data.inputs.weight.val >= config.weightLimits.max
              ? `Proceed with current weight<br /><small>(Calculations will be capped as above)</small>`
              : `Proceed with weight of ${data.inputs.weight.val}kg`
          "
        ></button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.container {
  max-width: 950px;
}
.btn-outline-secondary {
  width: 150px;
}
</style>
