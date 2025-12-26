<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { data } from "../assets/data.js";
import { createPatientHash } from "../assets/createPatientHash.js";
import { api } from "../assets/api.js";
import router from "../router/index.js";
import Swal from "sweetalert2";

const config = inject("config");

/**
 * Controls whether validation and API errors are displayed.
 * Set to true after the first submit attempt for each step.
 */
let showErrors = ref(false);

/**
 * Controls visibility of each step in the retrospective audit workflow.
 *
 * - step1: Ask whether the user has an audit ID
 * - step2: Validate audit ID and patient identifiers
 * - step3: Collect additional identifiers if patient hash is missing
 */
const show = ref({
  step1: true,
  step2: false,
  step3: false,
});

/**
 * Submission state for step 2 (audit ID and patient identifier check).
 *
 * - text: Button label
 * - pending: API request in progress
 * - locked: Prevents duplicate submissions
 * - errors: Error message(s) returned from the API
 */
const step2Submit = ref({
  text: "Submit",
  pending: false,
  locked: false,
  errors: null,
});

/**
 * Submission state for step 3 (adding a patient hash to an existing episode).
 */
const step3Submit = ref({
  text: "Submit",
  pending: false,
  locked: false,
  errors: null,
});

/**
 * Prompts the user to create a new retrospective DKA episode
 * when no audit ID exists.
 */
const createRetrospectiveEpisode = () => {
  Swal.fire({
    title: "Create retrospective episode?",
    text: "If a DKA calculator care pathway was not created for this patient a retrospective episode needs to be added before you can add audit data. A care pathway will not be generated. Proceed?",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#0d6efd",
  }).then((result) => {
    if (result.isConfirmed) {
      data.value.retrospectiveEpisode = true;
      router.push("/form-disclaimer");
    } else {
      data.value.retrospectiveEpisode = false;
    }
  });
};

/**
 * Advances the workflow from step 1 to step 2
 * when the user confirms they have an audit ID.
 */
const hasAuditIDClick = () => {
  show.value.step1 = false;
  show.value.step2 = true;
};

/**
 * Validates an existing episode using audit ID and patient identifiers.
 *
 * Workflow:
 * 1. Validates local form inputs
 * 2. Generates a patient hash
 * 3. Calls the `checkRetrospectiveStatus` API
 *
 * Routing outcomes:
 * - Episode not found → offer retrospective creation
 * - Episode missing patient hash → proceed to step 3
 * - Hash mismatch → show validation error
 * - Audit data exists → allow overwrite
 * - All valid → proceed to audit form
 */
const checkRetrospectiveStatus = async () => {
  showErrors.value = true;
  document
    .getElementById("form-retrospective-start-step-2")
    .classList.add("was-validated");

  // Abort if local validation fails
  if (!data.value.form.isValid(6)) return false;

  step2Submit.value = {
    text: "Please wait...",
    pending: true,
    locked: true,
    errors: null,
  };

  const patientHash = await createPatientHash(
    data.value.inputs.patientNHS.val,
    data.value.inputs.patientDOB.val
  );

  try {
    const response = await api("checkRetrospectiveStatus", {
      auditID: data.value.inputs.auditID.val,
      patientHash,
    });

    step2Submit.value = {
      text: "Submit",
      pending: false,
      locked: false,
      errors: null,
    };

    if (!response.auditID) {
      Swal.fire({
        title: "Episode not found",
        text: "The audit ID provided does not match an existing DKA episode. You can check and try again, or retrospectively create a DKA episode for a patient who did not have a care pathway created at the time of treatment.",
        showCancelButton: true,
        confirmButtonText: "Create retrospective episode",
        confirmButtonColor: "#0d6efd",
      }).then((result) => {
        if (result.isConfirmed) {
          data.value.retrospectiveEpisode = true;
          router.push("/form-disclaimer");
        } else {
          data.value.retrospectiveEpisode = false;
        }
      });
    } else if (!response.patientHash) {
      // Proceed to step 3 to collect additional identifiers
      show.value.step2 = false;
      show.value.step3 = true;

      // Ensure centre options are populated if region is set
      if (data.value.inputs.region.val) {
        data.value.inputs.centre.options =
          config.value.regions.find(
            (region) => region.name === data.value.inputs.region.val
          )?.centres || [];
      }
    } else if (!response.hashesMatch) {
      Swal.fire({
        title: "Patient details do not match",
        text: `Incorrect date of birth or NHS number for episode with audit ID ${data.value.inputs.auditID.val}. Please check the details and try again.`,
        confirmButtonColor: "#0d6efd",
      });
    } else if (response.auditData) {
      Swal.fire({
        title: "Audit data already submitted",
        text: "Audit data has already been submitted for this episode. You can resubmit audit data to overwrite the existing entry if needed.",
        confirmButtonColor: "#0d6efd",
        confirmButtonText: "Proceed to audit form",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/form-retrospective-audit");
        }
      });
    } else {
      router.push("/form-retrospective-audit");
    }
  } catch (error) {
    const errorMessages = error.map((err) => err.msg).join(". ");
    step2Submit.value = {
      text: "Retry?",
      pending: false,
      locked: false,
      errors: errorMessages,
    };
  }
};

