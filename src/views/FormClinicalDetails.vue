<script setup>
import { ref, onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router";

// Reactive variable to control error display.
const showErrors = ref(false);

/**
 * Handle continue button click event
 * Show validation errors and navigate based on form validity
 */
const continueClick = () => {
  showErrors.value = true;
  document
    .getElementById("form-clinical-details")
    .classList.add("was-validated");

  if (data.value.form.isValid(2)) {
    const nextRoute = data.value.inputs.weight.limit.override
      ? "/form-override-confirm"
      : "/form-audit-details";
    router.push(nextRoute);
  }
};

/**
 * Lifecycle hook that runs when the component is mounted.
 * Checks the validity of previous form steps and redirects if necessary.
 * Sets initial form state.
 * Scrolls to the top of the page.
 */
onMounted(() => {
  if (!data.value.form.isValid(0)) {
    router.push("/form-disclaimer");
  } else if (!data.value.form.isValid(1)) {
    router.push("/form-patient-details");
  } else {
    // Scroll to top
    window.scrollTo(0, 0);

    // Build date-related values and set input min/max attributes
    const { protocolStartDatetime } = data.value.inputs;
    protocolStartDatetime.todayString.build();
    protocolStartDatetime.val = protocolStartDatetime.todayString.val;
    protocolStartDatetime.minDate.build();
    protocolStartDatetime.minDateString.build();
    protocolStartDatetime.maxDate.build();
    protocolStartDatetime.maxDateString.build();

    const protocolInput = document.getElementById("protocolStartDatetime");
    protocolInput.min = protocolStartDatetime.minDateString.val;
    protocolInput.max = protocolStartDatetime.maxDateString.val;
  }
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
    <!--pH-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="number"
            class="form-control"
            id="pH"
            v-model="data.inputs.pH.val"
            @change="data.inputs.pH.isValid()"
            placeholder="x"
            :min="data.inputs.pH.min()"
            :max="data.inputs.pH.max()"
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
    <!--optional values-->
    <div class="card mb-4 bg-transparent">
      <div class="card-header d-flex flex-row flex-wrap">
        <span class="align-middle"
          >Optional values &nbsp;<font-awesome-icon
            :icon="['fas', 'circle-info']"
            data-bs-toggle="collapse"
            data-bs-target="#bicarbonateInfo"
        /></span>
      </div>
      <div class="card-body">
        <div class="d-flex flex-row flex-wrap">
          <!--bicarbonate-->
          <div class="mb-1 flex-grow-1">
            <div class="input-group">
              <div class="form-floating">
                <input
                  type="number"
                  class="form-control"
                  id="bicarbonate"
                  v-model="data.inputs.bicarbonate.val"
                  @change="data.inputs.bicarbonate.isValid()"
                  placeholder="x"
                  :min="data.inputs.bicarbonate.min()"
                  :max="data.inputs.bicarbonate.max()"
                  :step="data.inputs.bicarbonate.step"
                  autocomplete="off"
                />
                <label for="bicarbonate">{{
                  data.inputs.bicarbonate.label
                }}</label>
              </div>
              <span class="input-group-text">mmol/L</span>
            </div>
            <div
              v-if="showErrors"
              class="form-text text-danger mx-1"
              id="bicarbonateErrors"
            >
              {{ data.inputs.bicarbonate.errors }}
            </div>
          </div>
          <!--glucose-->
          <div class="mb-1 flex-grow-1">
            <div class="input-group">
              <div class="form-floating">
                <input
                  type="number"
                  class="form-control"
                  id="glucose"
                  v-model="data.inputs.glucose.val"
                  @change="data.inputs.glucose.isValid()"
                  placeholder="x"
                  :min="data.inputs.glucose.min()"
                  :max="data.inputs.glucose.max()"
                  :step="data.inputs.glucose.step"
                  autocomplete="off"
                />
                <label for="glucose">{{ data.inputs.glucose.label }}</label>
              </div>
              <span class="input-group-text">mmol/L</span>
            </div>
            <div
              v-if="showErrors"
              class="form-text text-danger mx-1"
              id="glucoseErrors"
            >
              {{ data.inputs.glucose.errors }}
            </div>
          </div>
          <!--ketones-->
          <div class="mb-1 flex-grow-1">
            <div class="input-group">
              <div class="form-floating">
                <input
                  type="number"
                  class="form-control"
                  id="ketones"
                  v-model="data.inputs.ketones.val"
                  @change="data.inputs.ketones.isValid()"
                  placeholder="x"
                  :min="data.inputs.ketones.min()"
                  :max="data.inputs.ketones.max()"
                  :step="data.inputs.ketones.step"
                  autocomplete="off"
                />
                <label for="ketones">{{ data.inputs.ketones.label }}</label>
              </div>
              <span class="input-group-text">mmol/L</span>
            </div>
            <div
              v-if="showErrors"
              class="form-text text-danger mx-1"
              id="ketonesErrors"
            >
              {{ data.inputs.ketones.errors }}
            </div>
          </div>
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
            :min="data.inputs.weight.min()"
            :max="data.inputs.weight.max()"
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
      <div
        class="form-check form-switch ms-1 my-1"
        v-if="
          data.inputs.weight.limit.exceeded &&
          data.inputs.weight.val < data.inputs.weight.max()
        "
      >
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
      <p class="text-center m-2">
        {{ data.inputs.shockPresent.label }}
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#shockPresentInfo"
          class="ms-2"
        />
      </p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="shockPresent"
            id="shockPresentTrue"
            value="true"
            v-model="data.inputs.shockPresent.val"
            @change="data.inputs.shockPresent.isValid()"
            autocomplete="off"
            required
          />
          <label class="btn btn-outline-secondary me-2" for="shockPresentTrue"
            >Yes</label
          >

          <input
            type="radio"
            class="btn-check"
            name="shockPresent"
            id="shockPresentFalse"
            value="false"
            v-model="data.inputs.shockPresent.val"
            @change="data.inputs.shockPresent.isValid()"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="shockPresentFalse"
            >No</label
          >
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
      <p class="text-center m-2">
        {{ data.inputs.insulinRate.label }}
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#insulinRateInfo"
          class="ms-2"
        />
      </p>
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
      <p class="text-center m-2">
        {{ data.inputs.preExistingDiabetes.label }}
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#preExistingDiabetesInfo"
          class="ms-2"
        />
      </p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="preExistingDiabetes"
            id="preExistingDiabetesTrue"
            value="true"
            v-model="data.inputs.preExistingDiabetes.val"
            @change="data.inputs.preExistingDiabetes.isValid()"
            autocomplete="off"
            required
          />
          <label
            class="btn btn-outline-secondary me-2"
            for="preExistingDiabetesTrue"
            >Yes</label
          >

          <input
            type="radio"
            class="btn-check"
            name="preExistingDiabetes"
            id="preExistingDiabetesFalse"
            value="false"
            v-model="data.inputs.preExistingDiabetes.val"
            @change="data.inputs.preExistingDiabetes.isValid()"
            autocomplete="off"
          />
          <label
            class="btn btn-outline-secondary"
            for="preExistingDiabetesFalse"
            >No</label
          >
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
    <!--insulinDeliveryMethod-->
    <transition>
      <div class="mb-4" v-if="data.inputs.preExistingDiabetes.val == 'true'">
        <p class="text-center m-2">
          {{ data.inputs.insulinDeliveryMethod.label }}
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            data-bs-toggle="collapse"
            data-bs-target="#insulinDeliveryMethodInfo"
            class="ms-2"
          />
        </p>
        <div class="d-flex justify-content-center">
          <div>
            <input
              type="radio"
              class="btn-check"
              name="insulinDeliveryMethod"
              id="insulinDeliveryMethodPen"
              value="pen"
              v-model="data.inputs.insulinDeliveryMethod.val"
              @change="data.inputs.insulinDeliveryMethod.isValid()"
              autocomplete="off"
              required
            />
            <label
              class="btn btn-outline-secondary me-2"
              for="insulinDeliveryMethodPen"
              >Pen injections</label
            >

            <input
              type="radio"
              class="btn-check"
              name="insulinDeliveryMethod"
              id="insulinDeliveryMethodPump"
              value="pump"
              v-model="data.inputs.insulinDeliveryMethod.val"
              @change="data.inputs.insulinDeliveryMethod.isValid()"
              autocomplete="off"
            />
            <label
              class="btn btn-outline-secondary"
              for="insulinDeliveryMethodPump"
              >Pump</label
            >
          </div>
        </div>
        <div
          v-if="showErrors"
          class="form-text text-danger text-center mx-1"
          id="insulinDeliveryMethodErrors"
        >
          {{ data.inputs.insulinDeliveryMethod.errors }}
        </div>
        <div
          class="collapse form-text text-center mx-1"
          id="insulinDeliveryMethodInfo"
        >
          {{ data.inputs.insulinDeliveryMethod.info }}
        </div>
      </div>
    </transition>

    <div class="d-flex flex-row justify-content-evenly">
      <!--back-->
      <div class="text-center">
        <button
          type="button"
          @click="router.push('/form-patient-details')"
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
.flex-wrap {
  column-gap: 20px;
}
.insulin-rate-btn {
  height: 62px;
}
.v-enter-active {
  transition: all 0.5s ease;
}
.v-enter-from {
  opacity: 0;
}
</style>
