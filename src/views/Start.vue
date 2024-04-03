<script setup>
import { config } from "../assets/config.js";
</script>

<template>
  <div class="container my-4 needs-validation">
    <h2 class="display-3">Welcome</h2>
    <p class="mx-1">
      Use this tool to generate an integrated care pathway for managing
      paediatric diabetic ketoacidosis based on the
      <a :href="config.bsped.dkaGuidelines" target="_blank"
        >BSPED 2021 Guidelines</a
      >. Calculations in the pathway will be pre-filled based on the values you
      provide for your patient.
    </p>
    <p class="mx-1">
      If you encounter problems, a backup version of the ICP (without pre-filled
      calculations) can be downloaded
      <a href="/DKA-ICP-2021.pdf" target="_blank">here</a>.
    </p>
    <div class="text-center my-5">
      <button
        type="button"
        @click="$router.push('/form-disclaimer')"
        class="btn btn-lg btn-primary"
      >
        Start
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
</style>
