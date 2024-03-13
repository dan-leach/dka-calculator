<script setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { data } from "../assets/data.js";
import Swal from "sweetalert2";
import router from "../router";

let showErrors = ref(false);

const next = () => {
  showErrors.value = true;
  document.getElementById("form2").classList.add("was-validated");
  let formValid = true;
  for (let i in data.value.inputs)
    if (!data.value.inputs[i].isValid()) formValid = false;
  if (!formValid) return false;
  console.log("form validation passed");
};

onMounted(() => {
  if (!data.value.forms.part1.isValid) router.push("/form-part-1");
});
</script>

<template>
  <form id="form2" class="container my-4 needs-validation">
    <h2 class="display-3">Clinical details</h2>
    <!--patientName-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="patientName"
            v-model="data.inputs.patientName.val"
            @change="data.inputs.patientName.isValid()"
            placeholder="x"
            :minlength="data.inputs.patientName.minLength"
            :maxlength="data.inputs.patientName.maxLength"
            required
            autocomplete="off"
          />
          <label for="patientName">{{ data.inputs.patientName.label }}</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#patientNameInfo"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div
        v-if="showErrors"
        class="form-text text-danger mx-1"
        id="patientNameErrors"
      >
        {{ data.inputs.patientName.errors }}
      </div>
      <div class="collapse form-text mx-1" id="patientNameInfo">
        {{ data.inputs.patientName.info }}
      </div>
    </div>
    <!--next-->
    <div class="text-center">
      <button type="button" @click="next" class="btn btn-lg btn-primary">
        Continue
      </button>
    </div>
    <!--notes-->
    <div class="d-none">
      NHS number (override to allow hospital number instead, with dismissable
      popup)<br />
      Postcode<br />
      <hr />
      Clinical features:<br />
      Protocol start date/time<br />
      pH<br />
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
</style>
