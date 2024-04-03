<script setup>
import { config } from "../assets/config.js";
</script>

<template>
  <footer id="footer" class="footer mt-auto">
    <nav
      class="navbar bg-grey d-flex flex-column align-items-start justify-content-start"
    >
      <div class="mb-3 mx-4 d-none d-md-block">
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
          with the <a :href="config.bsped.main" target="_blank">BSPED</a> DKA
          special interest group.
          <span class="ms-4" v-if="config.author.acknowledgement">
            {{ config.author.acknowledgement }}
          </span>
        </p>
      </div>
      <div class="mb-3 mx-4 d-flex align-items-center">
        <img class="ukca me-2" src="@/assets/UKCA.png" />
        <p class="footer-text">
          The <a :href="config.bsped.main" target="_blank">BSPED</a>
          {{ config.appName }} is registered as a medical device in the UK.
        </p>
      </div>
      <div class="mx-4">
        <div class="footer-text">
          {{ config.disclaimer }}
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
