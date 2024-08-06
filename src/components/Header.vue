<script setup>
import { RouterLink, useRoute } from "vue-router";
import { config } from "../assets/config.js";
</script>

<template>
  <nav id="header" class="navbar bg-grey">
    <div class="container-fluid">
      <RouterLink
        to="/"
        class="navbar-brand d-flex flex-row flex-wrap align-items-center justify-content-center"
        ><img alt="BSPED logo" class="logo" src="@/assets/bsped.png" />
        <h1 class="display-5 mx-4 my-0">
          {{ config.appName }}
        </h1>
      </RouterLink>
      <h2 class="text-danger">
        {{ config.underDevelopment ? "Development version" : "" }}
      </h2>
      <RouterLink
        to="/update"
        v-if="useRoute().name == 'start'">
        <button
          type="button"
          class="btn btn-secondary"
        >
          Update audit data
        </button>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.logo {
  width: 10vw;
}
.site-title {
  font-size: 3vw;
  margin: 0;
  margin-left: 10px;
}
.navbar {
  padding: 0;
}
@media only screen and (max-width: 600px) {
  .logo {
    width: 40vw;
  }
}
</style>
