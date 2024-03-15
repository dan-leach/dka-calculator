<script setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { data } from "../assets/data.js";
import Swal from "sweetalert2";
import router from "../router";

let showErrors = ref(false);

const continueClick = () => {
  console.log(data.value.inputs.protocolStartDatetime.val);
  showErrors.value = true;
  document.getElementById("form3").classList.add("was-validated");
  if (data.value.forms.part2.isValid()) router.push("/form-part-3");
};

onMounted(() => {
  //if (!data.value.forms.part1.isValid) router.push("/form-part-1");
  //if (!data.value.forms.part2.isValid) router.push("/form-part-2");
});
</script>

<template>
  <form id="form3" class="container my-4 needs-validation">
    <h2 class="display-3">Additional details</h2>
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
