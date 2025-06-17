<script setup>
import { inject } from "vue";
const config = inject("config");
</script>

<template>
  <div class="container my-4 needs-validation">
    <div class="card border-danger mb-3" v-if="config.underDevelopment">
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
      <a href="/DKA-ICP-v1.5.pdf" target="_blank">here</a>.
    </p>
    <div class="card border-warning mb-3">
      <div class="card-body">
        <h5 class="card-title">What's new in the February 2025 update?</h5>
        <p class="card-text">
          The DKA Calculator has had a number of changes to improve the user
          experience and audit data collection.
          <a href="#" data-bs-toggle="collapse" data-bs-target="#changes"
            >Read more about clinically relevant changes...</a
          >
        </p>
        <div class="collapse my-2" id="changes">
          <ul>
            <li>
              There is now a facility to update limited episode data after
              submission. This is currently limited to preventable factors,
              pre-existing diabetes status, end date/time of the DKA protocol,
              and cerebral oedema questions. This may be expanded in the future.
            </li>
            <li>
              You can
              <a href="/sodium-osmo"
                >corrected sodium and effective osmolality</a
              >
              using a tool (not part of the main DKA Calcuator process)
            </li>
            <li>
              DKA severity grade selection has changed to include consideration
              of bicarbonate level. If provided, a severity level will be
              selected based on both pH and bicarbonate with the more severe
              option used if these differ.
            </li>
            <li>
              A unique patient hash is generated from the patient NHS number and
              date of birth using a cryptographic algorithm. This allows
              episodes relating to the same patient to be linked for audit
              purposes. It does not allow the NHS number or date of birth for
              your patient to be identified from the hash.
            </li>
            <li>
              The patient postcode is used to derive an index of multiple
              deprivation (IMD) decile which is stored for audit purposes. The
              postcode is not stored.
            </li>
            <li>
              Bicarbonate, glucose and ketones may now optionally be entered and
              will be printed on the care pathway if provided. Bicarbonate is
              used for severity scoring as above.
            </li>
            <li>
              Previously a care pathway could be generated even if the
              diagnostic thresholds for DKA were not met. A check to prevent
              this has been added. Ketones, if provided, must be above 3 mmol/L.
              pH must be <= 7.3 or bicarbonate must be < 15mmol/L.
            </li>
            <li>
              The patient ethnic group, the insulin delivery method the patient
              uses (if they have pre-existing diabetes), and any factors that
              may have contributed to the episode of DKA occuring (preventable
              factors) are now collected for audit purposes.
            </li>
            <li>
              When the patient has pre-existing diabetes ticks are automatically
              added to the not applicable boxes for ongoing insulin therapy for
              the mode the patient does not use on flow chart 5.
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
          <p class="flex-grow-1 m-0">
            Update audit data for a patient with an existing audit ID
          </p>
          <button
            type="button"
            class="btn btn-secondary my-2"
            @click="$router.push('/update')"
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
