<script setup>
import { onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router";
import { api } from "@/assets/api.js";

/**
 * Function to handle the 'joeBloggs' button click event
 * Pre-fills the form for quick completion and sends the user to the start
 */
const joeBloggsClick = () => {
  // Pre-fill form data for testing purposes
  data.value.inputs.legalAgreement.val = true;
  data.value.inputs.patientName.val = "Joe Bloggs";
  data.value.inputs.patientDOB.val = "2010-01-01";
  data.value.inputs.patientSex.val = "male";
  data.value.inputs.patientNHS.val = "1234567890";
  data.value.inputs.patientPostcode.val = "BS419DL";
  data.value.inputs.protocolStartDatetime.val = "2024-07-02T19:10";
  data.value.inputs.pH.val = "7.00";
  data.value.inputs.weight.val = "40.0";
  data.value.inputs.shockPresent.val = "false";
  data.value.inputs.insulinRate.val = "0.05";
  data.value.inputs.preExistingDiabetes.val = "true";
  data.value.inputs.insulinDeliveryMethod.val = "pump";
  data.value.inputs.episodeType.val = "test";
  data.value.inputs.region.val = "test region";
  data.value.inputs.centre.val = "test centre";
  data.value.inputs.ethnicGroup.val = "test ethnic group";
  data.value.inputs.ethnicSubgroup.val = "test ethnic subgroup";
  data.value.inputs.preventableFactors.val = ["No"];
  router.push("/");
};

const apiTest = {
  /**
   * Starts the generation process by executing each step in sequence.
   * Handles errors and updates the status of each step.
   */
  click: async function () {
    // Generate payload to send to server
    let payload = {};
    payload = await this.buildPayload();
    const res = await api("fetchCalculations", payload);
  },

  /**
   * Builds the payload to send to the server.
   * @returns {Object} Payload containing input values.
   */
  buildPayload: async function () {
    let payload = {
      legalAgreement: true,
      patientSex: "male",
      patientPostcode: "BS419DL",
      protocolStartDatetime: "2024-07-27T14:32:00.000Z",
      pH: 6.5,
      bicarbonate: 5,
      ketones: 1,
      weight: 40,
      shockPresent: false,
      insulinRate: 0.1,
      preExistingDiabetes: true,
      insulinDeliveryMethod: "pump",
      episodeType: "test",
      region: "test region",
      centre: "test centre",
      ethnicGroup: "test ethnic group",
      ethnicSubgroup: "test ethnic subgroup",
      preventableFactors: ["No"],
      patientHash:
        "7c7b77411dd4e623ce9a51dfc40db461fc0f1d10f6f3e03a21bf04ea1a17d2c3",
      patientAge: 14,
      weightLimitOverride: false,
      appVersion: "2.0 (Under development)",
      clientDatetime: "2024-07-27T14:32:51.016Z",
      clientUseragent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
    };

    return payload;
  },
};

/**
 * Lifecycle hook that runs when the component is mounted.
 * Ensures the page is scrolled to the top.
 */
onMounted(() => {
  // Scroll to the top of the page
  window.scrollTo(0, 0);
});
</script>

<template>
  <form id="form-disclaimer" class="container my-4 needs-validation">
    <h2 class="display-3">Testing Mode</h2>

    <!--joe bloggs-->
    <div class="text-center">
      <button
        type="button"
        @click="joeBloggsClick"
        class="btn btn-lg btn-primary"
      >
        Joe Bloggs
      </button>
    </div>
    <br />
    <!--API direct test-->
    <div class="text-center">
      <button
        type="button"
        @click="apiTest.click()"
        class="btn btn-lg btn-primary"
      >
        API direct test
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
}
</style>
