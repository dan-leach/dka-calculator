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
  if (data.value.form.isValid(2)) router.push("/form-audit-details");
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
  //if (!data.value.form.isValid(1)) router.push("/form-patient-details");
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
          <span class="input-group-text">mmol/L</span>
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
    <!--weight-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="number"
            class="form-control"
            id="weight"
            v-model="data.inputs.weight.val"
            @change="data.inputs.weight.isValid()"
            placeholder="x"
            :min="data.inputs.weight.min"
            :max="data.inputs.weight.max"
            :step="data.inputs.weight.step"
            autocomplete="off"
            required
          />
          <label for="weight">{{ data.inputs.weight.label }}</label>
        </div>
        <span class="input-group-text">kg</span>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#weightInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div
        v-if="showErrors || data.inputs.weight.limit.exceeded"
        class="form-text text-danger mx-1"
        id="weightErrors"
      >
        {{ data.inputs.weight.errors }}
      </div>
      <div class="form-check form-switch ms-1 my-1" v-if="data.inputs.weight.limit.exceeded">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="data.inputs.weight.limit.override"
          @change="data.inputs.weight.isValid()"
          id="weightLimitOverride"
        />
        <label class="form-check-label" for="weightLimitOverride">{{
          data.inputs.weight.limit.overrideLabel
        }}</label>
      </div>
      <div
        class="collapse form-text mx-1"
        id="weightInfo"
        v-html="data.inputs.weight.info"
      ></div>
    </div>
    <!--shockPresent-->
    <div class="mb-4">
      <p class="text-center m-2">{{ data.inputs.shockPresent.label }}</p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="shockPresent"
            id="yes"
            value="true"
            v-model="data.inputs.shockPresent.val"
            @change="data.inputs.shockPresent.isValid()"
            autocomplete="off"
            required
          />
          <label class="btn btn-outline-secondary me-2" for="yes">Yes</label>

          <input
            type="radio"
            class="btn-check"
            name="shockPresent"
            id="no"
            value="false"
            v-model="data.inputs.shockPresent.val"
            @change="data.inputs.shockPresent.isValid()"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="no">No</label>
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            data-bs-toggle="collapse"
            data-bs-target="#shockPresentInfo"
            class="ms-2"
          />
        </div>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger text-center mx-1"
        id="shockPresentErrors"
      >
        {{ data.inputs.shockPresent.errors }}
      </div>
      <div class="collapse form-text text-center mx-1" id="shockPresentInfo">
        {{ data.inputs.shockPresent.info }}
      </div>
    </div>
    <!--insulinRate-->
    <div class="mb-4">
      <p class="text-center m-2">{{ data.inputs.insulinRate.label }}</p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="insulinRate"
            id="0.05"
            value="0.05"
            v-model="data.inputs.insulinRate.val"
            @change="data.inputs.insulinRate.isValid()"
            autocomplete="off"
            required
          />
          <label class="btn btn-outline-secondary text-nowrap me-2" for="0.05"
            >0.05 units/kg/hour<br />
            (Default)</label
          >

          <input
            type="radio"
            class="btn-check"
            name="insulinRate"
            id="0.1"
            value="0.1"
            v-model="data.inputs.insulinRate.val"
            @change="data.inputs.insulinRate.isValid()"
            autocomplete="off"
          />
          <label
            class="btn btn-outline-secondary text-nowrap insulin-rate-btn py-3"
            for="0.1"
            >0.1 units/kg/hour</label
          >
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            data-bs-toggle="collapse"
            data-bs-target="#insulinRateInfo"
            class="ms-2"
          />
        </div>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger text-center mx-1"
        id="insulinRateErrors"
      >
        {{ data.inputs.insulinRate.errors }}
      </div>
      <div class="collapse form-text text-center mx-1" id="insulinRateInfo">
        {{ data.inputs.insulinRate.info }}
      </div>
    </div>
    <!--preExistingDiabetes-->
    <div class="mb-4">
      <p class="text-center m-2">{{ data.inputs.preExistingDiabetes.label }}</p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="preExistingDiabetes"
            id="yes"
            value="true"
            v-model="data.inputs.preExistingDiabetes.val"
            @change="data.inputs.preExistingDiabetes.isValid()"
            autocomplete="off"
            required
          />
          <label class="btn btn-outline-secondary me-2" for="yes">Yes</label>

          <input
            type="radio"
            class="btn-check"
            name="preExistingDiabetes"
            id="no"
            value="false"
            v-model="data.inputs.preExistingDiabetes.val"
            @change="data.inputs.preExistingDiabetes.isValid()"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="no">No</label>
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            data-bs-toggle="collapse"
            data-bs-target="#preExistingDiabetesInfo"
            class="ms-2"
          />
        </div>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger text-center mx-1"
        id="preExistingDiabetesErrors"
      >
        {{ data.inputs.preExistingDiabetes.errors }}
      </div>
      <div
        class="collapse form-text text-center mx-1"
        id="preExistingDiabetesInfo"
      >
        {{ data.inputs.preExistingDiabetes.info }}
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
  background-color: white;
}
.flex-wrap {
  column-gap: 20px;
}
.insulin-rate-btn {
  height: 62px;
}
</style>
