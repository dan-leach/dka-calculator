<script setup>
import { ref, onMounted } from "vue";
import { data } from "../assets/data.js";
import { createPatientHash } from "../assets/createPatientHash.js";
import { api } from "../assets/api.js";
import router from "../router/index.js";
import Swal from "sweetalert2";

import { inject } from "vue";
const config = inject("config");

// Reactive variable to control error display.
let showErrors = ref(false);

const show = ref({
    step1: true,
    step2: false,
    step3: false,
})

const step2Submit = ref({
    pending: false,
    locked: false,
    errors: null
})

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

const hasAuditIDClick = () => {
    show.value.step1 = false;
    show.value.step2 = true;
}

const checkRetrospectiveStatus = async () => {
    showErrors.value = true;
    document.getElementById("form-retrospective-start").classList.add("was-validated");

    // Check if the form is valid and navigate to the next route
    if (!data.value.form.isValid(6)) return false;

    step2Submit.value = {
        pending: true,
        locked: true,
        errors: null
    }

    const patientHash = await createPatientHash(data.value.inputs.patientNHS.val, data.value.inputs.patientDOB.val);

    try {
        const response = await api("checkRetrospectiveStatus", {
            auditID: data.value.inputs.auditID.val,
            patientHash
        });
        step2Submit.value = {
            pending: false,
            locked: false,
            errors: null
        }
        console.log(response);
    } catch (error) {
        console.log(error);
        step2Submit.value = {
            pending: false,
            locked: false,
            errors: error
        }
    }
    
    //if audit id and patient hash valid
    //router.push("/form-retrospective-audit");
    //else
    //show.value.step2 = false;
    //show.value.step3 = true;
}

/**
 * Lifecycle hook that runs when the component is mounted.
 * Scrolls to the top of the page.
 */
onMounted(() => {
  // Scroll to top
  window.scrollTo(0, 0);
  if (data.value.auditID) {
    data.value.inputs.auditID.val = data.value.auditID;
    hasAuditIDClick();
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
            Do you have an audit ID?<br></br>
            <small>(Found at the top of each page of the care pathway)</small>
        </p>
        <div class="d-flex flex-row justify-content-evenly mb-4">
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
        <form id="form-retrospective-start" class="needs-validation">
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
            Submit
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
                    An NHS number was not provided when this episode was created. To ensure the correct episode has been found, please provide the details below as shown on the generated care pathway.
                    </p>
                </div>
            </div>

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
