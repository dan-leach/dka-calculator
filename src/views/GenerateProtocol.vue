<script setup>
import { ref, onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router";
import { api } from "@/assets/api.js";
import { inject } from "vue";
const config = inject("config");
/**
 * Steps of the generation process.
 * @type {Object<string, Step>}
 */
const generateSteps = ref({
  /**
   * @typedef {Object} Step
   * @property {string} text - Description of the step.
   * @property {boolean} complete - Indicates if the step is complete.
   * @property {string} fail - Error message if the step fails.
   * @property {boolean} current - Indicates if the step is currently being executed.
   */
  transmit: {
    //Generate the payload
    text: "Transmitting data to DKA Calculator",
    complete: false,
    fail: "",
    current: false,
  },
  calculate: {
    //await the response from the server
    text: "Calculating protocol variables",
    complete: false,
    fail: "",
    current: false,
  },
  audit: {
    //is completed at the same time as the calculate step
    text: "Logging audit data",
    complete: false,
    fail: "",
    current: false,
  },
  build: {
    //fetch the docDef definition
    text: "Generating individualised care pathway",
    complete: false,
    fail: "",
    current: false,
  },
  download: {
    //return the pdfBlob and trigger download
    text: "Starting PDF download",
    complete: false,
    fail: "",
    current: false,
  },
});

const generate = {
  /**
   * Performs the generation process by executing each step in sequence.
   * Handles errors and updates the status of each step.
   */
  start: async function () {
    for (let step in generateSteps.value) {
      generateSteps.value[step].fail = "";
      generateSteps.value[step].complete = false;
      generateSteps.value[step].current = false;
    }

    // Generate payload to send to server
    let payload = {};
    if (
      !(await generate.executeStep("transmit", generate.buildPayload, payload))
    )
      return;

    // Send the payload to server and receive calculations and auditID
    try {
      generateSteps.value.calculate.current = true;
      const res = await api("calculate", payload);
      data.value.auditID = res.auditID;
      data.value.calculations = res.calculations;
    } catch (error) {
      console.log(error);
      generateSteps.value.calculate.fail = error;
      generateSteps.value.calculate.current = false;
      return;
    }
    if (!(await generate.executeStep("calculate"))) return;
    generateSteps.value.audit.complete = true;

    // Build and download care pathway
    if (!(await generate.executeStep("build", generate.startWebWorker))) return;
    return true;
  },

  /**
   * Executes a step in the generation process.
   * @param {string} step - The step name.
   * @param {Function} [action] - The action to execute.
   * @param {...any} [params] - Parameters for the action.
   * @returns {boolean} - Returns true if the step is successful, false otherwise.
   */
  executeStep: async function (step, action, ...params) {
    generateSteps.value[step].current = true;
    try {
      if (action) {
        await action(...params);
      }
      generateSteps.value[step].complete = true;
    } catch (error) {
      generateSteps.value[step].fail = [{ msg: error.toString() }];
      console.error(error);
      return false;
    } finally {
      generateSteps.value[step].current = false;
    }
    return true;
  },

  /**
   * Builds the payload to send to the server.
   * @returns {Object} Payload containing input values.
   */
  buildPayload: async function (payload) {
    for (let input in data.value.inputs) {
      payload[input] = data.value.inputs[input].val;
    }

    payload.protocolStartDatetime = new Date(payload.protocolStartDatetime);
    payload.pH = parseFloat(payload.pH);
    payload.glucose = payload.glucose ? parseFloat(payload.glucose) : undefined;
    payload.bicarbonate = payload.bicarbonate
      ? parseFloat(payload.bicarbonate)
      : undefined;
    payload.ketones = payload.ketones ? parseFloat(payload.ketones) : undefined;
    payload.weight = parseFloat(payload.weight);
    payload.shockPresent = payload.shockPresent == "true";
    payload.insulinRate = parseFloat(payload.insulinRate);
    payload.preExistingDiabetes = payload.preExistingDiabetes == "true";

    if (data.value.inputs.patientNHS.val && data.value.inputs.patientDOB.val) {
      payload.patientHash = await generate.patientHash();
    }
    if (!payload.patientPostcode) delete payload.patientPostcode;

    const excludedFields = [
      "patientName",
      "patientHospNum",
      "patientNHS",
      "patientDOB",
      "other",
    ];
    for (const field of excludedFields) {
      delete payload[field];
    }

    payload.patientAge = data.value.inputs.patientDOB.patientAge.val;
    payload.weightLimitOverride = data.value.inputs.weight.limit.override;
    payload.use2SD = data.value.inputs.weight.limit.use2SD;
    payload.appVersion = {
      client: config.value.client.version,
      api: config.value.api.version,
      icp: config.value.organisations.bsped.icpVersion,
    };
    payload.clientDatetime = new Date();
    payload.clientUseragent = navigator.userAgent;

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

  /**
   * Starts the web worker to generate the PDF blob.
   * @returns {Promise<void>} A promise that resolves when the worker responds.
   */
  startWebWorker: async function () {
    console.log("main: starting webWorker.js...");
    try {
      const myWorker = new Worker(
        new URL("@/assets/webWorker.js", import.meta.url),
        { type: "module" }
      );

      // Wait for the worker to signal it's ready
      await new Promise((resolve, reject) => {
        myWorker.onmessage = (res) => {
          if (res.data.type === "ready") {
            console.log("main: webWorker.js is ready.");
            resolve();
          } else {
            reject(
              new Error("Unexpected message from worker during initialization.")
            );
          }
        };

        myWorker.onerror = (error) => {
          console.error(
            "main: worker encountered an error during initialization:",
            error
          );
          reject(
            `Error encountered while initialising thread to generate protocol PDF: ${error.message}`
          );
        };
      });

      //prepare the data to send to the worker
      const workerData = JSON.parse(
        JSON.stringify(generate.prepareWorkerData())
      );

      //send the prepared data to the worker and await a response
      const response = await new Promise((resolve, reject) => {
        myWorker.onmessage = (res) => {
          console.log("main: response received from webWorker.js:", res);
          if (res.data.stack) {
            reject(
              `Error encountered by thread generating protocol PDF: ${res.data.toString()}`
            );
          } else if (res.data.complete) {
            //pdfBlob has been returned so trigger the download
            resolve(res);
          } else if (res.data.docDef) {
            //docDef definition has been generated, now pdfBlob being generated
            generateSteps.value.build.complete = true;
            generateSteps.value.build.current = false;
            generateSteps.value.download.current = true;
          } else {
            reject(
              `Unexpected message event from webWorker: ${res.data.toString()}`
            );
          }
        };

        myWorker.onerror = (error) => {
          console.error("main: worker encountered an error:", error);
          reject(
            `Error encountered by thread generating protocol PDF: ${error.message}`
          );
        };

        myWorker.postMessage(workerData);
        console.log("main: request sent to webWorker.js...");
      });

      //trigger the download of the pdf
      generate.handleWorkerResponse(response);
    } catch (error) {
      console.error("main: failed to start webWorker.js:", error);
      throw error;
    }
  },

  /**
   * Prepares the data to be sent to the web worker.
   * @returns {Object} The data to be sent.
   */
  prepareWorkerData: function () {
    const inputs = data.value.inputs;
    return {
      patientName: inputs.patientName.val,
      patientDOB: inputs.patientDOB.val,
      patientNHS: inputs.patientNHS.val,
      patientHospNum: inputs.patientHospNum.val,
      weight: inputs.weight.val,
      override: inputs.weight.limit.override,
      pH: inputs.pH.val,
      bicarbonate: inputs.bicarbonate.val,
      glucose: inputs.glucose.val,
      ketones: inputs.ketones.val,
      shockPresent: inputs.shockPresent.val,
      preExistingDiabetes: inputs.preExistingDiabetes.val,
      insulinDeliveryMethod: inputs.insulinDeliveryMethod.val,
      preventableFactors: inputs.preventableFactors.val,
      patientSex: inputs.patientSex.val,
      insulinRate: inputs.insulinRate.val,
      protocolStartDatetime: inputs.protocolStartDatetime.val,
      calculations: data.value.calculations,
      auditID: data.value.auditID,
      config: config.value,
    };
  },

  /**
   * Handles the response from the web worker, triggering the PDF download.
   * @param {MessageEvent} res - The message event from the web worker.
   */
  handleWorkerResponse: function (res) {
    console.log("main: response received from webWorker.js...");
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    anchor.href = window.URL.createObjectURL(res.data.pdfBlob);
    anchor.download = `DKA Protocol for ${data.value.inputs.patientName.val}.pdf`;
    anchor.click();
    console.log("main: pdf download triggered...");
    generateSteps.value.download.complete = true;
    generateSteps.value.download.current = false;
  },
};

// Reactive variable to control button text
let showWorkingBtnText = ref("Show working");

/**
 * Lifecycle hook that runs when the component is mounted.
 * Checks the validity of previous form steps and redirects if necessary.
 * Scrolls to the top of the page.
 * Starts the protocol generation process
 */
onMounted(() => {
  // Validate previous form steps and redirect if necessary
  if (!data.value.form.isValid(0)) {
    router.push("/form-disclaimer");
  } else if (!data.value.form.isValid(1)) {
    router.push("/form-patient-details");
  } else if (!data.value.form.isValid(2)) {
    router.push("/form-clinical-details");
  } else if (
    data.value.inputs.weight.limit.override &&
    !data.value.inputs.weight.limit.overrideConfirm
  ) {
    router.push("/form-override-confirm");
  } else if (!data.value.form.isValid(3)) {
    router.push("/form-audit-details");
  } else {
    // Scroll to top
    window.scrollTo(0, 0);
    // Start the generation process
    generate.start();

    // Handle show/hide working button text
    let showWorkingCollapse = document.getElementById("showWorking");
    showWorkingCollapse.addEventListener(
      "hidden.bs.collapse",
      () => (showWorkingBtnText.value = "Show working")
    );
    showWorkingCollapse.addEventListener(
      "shown.bs.collapse",
      () => (showWorkingBtnText.value = "Hide working")
    );
  }
});
</script>

<template>
  <div class="container my-4 needs-validation">
    <h2 class="display-3">Generating care pathway</h2>
    <div v-for="(step, index) in generateSteps" class="mb-3">
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
      <span v-if="step.fail"
        ><font-awesome-icon :icon="['fas', 'xmark']" style="color: red"
      /></span>
      <span v-if="index == 'calculate'">
        <!--show working-->
        <button
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#showWorking"
          class="btn btn-sm btn-primary mx-2"
          :disabled="!step.complete"
        >
          {{ showWorkingBtnText }}
        </button>

        <div class="collapse my-2" id="showWorking">
          <div v-if="step.complete">
            <!--bolus volume-->
            <div class="card mb-4">
              <div class="card-header">Bolus volumes</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span v-html="data.calculations.bolusVolume.formula"></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Limit</span>
                    <span v-html="data.calculations.bolusVolume.limit"></span>
                    <small>Based on weight of 75kg</small>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span v-html="data.calculations.bolusVolume.working"></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{ data.calculations.bolusVolume.val.toFixed(0) }}mL
                  </div>
                </div>
              </div>
            </div>
            <!--severity-->
            <div class="card mb-4">
              <div class="card-header">Severity</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span v-html="data.calculations.severity.formula"></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span v-html="data.calculations.severity.working"></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{ data.calculations.severity.val }}
                  </div>
                </div>
              </div>
            </div>
            <!--deficit percentage-->
            <div class="card mb-4">
              <div class="card-header">Deficit percentage</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span
                      v-html="data.calculations.deficit.percentage.formula"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span
                      v-html="data.calculations.deficit.percentage.working"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{ data.calculations.deficit.percentage.val }}%
                  </div>
                </div>
              </div>
            </div>
            <!--deficit volume-->
            <div class="card mb-4">
              <div class="card-header">Deficit volume</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span
                      v-html="data.calculations.deficit.volume.formula"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Limit</span>
                    <span
                      v-html="data.calculations.deficit.volume.limit"
                    ></span>
                    <small>Based on weight of 75kg</small>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span
                      v-html="data.calculations.deficit.volume.working"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{ data.calculations.deficit.volume.val.toFixed(0) }}mL
                  </div>
                </div>
              </div>
            </div>
            <!--deficit volume less bolus-->
            <div class="card mb-4">
              <div class="card-header">Deficit volume less bolus</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span
                      v-html="data.calculations.deficit.volumeLessBolus.formula"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span
                      v-html="data.calculations.deficit.volumeLessBolus.working"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{
                      data.calculations.deficit.volumeLessBolus.val.toFixed(0)
                    }}mL
                  </div>
                </div>
              </div>
            </div>
            <!--deficit rate-->
            <div class="card mb-4">
              <div class="card-header">Deficit replacement rate</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span
                      v-html="data.calculations.deficit.rate.formula"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span
                      v-html="data.calculations.deficit.rate.working"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{ data.calculations.deficit.rate.val.toFixed(1) }}mL/hour
                  </div>
                </div>
              </div>
            </div>
            <!--maintenance volume-->
            <div class="card mb-4">
              <div class="card-header">Daily maintenance volume</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span
                      v-html="data.calculations.maintenance.volume.formula"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Limit</span>
                    <span
                      v-html="data.calculations.maintenance.volume.limit"
                    ></span>
                    <small>Based on weight of 75kg</small>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span
                      v-html="data.calculations.maintenance.volume.working"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{ data.calculations.maintenance.volume.val.toFixed(0) }}mL
                  </div>
                </div>
              </div>
            </div>
            <!--maintenance rate-->
            <div class="card mb-4">
              <div class="card-header">Daily maintenance rate</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span
                      v-html="data.calculations.maintenance.rate.formula"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span
                      v-html="data.calculations.maintenance.rate.working"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{
                      data.calculations.maintenance.rate.val.toFixed(1)
                    }}mL/hour
                  </div>
                </div>
              </div>
            </div>
            <!--starting fluid rate-->
            <div class="card mb-4">
              <div class="card-header">Starting fluid rate</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span
                      v-html="data.calculations.startingFluidRate.formula"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span
                      v-html="data.calculations.startingFluidRate.working"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{
                      data.calculations.startingFluidRate.val.toFixed(1)
                    }}mL/hour
                  </div>
                </div>
              </div>
            </div>
            <!--insulin rate-->
            <div class="card mb-4">
              <div class="card-header">Insulin rate</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span v-html="data.calculations.insulinRate.formula"></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Limit</span>
                    <span v-html="data.calculations.insulinRate.limit"></span>
                    <small>Based on weight of 75kg</small>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span v-html="data.calculations.insulinRate.working"></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{ data.calculations.insulinRate.val.toFixed(2) }}
                    Units/hour
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card border-warning p-2">
                    Note: Insulin should NOT be started immediately. Wait 1-2
                    hours after starting IV fluid therapy.
                  </div>
                </div>
              </div>
            </div>
            <!--glucose bolus volume-->
            <div class="card mb-4">
              <div class="card-header">Glucose bolus volume</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span
                      v-html="data.calculations.glucoseBolusVolume.formula"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Limit</span>
                    <span
                      v-html="data.calculations.glucoseBolusVolume.limit"
                    ></span>
                    <small>Based on weight of 75kg</small>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span
                      v-html="data.calculations.glucoseBolusVolume.working"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{ data.calculations.glucoseBolusVolume.val.toFixed(0) }}mL
                  </div>
                </div>
              </div>
            </div>
            <!--hhs bolus volume-->
            <div class="card mb-4">
              <div class="card-header">HHS bolus volume</div>
              <div class="card-body">
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Formula</span>
                    <span
                      v-html="data.calculations.hhsBolusVolume.formula"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Limit</span>
                    <span
                      v-html="data.calculations.hhsBolusVolume.limit"
                    ></span>
                    <small>Based on weight of 75kg</small>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Working</span>
                    <span
                      v-html="data.calculations.hhsBolusVolume.working"
                    ></span>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="card p-2">
                    <span class="text-muted m-0">Output</span>
                    {{ data.calculations.hhsBolusVolume.val.toFixed(0) }}mL
                  </div>
                </div>
              </div>
            </div>
            <div class="card border-warning mb-3">
              <div class="card-body">
                <p class="card-text">
                  Note: Refer to the BSPED Paediatric DKA care pathway for how
                  to use these calculated values.
                </p>
              </div>
            </div>
          </div>
        </div>
      </span>
      <div v-if="step.fail">
        <span class="text-danger ms-2" v-for="error in step.fail">
          {{ error.msg }}<br /> </span
        ><br />
        <!--retry-->
        <button
          type="button"
          @click="generate.start"
          class="btn btn-primary mb-4"
        >
          Retry
        </button>
      </div>
    </div>
    <div v-if="generateSteps.download.complete">
      <!--retry-->
      <button
        type="button"
        @click="generate.start"
        class="btn btn-primary mb-2"
      >
        Regenerate care pathway
      </button>
    </div>
    <!--back-->
    <button
      type="button"
      @click="router.push('/form-audit-details')"
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
