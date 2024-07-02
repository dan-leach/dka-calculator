<script setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { data } from "../assets/data.js";
import { config } from "../assets/config.js";
import Swal from "sweetalert2";
import router from "../router";
import { api } from "@/assets/api.js";

const generateSteps = ref({
  transmit: {
    text: "Transmitting data to DKA Calculator",
    complete: false,
    fail: "",
    current: false,
  },
  calculate: {
    text: "Calculating protocol variables",
    complete: false,
    fail: "",
    current: false,
  },
  audit: {
    text: "Logging audit data",
    complete: false,
    fail: "",
    current: false,
  },
  build: {
    text: "Generating individualised care pathway",
    complete: false,
    fail: "",
    current: false,
  },
  download: {
    text: "Starting PDF download",
    complete: false,
    fail: "",
    current: false,
  },
});

const generate = {
  start: async function () {
    for (let step in generateSteps.value) {
      generateSteps.value[step].fail = "";
      generateSteps.value[step].complete = false;
      generateSteps.value[step].current = false;
    }

    //generate payload to send to server
    let payload = {};
    generateSteps.value.transmit.current = true;
    try {
      payload = await this.buildPayload();
      generateSteps.value.transmit.current = false;
      generateSteps.value.transmit.complete = true;
    } catch (error) {
      generateSteps.value.transmit.current = false;
      generateSteps.value.transmit.fail = error;
      console.error(error);
      return;
    }

    //send the payload to server and receive calculations and auditID
    generateSteps.value.calculate.current = true;
    try {
      const res = await api("fetchCalculations", payload);
      data.value.auditID = res.auditID;
      data.value.calculations = res.calculations;
      generateSteps.value.calculate.current = false;
      generateSteps.value.calculate.complete = true;
      generateSteps.value.audit.complete = true;
    } catch (error) {
      generateSteps.value.calculate.current = false;
      generateSteps.value.calculate.fail = error;
      console.error(error);
      return;
    }

    //build and download care pathway
    generateSteps.value.build.current = true;
    try {
      let myWorker = this.startWebWorker();
      myWorker.onmessage = function (res) {
        //once response received from webWorker triggers download of pdf
        if (res.data.stack) {
          //if res.data.stack is defined then it's an error being returned by web worker so pass res.data to errHandler
          generateSteps.value.build.current = false;
          generateSteps.value.build.fail = res.data;
          console.error(res.data);
          return;
        } else {
          //otherwise use the returned blob to create the download
          generateSteps.value.build.complete = true;
          generateSteps.value.build.current = false;
          generateSteps.value.download.current = true;
          try {
            generate.handleWorkerResponse(res);
          } catch (error) {
            generateSteps.value.download.current = false;
            generateSteps.value.download.fail = res.error;
            console.error(error);
            return;
          }
        }
      };
    } catch (error) {
      generateSteps.value.build.current = false;
      generateSteps.value.build.fail = res.data;
      console.error(error);
      return;
    }
  },
  buildPayload: async function () {
    let payload = {};
    for (let input in data.value.inputs) {
      payload[input] = data.value.inputs[input].val;
    }
    payload.protocolStartDatetime = new Date(payload.protocolStartDatetime);
    payload.pH = parseFloat(payload.pH);
    payload.bicarbonate = payload.bicarbonate
      ? parseFloat(payload.bicarbonate)
      : null;
    payload.glucose = payload.glucose ? parseFloat(payload.glucose) : null;
    payload.ketones = payload.ketones ? parseFloat(payload.ketones) : null;
    payload.weight = parseFloat(payload.weight);
    payload.shockPresent = payload.shockPresent == "true" ? true : false;
    payload.insulinRate = parseFloat(payload.insulinRate);
    payload.preExistingDiabetes =
      payload.preExistingDiabetes == "true" ? true : false;
    if (data.value.inputs.patientNHS.val && data.value.inputs.patientDOB.val)
      payload.patientHash = await this.patientHash();
    delete payload.patientName;
    delete payload.patientHospNum;
    delete payload.patientNHS;
    delete payload.patientDOB;
    delete payload.other;

    payload.patientAge = data.value.inputs.patientDOB.patientAge.val;
    payload.weightLimitOverride = data.value.inputs.weight.limit.override;
    payload.appVersion = config.version;
    payload.clientDatetime = new Date();
    payload.clientUseragent = navigator.userAgent;
    return payload;
  },
  patientHash: async function () {
    return Array.from(
      new Uint8Array(
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(
            data.value.inputs.patientNHS.val + data.value.inputs.patientDOB.val
          )
        )
      ),
      (byte) => byte.toString(16).padStart(2, "0")
    ).join("");
  },
  startWebWorker: function () {
    //launches the web worker that will generate the PDF blob
    console.log("main: starting webWorker.js...");
    const myWorker = new Worker(
      new URL("@/assets/webWorker.js", import.meta.url),
      { type: "module" }
    ); //start instance of webWorkerPDF.js
    myWorker.postMessage(
      JSON.parse(
        JSON.stringify({
          patientName: data.value.inputs.patientName.val,
          patientDOB: data.value.inputs.patientDOB.val,
          patientNHS: data.value.inputs.patientNHS.val,
          patientHospNum: data.value.inputs.patientHospNum.val,
          weight: data.value.inputs.weight.val,
          override: data.value.inputs.weight.limit.override,
          pH: data.value.inputs.pH.val,
          bicarbonate: data.value.inputs.bicarbonate.val,
          glucose: data.value.inputs.glucose.val,
          ketones: data.value.inputs.ketones.val,
          shockPresent: data.value.inputs.shockPresent.val,
          preExistingDiabetes: data.value.inputs.preExistingDiabetes.val,
          insulinDeliveryMethod: data.value.inputs.insulinDeliveryMethod.val,
          patientSex: data.value.inputs.patientSex.val,
          insulinRate: data.value.inputs.insulinRate.val,
          protocolStartDatetime: data.value.inputs.protocolStartDatetime.val,
          calculations: data.value.calculations,
          auditID: data.value.auditID,
        })
      )
    );
    console.log("main: request sent to webWorker.js...");
    return myWorker;
  },
  handleWorkerResponse: function (res) {
    console.log("main: response received from webWorker.js...");
    // Automatically start file download
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    anchor.href = window.URL.createObjectURL(res.data.pdfBlob);
    anchor.download =
      "DKA Protocol for " + data.value.inputs.patientName.val + ".pdf";
    anchor.click();
    console.log("main: pdf download triggered...");
    this.success();
  },
  success: function () {
    //show the success modal
    generateSteps.value.download.complete = true;
    generateSteps.value.download.current = false;
  },
};

let showWorkingBtnText = ref("Show working");

onMounted(() => {
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
    generate.start();

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
                    <span class="text-muted m-0">Limit*</span>
                    <span v-html="data.calculations.bolusVolume.limit"></span>
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
                    <span class="text-muted m-0">Limit*</span>
                    <span
                      v-html="data.calculations.deficit.volume.limit"
                    ></span>
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
                    {{ data.calculations.deficit.rate.val.toFixed(1) }}mL
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
                    <span class="text-muted m-0">Limit*</span>
                    <span
                      v-html="data.calculations.maintenance.volume.limit"
                    ></span>
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
                    {{ data.calculations.maintenance.rate.val.toFixed(1) }}mL
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
                    {{ data.calculations.startingFluidRate.val.toFixed(1) }}mL
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
                    <span class="text-muted m-0">Limit*</span>
                    <span v-html="data.calculations.insulinRate.limit"></span>
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
              </div>
            </div>
            *limits set based on weight of 75kg<br />
            Note: Insulin should NOT be started immediately. Refer to the BSPED
            Paediatric DKA care pathway for how to use these calculated values.
          </div>
        </div>
      </span>
      <div v-if="step.fail">
        <p class="text-danger ms-2">{{ step.fail }}</p>
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
