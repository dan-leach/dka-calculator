<script setup>
import { inject } from "vue";
const config = inject("config");
</script>

<template>
  <div class="container my-4 needs-validation">
    <div
      class="card border-danger mb-3"
      v-if="config.client.underDevelopment || config.api.underDevelopment"
    >
      <div class="card-body">
        <h5 class="card-title">Development version</h5>
        <p class="card-text">
          This development version is for demonstration/testing forthcoming
          updates.
          <br />Do NOT use for real clinical cases. Use
          <a href="https://dka-calculator.co.uk">dka-calculator.co.uk</a> for
          real patients.
        </p>
      </div>
    </div>

    <h2 class="display-3">Welcome</h2>
    <p class="mx-1">
      The BSPED Paediatric DKA Calculator allows clinicians to generate an
      individualised care pathway for managing paediatric diabetic ketoacidosis
      based on the
      <a :href="config.organisations.bsped.dkaGuidelines" target="_blank"
        >BSPED 2021 Guidelines</a
      >. Calculations in the care pathway are be pre-filled based on the values
      you provide for your patient.
    </p>
    <p class="mx-1">
      If you encounter problems using this tool, a backup version of the care
      pathway (without pre-filled calculations) can be downloaded
      <a href="/DKA-ICP-v1.7.pdf" target="_blank">here</a>.
    </p>
    <div class="card border-warning mb-3">
      <div class="card-body">
        <h5 class="card-title">What's new in the December 2025 update?</h5>
        <p class="card-text">
          The retrospective audit process has been improved.
          <a href="#" data-bs-toggle="collapse" data-bs-target="#changes"
            >Read more about these changes...</a
          >
        </p>
        <div class="collapse my-2" id="changes">
          <ul>
            <li>
              If an NHS number was not provided at the time of generating the
              care pathway, it is now possible to enter one retrospectively to
              allow audit data to be collected.
            </li>
            <li>
              If the calculator was not used for a DKA episode it is now
              possible to add the episode retrospectively for audit purposes
              (without generating a care pathway).
            </li>
            <li>
              The retrospective audit process is easier due to the addition of
              QR codes to the care pathway.
            </li>
          </ul>
          You can
          <a :href="config.client.repo.changelog" target="_blank"
            >read the full changelog here</a
          >.
        </div>
      </div>
    </div>
    <p class="nx-1">
      We're always trying to improve the DKA Calculator. If you have suggestions
      or queries, please contact
      <a :href="'mailto:' + config.author.email">{{ config.author.email }}</a
      >.
    </p>
    <div class="d-grid gap-2 mb-4">
      <button
        type="button"
        @click="$router.push('/form-disclaimer')"
        class="btn btn-lg btn-primary btn-block"
      >
        Start
      </button>
    </div>

    <div class="card border-info mb-3">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <p class="flex-grow-1 m-0">Provide audit data for a DKA episode</p>
          <button
            type="button"
            class="btn btn-secondary my-2"
            @click="$router.push('/form-retrospective-start')"
          >
            Update
          </button>
        </div>
      </div>
    </div>

    <div class="card border-info mb-3">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <p class="flex-grow-1 m-0">
            Calculate the corrected sodium and effective osmolality using a
            measured sodium and glucose for your patient
          </p>
          <button
            type="button"
            class="btn btn-secondary my-2"
            @click="$router.push('/sodium-osmo')"
          >
            Calcuate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
.btn-secondary {
  min-width: 100px;
  height: 40px;
}
.btn-lg {
  font-size: 30px;
}
</style>
