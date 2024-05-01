<script setup></script>

<template>
  <div class="container my-4 needs-validation">
    <h2 class="display-3">Page not found (404)</h2>
    <p class="mx-1">The page you are trying to reach was not found.</p>
    <div class="text-center my-5">
      <button
        type="button"
        @click="$router.push('/')"
        class="btn btn-lg btn-primary"
      >
        Go to start page
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
</style>
