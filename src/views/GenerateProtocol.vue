<script setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { data } from "../assets/data.js";
import Swal from "sweetalert2";
import router from "../router";

onMounted(() => {
  if (!data.value.form.isValid(3)) router.push("/form-audit-details");
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
