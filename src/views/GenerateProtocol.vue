<script setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { data } from "../assets/data.js";
import { config } from "../assets/config.js";
import Swal from "sweetalert2";
import router from "../router";
import { api } from "@/assets/api.js";

const fetchCalculations = () => {
  let payload = {}
  for (let input in data.value.inputs) payload[input] = data.value.inputs[input].val
  delete payload.patientName
  if (payload.patientNHS) {
    delete payload.patientHospNum
  } else {
    delete payload.patientNHS
  }
  payload.patientAge = data.value.inputs.patientDOB.patientAge.val
  payload.weightLimitOverride = data.value.inputs.weight.limit.override
  payload.appVersion = config.version
  payload.clientDatetime = new Date();
  payload.clientUseragent = navigator.userAgent
  console.log(payload)
  //replace data.value.demoInputs with payload
  api('fetchCalculations', data.value.demoInputs)
    .then(
      function (res) {
        Swal.fire({
          html: res
        })
      },
      function (error) {
        Swal.fire({
          html: error
        })
      }
    )
}

onMounted(() => {
  /*if (!data.value.form.isValid(3)) {
    router.push("/form-audit-details");
  } else {
    fetchCalculations()
  }*/
  fetchCalculations()
});
</script>

<template>
  <div class="container my-4 needs-validation">
    <h2 class="display-3">Generate protocol</h2>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
.btn-outline-secondary {
  width: 150px;
}
</style>
