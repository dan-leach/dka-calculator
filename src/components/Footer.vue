<script setup>
import { inject } from "vue";
const config = inject("config");
</script>

<template>
  <footer id="footer" class="footer mt-auto">
    <nav
      class="navbar bg-grey d-flex flex-column align-items-start justify-content-start"
    >
      <div class="mb-2 mx-4 d-none d-md-block">
        <p class="footer-text">
          <span
            ><strong>{{ config.appName }}&nbsp;</strong> Client
            <a :href="config.client.repo.changelog" target="_blank"
              >v{{ config.client.version }}</a
            >
            | API
            <a :href="config.api.repo.changelog" target="_blank"
              >v{{ config.api.version }}</a
            >
            | ICP
            <a :href="config.organisations.bsped.dkaGuidelines" target="_blank"
              >v{{ config.organisations.bsped.icpVersion }}</a
            ></span
          >
        </p>
        <p class="footer-text">
          Created and maintained by
          <a :href="config.author.url" target="_blank">{{
            config.author.name
          }}</a>
          on behalf of
          <a :href="config.organisations.bsped.main" target="_blank">BSPED</a>.
          <span class="ms-4"
            >Correspondance:
            <a :href="'mailto:' + config.author.email">{{
              config.author.email
            }}</a></span
          >
        </p>
        <p class="footer-text" v-if="config.author.contributors">
          Contributors to the current version:
          <span v-html="config.author.contributors.current"></span>.
          <span class="ms-4"
            ><a :href="config.author.contributors.url" target="_blank"
              >See all contributors</a
            >.</span
          >
        </p>
      </div>
      <div class="mb-1 mx-4 d-flex align-items-center">
        <img class="ukca me-2" src="@/assets/UKCA.png" />
        <p class="footer-text">
          The
          <a :href="config.organisations.bsped.main" target="_blank">BSPED</a>
          {{ config.appName }} is registered as a medical device in the UK.<br />{{
            config.disclaimer
          }}
        </p>
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
@media (max-width: 600px) {
  .footer-text {
    font-size: 14px; /* Smaller font size for small screens */
  }
}
</style>
