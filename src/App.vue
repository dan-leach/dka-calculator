<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

import { config, fetchConfig } from "./assets/fetchConfig";

let load = ref({
  pending: true,
  failed: "",
});

const loadConfigData = () => {
  fetchConfig()
    .then(() => {
      if (!config.value.appName)
        throw new Error("Failed to load configuration data");
      load.value.pending = false;
    })
    .catch((error) => {
      console.error(error);
      load.value.failed = error.message || "Failed to load configuration data";
      load.value.pending = false;
    });
};

onMounted(() => {
  loadConfigData();
});
</script>

<template>
  <div v-if="load.failed">{{ load.failed }}</div>
  <div v-else-if="load.pending">Loading...</div>
  <div v-else class="d-flex flex-column vh-100">
    <Header />
    <div id="app-view" class="m-2">
      <router-view v-slot="{ Component }">
        <Transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
