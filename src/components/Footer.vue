<script setup>
import { RouterLink } from "vue-router";
import { config } from "../assets/config.js";
</script>

<template>
  <footer id="footer" class="footer mt-auto">
    <nav
      class="navbar bg-grey d-flex flex-column align-items-start justify-content-start"
    >
      <div class="m-2 d-none d-md-block">
        <p class="footer-text">
          <span
            ><strong>{{ config.appName }}&nbsp;</strong>
            <a :href="config.repo.changelog" target="_blank"
              >Version {{ config.version }}</a
            ></span
          >
          <span class="ms-4"
            >Correspondance:
            <a :href="'mailto:' + config.author.email">{{
              config.author.email
            }}</a></span
          >
        </p>
        <p class="footer-text">
          Created by
          <a :href="config.author.url" target="_blank">{{
            config.author.name
          }}</a>
          with the BSPED DKA special interest group.
          <span v-if="config.author.acknowledgement">
            {{ config.author.acknowledgement }}
          </span>
        </p>
      </div>
      <div class="d-flex align-items-center m-2">
        <img class="ukca me-2" src="@/assets/UKCA.png" />
        <p class="footer-text">
          The BSPED Paediatric DKA Calculator is registered as a medical device
          in the UK.
        </p>
      </div>
      <div class="m-2">
        <div class="footer-text">
          <strong>{{ config.disclaimer }}</strong>
        </div>
      </div>
    </nav>
  </footer>
</template>

<style scoped>
.ukca {
  width: 40px;
  height: 40px;
}
.footer-text {
  color: black;
  text-decoration: none;
  margin: 0;
}
</style>
