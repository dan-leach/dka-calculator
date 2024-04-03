<script setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { data } from "../assets/data.js";
import { config } from "../assets/config.js";
import router from "../router";

let showErrors = ref(false);

const continueClick = () => {
  console.log(data.value.inputs.protocolStartDatetime.val);
  showErrors.value = true;
  document.getElementById("form-audit-details").classList.add("was-validated");
  if (data.value.form.isValid(3)) router.push("/generate-protocol");
};

onMounted(() => {
  //if (!data.value.form.isValid(2)) router.push("/form-clinical-details");
});
</script>

<template>
  <form id="form-audit-details" class="container my-4 needs-validation">
    <h2 class="display-3">Audit details</h2>
    <!--episodeType-->
    <div class="mb-4">
      <p class="text-center m-2">{{ data.inputs.episodeType.label }}</p>
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="episodeType"
            id="real"
            value="real"
            v-model="data.inputs.episodeType.val"
            @change="data.inputs.episodeType.isValid()"
            autocomplete="off"
            required
          />
          <label
            class="btn btn-outline-secondary me-2 episode-type-btn py-3"
            for="real"
            >For a real patient</label
          >

          <input
            type="radio"
            class="btn-check"
            name="episodeType"
            id="test"
            value="test"
            v-model="data.inputs.episodeType.val"
            @change="data.inputs.episodeType.isValid()"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="test"
            >For testing or training purposes</label
          >
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            data-bs-toggle="collapse"
            data-bs-target="#episodeTypeInfo"
            class="ms-2"
          />
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
          class="form-control"
          v-model="data.inputs.region.val"
          @change="data.inputs.region.isValid()"
          autocomplete="off"
          required
        >
          <option value="" disabled>{{ data.inputs.region.label }}</option>
          <option v-for="region in config.client.regions" :value="region.name">
            {{ region.name }}
          </option>
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
    <div class="mb-4">
      <div class="input-group">
        <select
          name="region"
          class="form-control"
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
    <!--preventableFactors-->
    <div class="mb-4">
      <p class="text-center m-2">
        {{ data.inputs.preventableFactors.label
        }}<font-awesome-icon
          :icon="['fas', 'circle-info']"
          data-bs-toggle="collapse"
          data-bs-target="#preventableFactorsInfo"
          class="ms-2"
        />
      </p>
      <div class="d-flex justify-content-center">
        <div class="d-flex flex-wrap justify-content-center">
          <div
            v-for="factor in data.inputs.preventableFactors.options"
            class="my-1"
          >
            <input
              type="checkbox"
              class="btn-check flex-fill"
              :id="factor"
              :value="factor"
              v-model="data.inputs.preventableFactors.val"
              @change="data.inputs.preventableFactors.isValid()"
              autocomplete="off"
              required
            />
            <label
              class="btn btn-outline-secondary me-2 preventable-factors-btn"
              :for="factor"
              >{{ factor }}</label
            >
          </div>
        </div>
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
.preventable-factors-btn {
  height: 75px;
  width: 230px;
}
</style>
