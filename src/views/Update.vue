<script setup>
import { ref, onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router";

// Reactive variable to control error display.
let showErrors = ref(false);

/**
 * Handles the 'Submit' button click event.
 * Shows validation errors and submits the data if the form is valid.
 */
const submitClick = () => {
  showErrors.value = true;
  // Add validation class to the form
  document.getElementById("form-update").classList.add("was-validated");

  // Check if the form is valid and navigate to the next route
  if (data.value.form.isValid(4)) {
    router.push("/submit-update");
  }
};

/**
 * Lifecycle hook that runs when the component is mounted.
 * Scrolls to the top of the page.
 */
onMounted(() => {
  // Build date-related values and set input min/max attributes
  const { protocolEndDatetime } = data.value.inputs;
  protocolEndDatetime.minDate.build();
  protocolEndDatetime.minDateString.build();
  protocolEndDatetime.maxDate.build();
  protocolEndDatetime.maxDateString.build();
  // Scroll to top
  window.scrollTo(0, 0);
});
</script>

<template>
  <form id="form-update" class="container my-4 needs-validation">
    <h2 class="display-3">Update audit data</h2>
    <p class="mx-1">
      To update the data the DKA Calculator holds for your patient please
      complete the form below. For more information about how this data is used
      click the
      <font-awesome-icon :icon="['fas', 'circle-info']" /> icon by each field or
      refer to the
      <RouterLink to="/privacy-policy" target="_blank"
        >privacy policy</RouterLink
      >.
    </p>
    <div class="card border-danger my-3">
      <div class="card-body">
        <p class="card-text">
          You must not make any changes to data unless it pertains directly to
          patients under your care.
        </p>
      </div>
    </div>
    <!--auditID-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="auditID"
            v-model="data.inputs.auditID.val"
            @change="data.inputs.auditID.isValid()"
            placeholder="x"
            :minlength="data.inputs.auditID.minLength()"
            :maxlength="data.inputs.auditID.maxLength()"
            required
            autocomplete="off"
          />
          <label for="auditID">{{ data.inputs.auditID.label }}</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#auditIDInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger mx-1"
        id="auditIDErrors"
      >
        {{ data.inputs.auditID.errors }}
      </div>
      <div class="collapse form-text mx-1" id="auditIDInfo">
        {{ data.inputs.auditID.info }}
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
        v-html="data.inputs.patientDOB.updateInfo"
      ></div>
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
      <div
        class="collapse form-text mx-1"
        id="patientNHSInfo"
        v-html="data.inputs.patientNHS.updateInfo"
      ></div>
    </div>
    <!--protocolEndDatetime-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="datetime-local"
            class="form-control"
            id="protocolEndDatetime"
            v-model="data.inputs.protocolEndDatetime.val"
            @change="data.inputs.protocolEndDatetime.isValid()"
            placeholder="x"
            min=""
            max=""
            required
            autocomplete="off"
          />
          <label for="protocolEndDatetime">{{
            data.inputs.protocolEndDatetime.label
          }}</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#protocolEndDatetimeInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div class="form-text mx-1" id="protocolEndDatetimeHelp">
        {{ data.inputs.protocolEndDatetime.help }}
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger mx-1"
        id="protocolEndDatetimeErrors"
      >
        {{ data.inputs.protocolEndDatetime.errors }}
      </div>
      <div class="collapse form-text mx-1" id="protocolEndDatetimeInfo">
        {{ data.inputs.protocolEndDatetime.info }}
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
            @change="data.inputs.preExistingDiabetes.isValidForUpdateView()"
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
            @change="data.inputs.preExistingDiabetes.isValidForUpdateView()"
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
        {{ data.inputs.preExistingDiabetes.updateInfo }}
      </div>
    </div>
    <!--preventableFactors-->
    <div class="mb-4">
      <p class="text-center m-2">
        {{ data.inputs.preventableFactors.label }}
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#preventableFactorsInfo"
          class="ms-2"
        />
      </p>
      <!--options-->
      <div class="d-flex flex-row flex-wrap justify-content-center">
        <div v-for="option in data.inputs.preventableFactors.options.list">
          <input
            type="checkbox"
            class="btn-check"
            :id="option"
            :value="option"
            v-model="data.inputs.preventableFactors.options.val"
            @change="data.inputs.preventableFactors.options.change(option)"
            autocomplete="off"
            v-if="option != 'Not yet known'"
            required
            :disabled="!data.inputs.preExistingDiabetes.val"
          />
          <label
            class="btn btn-outline-secondary me-2"
            :for="option"
            v-if="option != 'Not yet known'"
            >{{ option }}</label
          >
        </div>
      </div>
      <div
        v-if="data.inputs.preventableFactors.options.val.includes('Yes')"
        class="form-text text-center"
      >
        Please select <strong>all</strong> preventable factors which apply,
        using the categories below.<br />
        You do not need to be certain that a particular factor caused the
        episode of DKA.<br />If addressing a factor
        <strong>might possibly</strong> have allowed the episode of DKA to be
        avoided, please select it.
      </div>
      <div
        v-else-if="
          data.inputs.preventableFactors.options.val.includes('Not yet known')
        "
        class="form-text text-center"
      >
        A feature to allow you to submit preventable factors data at a later
        point is under development.
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger text-center mx-1"
        id="preventableFactorsErrors"
      >
        {{ data.inputs.preventableFactors.errors }}
      </div>
      <div
        class="collapse form-text text-center mx-1"
        id="preventableFactorsInfo"
      >
        {{ data.inputs.preventableFactors.info }}
      </div>
      <!--categories-->
      <transition>
        <div
          v-if="data.inputs.preventableFactors.options.val.includes('Yes')"
          class="d-flex flex-row flex-wrap justify-content-center mt-4"
        >
          <div
            v-for="category in data.inputs.preventableFactors.categories.list"
          >
            <div
              v-if="
                category.preExistingDiabetes.includes(
                  data.inputs.preExistingDiabetes.val
                )
              "
            >
              <input
                type="checkbox"
                class="btn-check"
                :id="category.name"
                :value="category.name"
                v-model="data.inputs.preventableFactors.categories.val"
                autocomplete="off"
              />
              <label
                class="btn btn-outline-secondary me-2 preventable-factors-category-btn mb-2"
                :for="category.name"
                >{{ category.name }}</label
              >
              <!--factors-->
              <div class="d-flex flex-column justify-content-center">
                <div v-for="factor in data.inputs.preventableFactors.factors">
                  <transition>
                    <div
                      v-if="
                        factor.categories.includes(category.name) &&
                        (data.inputs.preventableFactors.categories.val.includes(
                          category.name
                        ) ||
                          data.inputs.preventableFactors.val.includes(
                            factor.val
                          ))
                      "
                    >
                      <input
                        type="checkbox"
                        class="btn-check"
                        :id="factor.val"
                        :value="factor.val"
                        v-model="data.inputs.preventableFactors.val"
                        @change="data.inputs.preventableFactors.isValid()"
                        autocomplete="off"
                      />
                      <label
                        class="btn btn-outline-dark me-2 preventable-factors-factor-btn mb-1"
                        :for="factor.val"
                        >{{ factor.val }}</label
                      >
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!--cerebralOedemaConcern-->
    <div class="mb-4">
      <p class="text-center m-2">
        {{ data.inputs.cerebralOedemaConcern.label }}
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#cerebralOedemaConcernInfo"
          class="ms-2"
        />
      </p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="cerebralOedemaConcern"
            id="cerebralOedemaConcernTrue"
            value="true"
            v-model="data.inputs.cerebralOedemaConcern.val"
            @change="data.inputs.cerebralOedemaConcern.isValid()"
            autocomplete="off"
            required
          />
          <label
            class="btn btn-outline-secondary me-2"
            for="cerebralOedemaConcernTrue"
            >Yes</label
          >

          <input
            type="radio"
            class="btn-check"
            name="cerebralOedemaConcern"
            id="cerebralOedemaConcernFalse"
            value="false"
            v-model="data.inputs.cerebralOedemaConcern.val"
            @change="data.inputs.cerebralOedemaConcern.isValid()"
            autocomplete="off"
          />
          <label
            class="btn btn-outline-secondary"
            for="cerebralOedemaConcernFalse"
            >No</label
          >
        </div>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger text-center mx-1"
        id="cerebralOedemaConcernErrors"
      >
        {{ data.inputs.cerebralOedemaConcern.errors }}
      </div>
      <div
        class="collapse form-text text-center mx-1"
        id="cerebralOedemaConcernInfo"
      >
        {{ data.inputs.cerebralOedemaConcern.info }}
      </div>
    </div>
    <!--cerebralOedemaImaging-->
    <div class="mb-4" v-if="data.inputs.cerebralOedemaConcern.val === 'true'">
      <p class="text-center m-2">
        {{ data.inputs.cerebralOedemaImaging.label }}
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#cerebralOedemaImagingInfo"
          class="ms-2"
        />
      </p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="cerebralOedemaImaging"
            id="cerebralOedemaImagingTrue"
            value="true"
            v-model="data.inputs.cerebralOedemaImaging.val"
            @change="data.inputs.cerebralOedemaImaging.isValid()"
            autocomplete="off"
            required
          />
          <label
            class="btn btn-outline-secondary me-2"
            for="cerebralOedemaImagingTrue"
            >Yes</label
          >

          <input
            type="radio"
            class="btn-check"
            name="cerebralOedemaImaging"
            id="cerebralOedemaImagingFalse"
            value="false"
            v-model="data.inputs.cerebralOedemaImaging.val"
            @change="data.inputs.cerebralOedemaImaging.isValid()"
            autocomplete="off"
          />
          <label
            class="btn btn-outline-secondary me-2"
            for="cerebralOedemaImagingFalse"
            >No</label
          >

          <input
            type="radio"
            class="btn-check"
            name="cerebralOedemaImaging"
            id="cerebralOedemaImagingNa"
            value="n/a"
            v-model="data.inputs.cerebralOedemaImaging.val"
            @change="data.inputs.cerebralOedemaImaging.isValid()"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="cerebralOedemaImagingNa"
            >Not applicable</label
          >
        </div>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger text-center mx-1"
        id="cerebralOedemaImagingErrors"
      >
        {{ data.inputs.cerebralOedemaImaging.errors }}
      </div>
      <div
        class="collapse form-text text-center mx-1"
        id="cerebralOedemaImagingInfo"
      >
        {{ data.inputs.cerebralOedemaImaging.info }}
      </div>
    </div>
    <!--cerebralOedemaTreatment-->
    <div class="mb-4" v-if="data.inputs.cerebralOedemaConcern.val === 'true'">
      <p class="text-center m-2">
        {{ data.inputs.cerebralOedemaTreatment.label }}
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#cerebralOedemaTreatmentInfo"
          class="ms-2"
        />
      </p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="checkbox"
            class="btn-check"
            name="cerebralOedemaTreatment"
            id="cerebralOedemaTreatmentHypertonic"
            value="hypertonic"
            v-model="data.inputs.cerebralOedemaTreatment.val"
            @change="data.inputs.cerebralOedemaTreatment.isValid()"
            autocomplete="off"
            required
          />
          <label
            v-if="!data.inputs.cerebralOedemaTreatment.val.includes('no')"
            class="btn btn-outline-secondary me-2"
            for="cerebralOedemaTreatmentHypertonic"
            >Hypertonic saline</label
          >

          <input
            type="checkbox"
            class="btn-check"
            name="cerebralOedemaTreatment"
            id="cerebralOedemaTreatmentMannitol"
            value="mannitol"
            v-model="data.inputs.cerebralOedemaTreatment.val"
            @change="data.inputs.cerebralOedemaTreatment.isValid()"
            autocomplete="off"
          />
          <label
            v-if="!data.inputs.cerebralOedemaTreatment.val.includes('no')"
            class="btn btn-outline-secondary me-2"
            for="cerebralOedemaTreatmentMannitol"
            >Mannitol</label
          >

          <input
            type="checkbox"
            class="btn-check"
            name="cerebralOedemaTreatment"
            id="cerebralOedemaTreatmentOther"
            value="other"
            v-model="data.inputs.cerebralOedemaTreatment.val"
            @change="data.inputs.cerebralOedemaTreatment.isValid()"
            autocomplete="off"
          />
          <label
            v-if="!data.inputs.cerebralOedemaTreatment.val.includes('no')"
            class="btn btn-outline-secondary me-2"
            for="cerebralOedemaTreatmentOther"
            >Other treatment</label
          >

          <input
            type="checkbox"
            class="btn-check"
            name="cerebralOedemaTreatment"
            id="cerebralOedemaTreatmentNo"
            value="no"
            v-model="data.inputs.cerebralOedemaTreatment.val"
            @change="data.inputs.cerebralOedemaTreatment.isValid()"
            autocomplete="off"
          />
          <label
            v-if="
              data.inputs.cerebralOedemaTreatment.val.length === 0 ||
              data.inputs.cerebralOedemaTreatment.val.includes('no')
            "
            class="btn btn-outline-secondary"
            for="cerebralOedemaTreatmentNo"
            >No treatment</label
          >
        </div>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger text-center mx-1"
        id="cerebralOedemaTreatmentErrors"
      >
        {{ data.inputs.cerebralOedemaTreatment.errors }}
      </div>
      <div
        class="collapse form-text text-center mx-1"
        id="cerebralOedemaTreatmentInfo"
      >
        {{ data.inputs.cerebralOedemaTreatment.info }}
      </div>
    </div>
    <div class="d-flex flex-row justify-content-evenly">
      <!--submit-->
      <div class="text-center">
        <button
          type="button"
          @click="submitClick"
          class="btn btn-lg btn-primary"
        >
          Submit
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
.preventable-factors-category-btn {
  height: 65px;
  width: 170px;
}
.preventable-factors-factor-btn {
  font-size: smaller;
  width: 170px;
}
.v-enter-active {
  transition: all 0.5s ease;
}
.v-enter-from {
  opacity: 0;
}
</style>
