<script setup></script>

<template>
  <div class="container my-4 needs-validation">
    <h2 class="display-3">Welcome</h2>
    <p class="mx-1">Click start below to begin.</p>
    <div class="text-center">
      <button
        type="button"
        @click="$router.push('/form-part-1')"
        class="btn btn-lg btn-primary"
      >
        Start
      </button>
    </div>
  </div>
</template>
