<script setup>
import { RouterLink, RouterView } from "vue-router";
import { config } from "./assets/config.js";
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <nav id="header" class="navbar bg-red">
      <div class="container-fluid">
        <RouterLink to="/" class="navbar-brand"
          ><img
            alt="BSPED Paediatric DKA Calculator logo"
            class="logo"
            src="@/assets/logo.png"
        /></RouterLink>
        <p class="fs-3 text-white">
          This version of the DKA Calculator is under development
        </p>
      </div>
    </nav>
    <div id="app-view">
      <RouterView />
    </div>
    <footer id="footer" class="footer mt-auto">
      <nav class="navbar bg-red justify-content-center">
        <ul class="navbar-nav nav-pills flex-row">
          <li class="nav-item">
            <a
              class="nav-link text-white p-2 mx-2"
              :href="config.repo"
              target="_blank"
              >BSPED DKA Calculator v{{ config.version }}</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link text-white p-2 mx-2"
              :href="config.web"
              target="_blank"
              >Created by {{ config.author }}</a
            >
          </li>
        </ul>
        <ul class="navbar-nav nav-pills flex-row">
          <li class="nav-item">
            <a
              class="nav-link text-white p-2 mx-2"
              :href="'mailto:' + config.email"
              target="_blank"
              >Contact: {{ config.email }}</a
            >
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link text-white p-2 mx-2"
              to="/privacy-policy"
              >Privacy policy</RouterLink
            >
          </li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
.logo {
  width: 20vw;
  min-width: 150px;
  max-width: 180px;
}
.footer-spacer {
  min-height: 70px;
}

.nav-link.active {
  background-color: #850000;
  color: white;
}
.nav-link:hover {
  background-color: #ff0000;
  color: white;
}
</style>
