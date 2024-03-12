<script setup>
import { RouterLink, RouterView } from "vue-router";
import { config } from "../assets/config.js";
</script>

<template>
  <footer id="footer" class="footer mt-auto">
    <nav class="navbar bg-red justify-content-center">
      <ul class="navbar-nav nav-pills flex-row align-items-center">
        <li class="nav-item">
          <a
            class="nav-link text-white p-2 mx-2"
            :href="config.bsped"
            target="_blank"
            ><img class="bsped-logo" src="@/assets/bsped.png"
          /></a>
        </li>
        <li class="nav-item d-none d-md-block">
          <a
            class="nav-link text-white p-2 mx-2"
            :href="config.repo"
            target="_blank"
            >DKA Calculator v{{ config.version }}</a
          >
        </li>
        <li class="nav-item d-none d-md-block">
          <a
            class="nav-link text-white p-2 mx-2"
            :href="config.web"
            target="_blank"
            >Created by {{ config.author }}</a
          >
        </li>
      </ul>
      <ul class="navbar-nav nav-pills flex-row">
        <li class="nav-item d-none d-sm-block">
          <a
            class="nav-link text-white p-2 mx-2"
            :href="'mailto:' + config.email"
            target="_blank"
            >{{ config.email }}</a
          >
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link text-white p-2 mx-2" to="/privacy-policy"
            >Privacy policy</RouterLink
          >
        </li>
      </ul>
    </nav>
  </footer>
</template>

<style scoped>
.bsped-logo {
  width: 100px;
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
