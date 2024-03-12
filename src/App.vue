<script setup>
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <Header />
    <div id="app-view" class="m-2">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>
