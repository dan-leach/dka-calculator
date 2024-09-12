<script setup>
import { ref, onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router";
import { api } from "@/assets/api.js";
import { inject } from "vue";
const config = inject("config");

/**
 * Steps of the update process.
 * @type {Object<string, Step>}
 */
const updateSteps = ref({
  /**
   * @typedef {Object} Step
   * @property {string} text - Description of the step.
   * @property {boolean} complete - Indicates if the step is complete.
   * @property {string} fail - Error message if the step fails.
   * @property {boolean} current - Indicates if the step is currently being executed.
   */
  transmit: {
    text: "Transmitting data to DKA Calculator",
    complete: false,
    fail: "",
    current: false,
  },
  update: {
    text: "Updating audit data",
    complete: false,
    fail: "",
    current: false,
  },
});

const update = {
  /**
   * Performs the update process by executing each step in sequence.
   * Handles errors and updates the status of each step.
   */
  start: async function () {
    for (let step in updateSteps.value) {
      updateSteps.value[step].fail = "";
      updateSteps.value[step].complete = false;
      updateSteps.value[step].current = false;
    }

    // Generate payload to send to server
    let payload = {};
    if (!(await update.executeStep("transmit", update.buildPayload, payload)))
      return;

    // Send the payload to server and receive calculations and auditID
    try {
      updateSteps.value.update.current = true;
      await api("update", payload);
    } catch (error) {
      updateSteps.value.update.fail = error;
      updateSteps.value.update.current = false;
      return;
    }
    //wait 2 seconds from completion before marking complete so it is clear that a process has happened
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (!(await update.executeStep("update"))) return;

    return true;
  },

  /**
   * Executes a step in the update process.
   * @param {string} step - The step name.
   * @param {Function} [action] - The action to execute.
   * @param {...any} [params] - Parameters for the action.
   * @returns {boolean} - Returns true if the step is successful, false otherwise.
   */
  executeStep: async function (step, action, ...params) {
    updateSteps.value[step].current = true;
    try {
      if (action) {
        await action(...params);
      }
      updateSteps.value[step].complete = true;
    } catch (error) {
      updateSteps.value[step].fail = [{ msg: error.toString() }];
      console.error(error);
      return false;
    } finally {
      updateSteps.value[step].current = false;
    }
    return true;
  },

  /**
   * Builds the payload to send to the server.
   * @returns {Object} Payload containing input values.
   */
  buildPayload: async function (payload) {
    payload.auditID = data.value.inputs.auditID.val;
    payload.patientHash = await update.patientHash();
    payload.protocolEndDatetime = new Date(
      data.value.inputs.protocolEndDatetime.val
    );
    payload.preExistingDiabetes =
      data.value.inputs.preExistingDiabetes.val == "true";
    payload.preventableFactors = data.value.inputs.preventableFactors.val;
    payload.cerebralOedemaConcern =
      data.value.inputs.cerebralOedemaConcern.val == "true";
    if (payload.cerebralOedemaConcern) {
      payload.cerebralOedemaImaging =
        data.value.inputs.cerebralOedemaImaging.val;
      payload.cerebralOedemaTreatment =
        data.value.inputs.cerebralOedemaTreatment.val;
    }
    payload.clientUseragent = navigator.userAgent;
    payload.appVersion = {
      client: config.value.client.version,
      api: config.value.api.version,
    };

    return payload;
  },

  patientHash: async function () {
    const dataToHash = new TextEncoder().encode(
      data.value.inputs.patientNHS.val + data.value.inputs.patientDOB.val
    );
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataToHash);
    return Array.from(new Uint8Array(hashBuffer), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  },
};

/**
 * Lifecycle hook that runs when the component is mounted.
 * Checks the validity of previous form steps and redirects if necessary.
 * Scrolls to the top of the page.
 */
onMounted(() => {
  // Validate previous form step and redirect if necessary
  if (!data.value.form.isValid(4)) {
    router.push("/update");
  } else {
    // Scroll to top
    window.scrollTo(0, 0);
    update.start();
  }
});
</script>

<template>
  <div class="container my-4 needs-validation">
    <h2 class="display-3">Updating audit data</h2>
    <div v-for="(step, index) in updateSteps" class="mb-3">
      <span
        class="step-text"
        :class="
          step.complete || step.fail || step.current ? '' : 'text-black-50'
        "
        >{{ step.text }}&nbsp;&nbsp;</span
      >
      <span
        class="spinner-border spinner-border-sm align-middle"
        v-if="step.current"
      ></span>
      <span v-if="step.complete"
        ><font-awesome-icon :icon="['fas', 'check']" style="color: green"
      /></span>
      <div v-if="step.fail">
        <span
          ><font-awesome-icon :icon="['fas', 'xmark']" style="color: red"
        /></span>
        <span class="text-danger ms-2" v-for="error in step.fail">
          {{ error.msg }}<br /> </span
        ><br />
        <!--retry-->
        <button
          type="button"
          @click="update.start"
          class="btn btn-primary mb-4"
        >
          Retry
        </button>
      </div>
    </div>
    <!--back-->
    <button
      type="button"
      @click="router.push('/update')"
      class="btn btn-secondary"
    >
      Back to form
    </button>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
.btn-outline-secondary {
  width: 150px;
}
.step-text {
  font-size: larger;
}
</style>
