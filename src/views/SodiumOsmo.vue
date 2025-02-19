<script setup>
import { inject } from "vue";
const config = inject("config");
import { ref, onMounted } from "vue";
import { data } from "../assets/data.js";
import { api } from "../assets/api.js";

let showErrors = ref(false);
let errors = ref([]);
let locked = ref(false);
let pending = ref(false);
let showWorkingBtnText = ref("Show working");

let correctedSodium = ref({ val: null, formula: "", working: "" });
let effectiveOsmolality = ref({ val: null, formula: "", working: "" });

const submitClick = async () => {
  try {
    showErrors.value = true;
    document.getElementById("form-sodium-osmo").classList.add("was-validated");
    if (!data.value.form.isValid(5)) return false;
    locked.value = true;
    pending.value = true;
    const response = await api("sodium-osmo", {
      sodium: parseFloat(data.value.inputs.sodium.val),
      glucose: parseFloat(data.value.inputs.glucose.val),
      clientUseragent: navigator.userAgent,
      appVersion: {
        client: config.value.client.version,
        api: config.value.api.version,
      },
    });
    pending.value = false;
    correctedSodium.value = response.correctedSodium;
    effectiveOsmolality.value = response.effectiveOsmolality;
  } catch (error) {
    console.log(error);
    errors.value = error;
    pending.value = false;
    locked.value = false;
    correctedSodium.value = null;
    effectiveOsmolality.value = null;
  }
};

const resetClick = () => {
  locked.value = false;
  data.value.inputs.sodium.val = "";
  data.value.inputs.glucose.val = "";
  correctedSodium.value = { val: null, formula: "", working: "" };
  effectiveOsmolality.value = { val: null, formula: "", working: "" };
  document.getElementById("form-sodium-osmo").classList.remove("was-validated");
};

onMounted(() => {
  // Scroll to top
  window.scrollTo(0, 0);

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
});
</script>

<template>
  <div class="container my-4">
    <form id="form-sodium-osmo" class="needs-validation">
      <h2 class="display-4">
        Corrected sodium and effective osmolality calculator
      </h2>
      <p>
        This will calculate the corrected sodium and effective osmolarity using
        the values for serum sodium and serum glucose input below. For more
        information about how this data is used refer to the
        <RouterLink to="/privacy-policy" target="_blank"
          >privacy policy</RouterLink
        >.
      </p>
      <div class="d-flex flex-wrap">
        <!--sodium input-->
        <div class="mb-4 input-div">
          <div class="input-group">
            <div class="form-floating">
              <input
                type="number"
                class="form-control"
                id="sodium"
                v-model="data.inputs.sodium.val"
                @change="data.inputs.sodium.isValid()"
                placeholder="x"
                :min="data.inputs.sodium.min()"
                :max="data.inputs.sodium.max()"
                autocomplete="off"
                required
                :disabled="locked"
              />
              <label for="sodium">{{ data.inputs.sodium.label }}</label>
            </div>
            <span class="input-group-text">mmol/L</span>
          </div>
          <div
            v-if="showErrors"
            class="form-text text-danger mx-1"
            id="sodiumErrors"
          >
            {{ data.inputs.sodium.errors }}
          </div>
        </div>
        <!--glucose input-->
        <div class="mb-4 input-div">
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
                autocomplete="off"
                required
                :disabled="locked"
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
        <!--submit-->
        <button
          type="button"
          @click="submitClick"
          class="btn btn-lg btn-primary mb-4"
          id="btnSubmit"
          :disabled="locked"
        >
          Calculate
        </button>
      </div>
      <p class="text-danger" v-if="errors.length">
        <font-awesome-icon :icon="['fas', 'xmark']" style="color: red" />
        <span v-for="error in errors">&nbsp;{{ error.msg }}</span>
      </p>
    </form>
    <div class="d-flex flex-wrap">
      <!--corrected sodium output-->
      <div class="mb-4 input-div">
        <div class="input-group">
          <div class="form-floating">
            <input
              type="number"
              class="form-control"
              id="correctedSodium"
              v-model="correctedSodium.val"
              placeholder="x"
              readonly
              :disabled="!locked"
            />
            <label for="correctedSodium">Corrected Sodium</label>
          </div>
          <span class="input-group-text">mmol/L</span>
        </div>
      </div>
      <!--effective osmolality output-->
      <div class="mb-4 input-div">
        <div class="input-group">
          <div class="form-floating">
            <input
              type="number"
              class="form-control"
              id="effectiveOsmolality"
              v-model="effectiveOsmolality.val"
              placeholder="x"
              readonly
              :disabled="!locked"
            />
            <label for="effectiveOsmolality">Effective Osmolality</label>
          </div>
          <span class="input-group-text">mOsm/kg</span>
        </div>
      </div>
      <!--reset-->
      <button
        type="button"
        @click="resetClick"
        class="btn btn-lg btn-secondary mb-4"
        id="btnReset"
        :disabled="!locked || pending"
      >
        Reset
      </button>
    </div>
    <span v-show="locked && !pending">
      <!--show working-->
      <button
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#showWorking"
        class="btn btn-sm btn-primary mx-2"
      >
        {{ showWorkingBtnText }}
      </button>

      <div class="collapse my-2" id="showWorking">
        <!--corrected sodium-->
        <div class="card mb-4">
          <div class="card-header">Corrected sodium</div>
          <div class="card-body">
            <div class="mb-2">
              <div class="card p-2">
                <span class="text-muted m-0">Formula</span>
                <span v-html="correctedSodium.formula"></span>
              </div>
            </div>
            <div class="mb-2">
              <div class="card p-2">
                <span class="text-muted m-0">Working</span>
                <span v-html="correctedSodium.working"></span>
              </div>
            </div>
            <div class="mb-2">
              <div class="card p-2">
                <span class="text-muted m-0">Output</span>
                {{ correctedSodium.val }}mmol/L
              </div>
            </div>
          </div>
        </div>
        <!--effective osmolality-->
        <div class="card mb-4">
          <div class="card-header">Effective osmolality</div>
          <div class="card-body">
            <div class="mb-2">
              <div class="card p-2">
                <span class="text-muted m-0">Formula</span>
                <span v-html="effectiveOsmolality.formula"></span>
              </div>
            </div>
            <div class="mb-2">
              <div class="card p-2">
                <span class="text-muted m-0">Working</span>
                <span v-html="effectiveOsmolality.working"></span>
              </div>
            </div>
            <div class="mb-2">
              <div class="card p-2">
                <span class="text-muted m-0">Output</span>
                {{ effectiveOsmolality.val }}mmol/L
              </div>
            </div>
          </div>
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
}
.input-div {
  min-width: 300px;
}
.flex-wrap {
  column-gap: 20px;
}
#btnSubmit,
#btnReset {
  min-width: 120px;
}
@media only screen and (max-width: 800px) {
  #btnSubmit,
  #btnReset {
    min-width: 100%;
  }
  .input-div {
    min-width: 100%;
  }
}
</style>
