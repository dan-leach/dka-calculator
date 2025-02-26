<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

//manage loading state while config data fetched
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
let load = ref({
  pending: true,
  failed: "",
});

//fetching the config data
import { fetchConfig } from "./assets/fetchConfig";
const loadConfigData = () => {
  //show the loading spinner
  load.value.pending = true;

  //clear the failed message in case of retry
  load.value.failed = "";

  fetchConfig()
    .then((config) => {
      if (config.api.showConsole) {
        console.log("Config fetched successfully:", config);
      }
      load.value.pending = false;
    })
    .catch((error) => {
      if (Array.isArray(error)) error = error.map((e) => e.msg).join(" ");
      console.error("Failed to fetch config:", error);
      load.value.failed =
        error.toString() || "Failed to load configuration data";
      load.value.pending = false;
    });
};

onMounted(() => {
  loadConfigData();
});
</script>

<template>
  <div v-if="load.failed" class="container-fluid m-3">
    <h4>Sorry, something went wrong...</h4>
    <p>
      If this keeps happening please contact
      <a href="mailto:admin@dka-calculator.co.uk">admin@dka-calculator.co.uk</a>
      including the error message show below:<br />
      <code>{{ load.failed }}</code>
    </p>
    <button type="button" @click="loadConfigData" class="btn btn-primary mb-4">
      Retry
    </button>
  </div>

  <loading v-else-if="load.pending" v-model:active="load.pending" />
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
