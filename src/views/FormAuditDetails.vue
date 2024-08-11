<script setup>
import { ref, onMounted } from "vue";
import { data } from "../assets/data.js";
import router from "../router";

import { inject } from "vue";
const config = inject("config");

// Reactive variable to control error display.
let showErrors = ref(false);

/**
 * Handles the 'Continue' button click event.
 * Shows validation errors and navigates to the next step if the form is valid.
 */
const continueClick = () => {
  showErrors.value = true;
  // Add validation class to the form
  document.getElementById("form-audit-details").classList.add("was-validated");

  // Check if the form is valid and navigate to the next route
  if (data.value.form.isValid(3)) {
    router.push("/generate-protocol");
  }
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
  } else if (
    data.value.inputs.weight.limit.override &&
    !data.value.inputs.weight.limit.overrideConfirm
  ) {
    router.push("/form-override-confirm");
  } else {
    // Scroll to top
    window.scrollTo(0, 0);
  }
});
</script>

<template>
  <form id="form-audit-details" class="container my-4 needs-validation">
    <h2 class="display-3">Audit details</h2>
    <!--episodeType-->
    <div class="mb-4">
      <p class="text-center m-2">
        {{ data.inputs.episodeType.label }}
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#episodeTypeInfo"
          class="ms-2"
        />
      </p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="episodeType"
            id="episodeTypeReal"
            value="real"
            v-model="data.inputs.episodeType.val"
            @change="data.inputs.episodeType.isValid()"
            autocomplete="off"
            required
          />
          <label
            class="btn btn-outline-secondary me-2 episode-type-btn py-3"
            for="episodeTypeReal"
            >For a real patient</label
          >

          <input
            type="radio"
            class="btn-check"
            name="episodeType"
            id="episodeTypeTest"
            value="test"
            v-model="data.inputs.episodeType.val"
            @change="data.inputs.episodeType.isValid()"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="episodeTypeTest"
            >For testing or training purposes</label
          >
        </div>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger text-center mx-1"
        id="episodeTypeErrors"
      >
        {{ data.inputs.episodeType.errors }}
      </div>
      <div class="collapse form-text text-center mx-1" id="episodeTypeInfo">
        {{ data.inputs.episodeType.info }}
      </div>
    </div>
    <!--region-->
    <div class="mb-4">
      <div class="input-group">
        <select
          name="region"
          class="form-select"
          v-model="data.inputs.region.val"
          @change="data.inputs.region.isValid()"
          autocomplete="off"
          required
        >
          <option value="" disabled>{{ data.inputs.region.label }}</option>
          <option v-for="region in config.regions" :value="region.name">
            {{ region.name }}
          </option>
          <option value="Other">Other</option>
        </select>

        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#regionInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger mx-1"
        id="regionErrors"
      >
        {{ data.inputs.region.errors }}
      </div>
      <div class="collapse form-text mx-1" id="regionInfo">
        {{ data.inputs.region.info }}
      </div>
    </div>
    <!--centre-->
    <transition>
      <div class="mb-4" v-if="data.inputs.region.val">
        <div class="input-group">
          <select
            name="centre"
            class="form-select"
            v-model="data.inputs.centre.val"
            @change="data.inputs.centre.isValid()"
            autocomplete="off"
            required
            :disabled="!data.inputs.region.val"
          >
            <option value="" disabled>{{ data.inputs.centre.label }}</option>
            <option
              v-for="centreOption in data.inputs.centre.options"
              :value="centreOption"
            >
              {{ centreOption }}
            </option>
            <option value="Other">Other</option>
          </select>

          <span
            class="input-group-text"
            data-bs-toggle="collapse"
            data-bs-target="#centreInfo"
            ><font-awesome-icon :icon="['fas', 'circle-info']"
          /></span>
        </div>
        <div
          v-if="showErrors"
          class="form-text text-danger mx-1"
          id="centreErrors"
        >
          {{ data.inputs.centre.errors }}
        </div>
        <div class="collapse form-text mx-1" id="centreInfo">
          {{ data.inputs.centre.info }}
        </div>
      </div>
    </transition>
    <!--ethnicGroup-->
    <div class="mb-4">
      <div class="input-group">
        <select
          name="ethnicGroup"
          class="form-select"
          v-model="data.inputs.ethnicGroup.val"
          @change="data.inputs.ethnicGroup.isValid()"
          autocomplete="off"
          required
        >
          <option value="" disabled>{{ data.inputs.ethnicGroup.label }}</option>
          <option
            v-for="ethnicGroup in config.ethnicGroups"
            :value="ethnicGroup.name"
          >
            {{ ethnicGroup.name }}
          </option>
        </select>

        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#ethnicGroupInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger mx-1"
        id="ethnicGroupErrors"
      >
        {{ data.inputs.ethnicGroup.errors }}
      </div>
      <div class="collapse form-text mx-1" id="ethnicGroupInfo">
        {{ data.inputs.ethnicGroup.info }}
      </div>
    </div>
    <!--ethnicSubgroup-->
    <transition>
      <div class="mb-4" v-if="data.inputs.ethnicGroup.val">
        <div class="input-group">
          <select
            name="ethnicSubgroup"
            class="form-select"
            v-model="data.inputs.ethnicSubgroup.val"
            @change="data.inputs.ethnicSubgroup.isValid()"
            autocomplete="off"
            required
            :disabled="!data.inputs.ethnicGroup.val"
          >
            <option value="" disabled>
              {{ data.inputs.ethnicSubgroup.label }}
            </option>
            <option
              v-for="ethnicSubgroupOption in data.inputs.ethnicSubgroup.options"
              :value="ethnicSubgroupOption"
            >
              {{ ethnicSubgroupOption }}
            </option>
            <option value="Unknown">Unknown</option>
          </select>

          <span
            class="input-group-text"
            data-bs-toggle="collapse"
            data-bs-target="#ethnicSubgroupInfo"
            ><font-awesome-icon :icon="['fas', 'circle-info']"
          /></span>
        </div>
        <div
          v-if="showErrors"
          class="form-text text-danger mx-1"
          id="ethnicSubgroupErrors"
        >
          {{ data.inputs.ethnicSubgroup.errors }}
        </div>
        <div class="collapse form-text mx-1" id="ethnicSubgroupInfo">
          {{ data.inputs.ethnicSubgroup.info }}
        </div>
      </div>
    </transition>
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
      <div class="d-flex flex-row flex-wrap justify-content-center mb-4">
        <div v-for="option in data.inputs.preventableFactors.options.list">
          <input
            type="checkbox"
            class="btn-check"
            :id="option"
            :value="option"
            v-model="data.inputs.preventableFactors.options.val"
            @change="data.inputs.preventableFactors.options.change(option)"
            autocomplete="off"
            required
          />
          <label class="btn btn-outline-secondary me-2 mb-2" :for="option">{{
            option
          }}</label>
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
          Instructions on how to submit retrospective preventable factors data
          will be printed on the generated care pathway document.
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
    <div class="d-flex flex-row justify-content-evenly">
      <!--back-->
      <div class="text-center">
        <button
          type="button"
          @click="router.push('/form-clinical-details')"
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
          Generate protocol
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
