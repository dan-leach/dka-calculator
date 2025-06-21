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
            <a :href="config.client.repo.icpChangelog" target="_blank"
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
      <div
        class="ukca-div mb-1 mx-4 d-flex align-items-center p-2"
        data-bs-toggle="modal"
        data-bs-target="#ukcaModal"
        style="cursor: pointer"
      >
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

  <!-- Modal -->
  <div
    class="modal fade"
    id="ukcaModal"
    tabindex="-1"
    aria-labelledby="ukcaModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">BSPED {{ config.appName }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <table class="table align-middle">
            <tr>
              <td class="left-col">Version</td>
              <td>
                Client
                <a
                  :href="config.client.repo.changelog"
                  target="_blank"
                  class="p-0"
                  >v{{ config.client.version }}</a
                >
                | API
                <a :href="config.api.repo.changelog" target="_blank" class="p-0"
                  >v{{ config.api.version }}</a
                >
                | ICP
                <a
                  :href="config.client.repo.icpChangelog"
                  target="_blank"
                  class="p-0"
                  >v{{ config.organisations.bsped.icpVersion }}</a
                >
              </td>
            </tr>
            <br />
            <tr>
              <td class="left-col">Last updated</td>
              <td>{{ config.lastUpdated }}</td>
            </tr>
            <br />
            <tr>
              <td class="left-col">
                <font-awesome-icon :icon="['fas', 'industry']" size="2xl" />
              </td>
              <td>
                <a
                  :href="config.organisations.bsped.main"
                  target="_blank"
                  class="p-0"
                  >British Society for Paediatric Endocrinology and Diabetes</a
                ><br />
                c/o BioScientifica Ltd<br />
                Starling House<br />
                1600 Bristol Parkway North<br />
                Bristol<br />
                BS34 8YU
              </td>
            </tr>
            <br />
            <tr>
              <td class="left-col">Correspondance</td>
              <td>
                <a :href="'mailto:' + config.author.email" class="p-0">{{
                  config.author.email
                }}</a>
              </td>
            </tr>
            <br />
            <tr>
              <td class="left-col">
                <font-awesome-icon
                  :icon="['fas', 'triangle-exclamation']"
                  size="2xl"
                />
              </td>
              <td>
                This application should only be used by medical
                professionals.<br />
                Decisions about patient care remain the treating clinician's
                responsibility.<br />
                You must ensure the input values provided are accurate and that
                output values are checked carefully for suitability before
                use.<br />
                Use of the application requires agreement to the legal
                disclaimer and privacy policy.
              </td>
            </tr>
            <br />
            <tr>
              <td class="ukca-col">
                <img class="ukca-modal-img" src="@/assets/UKCA.png" />
              </td>
              <td>
                The BSPED Paediatric DKA Calculator is registered as a medical
                device in the UK.
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ukca {
  width: 40px;
  height: 40px;
}

.ukca-modal-img {
  width: 60px;
  height: 60px;
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

.ukca-div {
  transition: all 0.3s ease;
  border: 2px solid #000000;
  border-radius: 8px;
}

.ukca-div:hover {
  background-color: rgba(255, 255, 102, 0.3); /* Light yellow highlight */
}

.left-col {
  font-weight: bold;
  float: right;
  margin-right: 25px;
}
.ukca-col {
  display: flex;
  justify-content: flex-end;
  margin-right: 25px;
}
table {
  border-spacing: 0 25px; /* Adds 10px space between rows */
}
</style>
