<script setup>
import { config } from "../assets/config.js";
</script>

<template>
  <div class="container my-4 needs-validation">
    <h2 class="display-3">Welcome</h2>
    <p class="mx-1">
      The BSPED Paediatric DKA Calculator allows clinicians to generate an
      individualised care pathway for managing paediatric diabetic ketoacidosis
      based on the
      <a :href="config.bsped.dkaGuidelines" target="_blank"
        >BSPED 2021 Guidelines</a
      >. Calculations in the care pathway are be pre-filled based on the values
      you provide for your patient.
    </p>
    <p class="mx-1">
      If you encounter problems using this tool, a backup version of the care
      pathway (without pre-filled calculations) can be downloaded
      <a href="/DKA-ICP-2021.pdf" target="_blank">here</a>.
    </p>
    <p class="nx-1">
      We're always trying to improve the DKA Calculator. If you have suggestions
      or queries, please contact
      <a :href="'mailto:' + config.author.email">{{ config.author.email }}</a
      >.
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
