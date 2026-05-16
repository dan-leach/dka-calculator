<script setup>
import { data } from "../assets/data.js";
import router from "../router";
import { useFormGuard } from "../composables/useFormGuard.js";

const selectPurpose = (value) => {
  data.value.inputs.episodeType.val = value;
  data.value.inputs.episodeType.isValid();
  router.push("/form-patient-details");
};

useFormGuard(
  [{ formIndex: 1, redirect: "/form-disclaimer" }],
  () => { window.scrollTo(0, 0); }
);
</script>

<template>
  <div class="container my-4">
    <h2 class="display-3">Protocol purpose</h2>
    <h3
      class="retrospective-indicator text-danger mx-1"
      v-if="data.retrospectiveEpisode"
    >
      Adding retrospective episode
    </h3>
    <div class="mb-4">
      <p class="text-center m-2">
        {{ data.inputs.episodeType.label }}
      </p>
      <div class="d-flex flex-column flex-sm-row gap-3 mt-3 episode-type-container">
        <button
          type="button"
          class="btn btn-outline-secondary episode-type-btn py-3"
          :class="{ active: data.inputs.episodeType.val === 'real' }"
          @click="selectPurpose('real')"
        >
          For a real patient
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary episode-type-btn py-3"
          :class="{ active: data.inputs.episodeType.val === 'test' }"
          @click="selectPurpose('test')"
        >
          For testing or training purposes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
.episode-type-container {
  max-width: 500px;
  margin: 1rem auto 0;
}
.episode-type-btn {
  flex: 1;
  min-width: 0;
}
.retrospective-indicator {
  font-size: 1.5rem;
  font-weight: lighter;
}
</style>
