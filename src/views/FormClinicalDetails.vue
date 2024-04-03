<script setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { data } from "../assets/data.js";
import Swal from "sweetalert2";
import router from "../router";

let showErrors = ref(false);

const continueClick = () => {
  showErrors.value = true;
  document
    .getElementById("form-clinical-details")
    .classList.add("was-validated");
  if (data.value.form.isValid(2)) router.push("/form-part-3");
};

const setProtocolStartDatetime = () => {
  const today = new Date();
  data.value.inputs.protocolStartDatetime.val = today
    .toISOString()
    .substring(0, 16);
};

const setMinMaxProtocolStartDatetime = () => {
  document.getElementById("protocolStartDatetime").max =
    data.value.inputs.protocolStartDatetime
      .maxDate()
      .toISOString()
      .substring(0, 16);
  document.getElementById("protocolStartDatetime").min =
    data.value.inputs.protocolStartDatetime
      .minDate()
      .toISOString()
      .substring(0, 16);
};

onMounted(() => {
  if (!data.value.form.isValid(1)) router.push("/form-patient-details");
  setProtocolStartDatetime();
  setMinMaxProtocolStartDatetime();
});
</script>

<template>
  <form id="form-clinical-details" class="container my-4 needs-validation">
    <h2 class="display-3">Clinical details</h2>
    <!--protocolStartDatetime-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="datetime-local"
            class="form-control"
            id="protocolStartDatetime"
            v-model="data.inputs.protocolStartDatetime.val"
            @change="data.inputs.protocolStartDatetime.isValid()"
            placeholder="x"
            min=""
            max=""
            required
            autocomplete="off"
          />
          <label for="protocolStartDatetime">{{
            data.inputs.protocolStartDatetime.label
          }}</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#protocolStartDatetimeInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger mx-1"
        id="protocolStartDatetimeErrors"
      >
        {{ data.inputs.protocolStartDatetime.errors }}
      </div>
      <div class="collapse form-text mx-1" id="protocolStartDatetimeInfo">
        {{ data.inputs.protocolStartDatetime.info }}
      </div>
    </div>
    <div class="d-flex flex-row flex-wrap">
      <!--pH-->
      <div class="mb-4 flex-grow-1">
        <div class="input-group">
          <div class="form-floating">
            <input
              type="number"
              class="form-control"
              id="pH"
              v-model="data.inputs.pH.val"
              @change="data.inputs.pH.isValid()"
              placeholder="x"
              :min="data.inputs.pH.min"
              :max="data.inputs.pH.max"
              :step="data.inputs.pH.step"
              autocomplete="off"
              required
            />
            <label for="pH">{{ data.inputs.pH.label }}</label>
          </div>
          <span
            class="input-group-text"
            data-bs-toggle="collapse"
            data-bs-target="#pHInfo"
            ><font-awesome-icon :icon="['fas', 'circle-info']"
          /></span>
        </div>
        <div v-if="showErrors" class="form-text text-danger mx-1" id="pHErrors">
          {{ data.inputs.pH.errors }}
        </div>
        <div
          class="collapse form-text mx-1"
          id="pHInfo"
          v-html="data.inputs.pH.info"
        ></div>
      </div>
      <!--bicarbonate-->
      <div class="mb-4 flex-grow-1">
        <div class="input-group">
          <div class="form-floating">
            <input
              type="number"
              class="form-control"
              id="bicarbonate"
              v-model="data.inputs.bicarbonate.val"
              @change="data.inputs.bicarbonate.isValid()"
              placeholder="x"
              :min="data.inputs.bicarbonate.min"
              :max="data.inputs.bicarbonate.max"
              :step="data.inputs.bicarbonate.step"
              autocomplete="off"
              required
            />
            <label for="bicarbonate">{{ data.inputs.bicarbonate.label }}</label>
          </div>
          <span
            class="input-group-text"
            data-bs-toggle="collapse"
            data-bs-target="#bicarbonateInfo"
            ><font-awesome-icon :icon="['fas', 'circle-info']"
          /></span>
        </div>
        <div
          v-if="showErrors"
          class="form-text text-danger mx-1"
          id="bicarbonateErrors"
        >
          {{ data.inputs.bicarbonate.errors }}
        </div>
        <div
          class="collapse form-text mx-1"
          id="bicarbonateInfo"
          v-html="data.inputs.bicarbonate.info"
        ></div>
      </div>
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
    <!--notes-->
    <div class="d-none">
      Clinical features:<br />
      Weight<br />
      Shock<br />
      Pre-existing diabetes<br />
      Insulin rate<br />
      <hr />
      Region<br />
      Centre<br />
      Training/real<br />
      Audit ID - patient(auto)<br />
      Audit ID - episode(auto)<br />
      IMD(auto)<br />
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
.flex-wrap {
  column-gap: 20px;
}
</style>