/**
 * Adds a patient hash and episode identifiers to an existing
 * retrospective episode that was created without them.
 *
 * Called only after step 3 validation passes.
 */
const addRetrospectivePatientHash = async () => {
  showErrors.value = true;
  document
    .getElementById("form-retrospective-start-step-3")
    .classList.add("was-validated");

  // Abort if local validation fails
  if (!data.value.form.isValid(7)) return false;

  step3Submit.value = {
    text: "Please wait...",
    pending: true,
    locked: true,
    errors: null,
  };

  const patientHash = await createPatientHash(
    data.value.inputs.patientNHS.val,
    data.value.inputs.patientDOB.val
  );

  const protocolStartDate = new Date(data.value.inputs.protocolStartDate.val);

  try {
    const response = await api("addRetrospectivePatientHash", {
      auditID: data.value.inputs.auditID.val,
      patientHash,
      protocolStartDate,
      region: data.value.inputs.region.val,
      centre: data.value.inputs.centre.val,
    });

    step3Submit.value = {
      text: "Submit",
      pending: false,
      locked: false,
      errors: null,
    };

    if (response.patientHashAdded) {
      Swal.fire({
        title: "Patient hash added",
        text: `You should now continue to submit data for this patient unless this has been done already using a duplicate episode. If you are unsure, please submit data again as duplicate episodes will be combined.`,
        confirmButtonColor: "#0d6efd",
      });
      router.push("/form-retrospective-audit");
    } else {
      throw [{ msg: "Unknown error: failed to add patient hash to episode" }];
    }
  } catch (error) {
    const errorMessages = error.map((err) => err.msg).join(". ");
    step3Submit.value = {
      text: "Retry?",
      pending: false,
      locked: false,
      errors: errorMessages,
    };
  }
};

/**
 * Lifecycle hook executed when the component is mounted.
 *
 * - Scrolls the page to the top
 * - If an audit ID found from retrospective episode creation
 *   pre-fills it and skips step 1
 */
onMounted(() => {
  window.scrollTo(0, 0);
  if (data.value.auditID) {
    data.value.inputs.auditID.val = data.value.auditID;
    hasAuditIDClick();
  }

  const route = useRouter().currentRoute.value;
  const routePath = route.path;
  if (routePath === "/create-retrospective-episode")
    createRetrospectiveEpisode();

  if (route.query.id) {
    data.value.inputs.auditID.val = route.query.id;
    if (route.query.nhs) data.value.inputs.patientNHS.val = route.query.nhs;
    if (route.query.dob) {
      // Attempt to parse and format the DOB
      const parsedDate = new Date(route.query.dob);
      if (!isNaN(parsedDate.getTime())) {
        // Convert to YYYY-MM-DD
        const formattedDob = parsedDate.toISOString().split("T")[0];
        data.value.inputs.patientDOB.val = formattedDob;
      } else {
        console.warn("Invalid DOB format:", route.query.dob);
      }
    }
    hasAuditIDClick();
    // Remove query params from URL
    router.replace({ path: route.path, query: {} });

    data.value.auditRoute = "queryString";
  } else if (route.query.q) {
    const decodedB64QueryObj = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.fromBase64(route.query.q, {
          alphabet: "base64url",
        })
      )
    );

    data.value.inputs.auditID.val = decodedB64QueryObj.id || "";
    data.value.inputs.patientNHS.val = decodedB64QueryObj.nhs || "";
    data.value.inputs.patientDOB.val = new Date(decodedB64QueryObj.dob) || "";
    const parsedDate = new Date(decodedB64QueryObj.dob);
    if (!isNaN(parsedDate.getTime())) {
      // Convert to YYYY-MM-DD
      const formattedDob = parsedDate.toISOString().split("T")[0];
      data.value.inputs.patientDOB.val = formattedDob;
    } else {
      console.warn("Invalid DOB format:", decodedB64QueryObj.dob);
    }
    data.value.inputs.protocolStartDate.val =
      new Date(decodedB64QueryObj.start) || "";
    const parsedDate2 = new Date(decodedB64QueryObj.start);
    if (!isNaN(parsedDate2.getTime())) {
      // Convert to YYYY-MM-DD
      const formattedStart = parsedDate2.toISOString().split("T")[0];
      data.value.inputs.protocolStartDate.val = formattedStart;
    } else {
      console.warn(
        "Invalid protocolStartDate format:",
        decodedB64QueryObj.start
      );
    }
    data.value.inputs.region.val = decodedB64QueryObj.region || "";
    data.value.inputs.centre.val = decodedB64QueryObj.centre || "";
    data.value.inputs.patientPostcode.val = decodedB64QueryObj.pcode || "";
    data.value.inputs.preExistingDiabetes.val = decodedB64QueryObj.pre || "";
    data.value.inputs.preventableFactors.val = decodedB64QueryObj.factors || [];
    console.log(data.value.inputs.preventableFactors.val);
    data.value.inputs.ethnicGroup.val = decodedB64QueryObj.eth || "";
    data.value.inputs.ethnicSubgroup.val = decodedB64QueryObj.ethSub || "";

    data.value.auditRoute = "qrCode";

    hasAuditIDClick();
    router.replace({ path: route.path, query: {} });
  } else if (useRoute().redirectedFrom?.path === "/audit") {
    data.value.auditRoute = "auditRedirect";
  } else {
    data.value.auditRoute = "manual";
  }
});
</script>

