<script setup>
import { onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router";

/**
 * Function to handle the 'Continue' button click event
 * Sets the weight limit override confirmation and navigates to the audit details form.
 */
const continueClick = () => {
  data.value.inputs.weight.limit.overrideConfirm = true;
  router.push("/form-audit-details");
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
    <div>
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

    <div class="d-flex flex-row justify-content-evenly">
      <!--back-->
      <div class="text-center">
        <button
          type="button"
          @click="router.push('/form-clinical-details')"
          class="btn btn-lg btn-secondary"
        >
          Go back and review
        </button>
      </div>
      <!--next-->
      <div class="text-center">
        <button
          type="button"
          @click="continueClick"
          class="btn btn-lg btn-danger"
        >
          Proceed with weight of {{ data.inputs.weight.val }}kg
        </button>
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