<template>
  <div class="container my-4">
    <h2 class="display-3">Retrospective audit</h2>
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

    <!--step 1: Do you have an audit ID?-->
    <transition>
      <div v-if="show.step1">
        <p class="text-center">
          Do you have an audit ID?<br />
          <small>(Found at the top of each page of the care pathway)</small>
        </p>
        <div
          class="d-flex flex-row flex-wrap gap-2 justify-content-evenly mb-4"
        >
          <!--submit-->
          <div>
            <button
              type="button"
              @click="hasAuditIDClick"
              class="btn btn-lg btn-success btn-step1"
            >
              Yes
            </button>
          </div>
          <div class="text-center">
            <button
              type="button"
              @click="createRetrospectiveEpisode"
              class="btn btn-lg btn-danger btn-step1"
            >
              No
            </button>
            <p class="text-center">Create a new episode retrospectively</p>
          </div>
        </div>
      </div>
    </transition>

    <!--step 2: check audit ID and patient hash-->
    <transition>
      <div v-if="show.step2">
        <form id="form-retrospective-start-step-2" class="needs-validation">
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
                <label for="patientDOB">{{
                  data.inputs.patientDOB.label
                }}</label>
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
                <label for="patientNHS">{{
                  data.inputs.patientNHS.label
                }}</label>
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
        </form>
        <!--submit-->
        <div class="text-center">
          <p class="text-danger" v-if="step2Submit.errors">
            {{ step2Submit.errors }}
          </p>
          <button
            type="button"
            @click="checkRetrospectiveStatus"
            class="btn btn-lg btn-primary"
          >
            {{ step2Submit.text }}
          </button>
        </div>
      </div>
    </transition>

    <!--step 3: provide new hash episode validators-->
    <transition>
      <div v-if="show.step3">
        <div class="card border-info my-3">
          <div class="card-body">
            <p class="card-text">
              An NHS number was not provided when this episode was created. To
              ensure the correct episode has been found, please provide the
              details below.
            </p>
          </div>
        </div>
        <form id="form-retrospective-start-step-3" class="needs-validation">
          <!--protocolStartDate-->
          <div class="mb-4">
            <small class="ms-1"
              >Note: The protocol start date is printed in the demographics box
              on the front page of the care pathway.</small
            >
            <div class="input-group">
              <div class="form-floating">
                <input
                  type="date"
                  class="form-control"
                  id="protocolStartDate"
                  v-model="data.inputs.protocolStartDate.val"
                  @change="data.inputs.protocolStartDate.isValid()"
                  placeholder="x"
                  min=""
                  max=""
                  required
                  autocomplete="off"
                />
                <label for="protocolStartDate">{{
                  data.inputs.protocolStartDate.label
                }}</label>
              </div>
              <span
                class="input-group-text"
                data-bs-toggle="collapse"
                data-bs-target="#protocolStartDateInfo"
                ><font-awesome-icon :icon="['fas', 'circle-info']"
              /></span>
            </div>
            <div
              v-if="showErrors"
              class="form-text text-danger mx-1"
              id="protocolStartDateErrors"
            >
              {{ data.inputs.protocolStartDate.errors }}
            </div>
            <div class="collapse form-text mx-1" id="protocolStartDateInfo">
              {{ data.inputs.protocolStartDate.info }}
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
                <option value="" disabled>
                  {{ data.inputs.region.label }}
                </option>
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
                  <option value="" disabled>
                    {{ data.inputs.centre.label }}
                  </option>
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
        </form>
        <div class="text-center">
          <p class="text-danger" v-if="step3Submit.errors">
            {{ step3Submit.errors }}
          </p>
          <button
            type="button"
            @click="addRetrospectivePatientHash"
            class="btn btn-lg btn-primary"
          >
            {{ step3Submit.text }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
.btn-outline-secondary {
  width: 150px;
  background-color: white;
}
.v-enter-active {
  transition: all 0.5s ease;
}
.v-enter-from {
  opacity: 0;
}
.btn-step1 {
  width: 250px;
}
</style>
