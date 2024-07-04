<script setup>
import { config } from "../assets/config.js";
</script>

<template>
  <div class="container my-4 needs-validation">
    <div class="card border-danger mb-3">
      <div class="card-body">
        <h5 class="card-title">Development version</h5>
        <p class="card-text">
          This development version is for demonstration/testing of the
          forthcoming 2024 update.
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
      <a :href="config.bsped.dkaGuidelines" target="_blank"
        >BSPED 2021 Guidelines</a
      >. Calculations in the care pathway are be pre-filled based on the values
      you provide for your patient.
    </p>
    <p class="mx-1">
      If you encounter problems using this tool, a backup version of the care
      pathway (without pre-filled calculations) can be downloaded
      <a href="/DKA-ICP-2021.pdf" target="_blank">here</a>.
    </p>
    <div class="card border-warning mb-3">
      <div class="card-body">
        <h5 class="card-title">What's new in the 2024 update?</h5>
        <p class="card-text">
          The DKA Calculator has had a number of changes to improve the user
          experience and audit data collection.
          <a href="#" data-bs-toggle="collapse" data-bs-target="#changes"
            >Read more about these changes...</a
          >
        </p>
        <div class="collapse my-2" id="changes">
          <ul>
            <li>
              General user interface and user experience improvements by moving
              to single page application structure using Vue 3.
            </li>
            <li>
              The code to perform calculation of variables for the care pathway
              is now run on the server. Once the calculations are returned to
              your device the care pathway document is generated locally.
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
              pH must be <= 7.3 or bicarbonate must be < 15 mmol/L. If these
              thresholds are not met the an error will be shown which must be
              corrected before a care pathway can be generated.
            </li>
            <li>
              The patient ethnic group is now collected for audit purposes.
            </li>
            <li>
              The insulin delivery method the patient uses (if they have
              pre-existing diabetes) is now collected for audit purposes.
            </li>
            <li>
              Factors that may have contributed to the episode of DKA occuring
              (preventable factors) are now collected for audit purposes.
            </li>
          </ul>
        </div>
      </div>
    </div>
    <p class="nx-1">
      We're always trying to improve the DKA Calculator. If you have suggestions
      or queries, please contact
      <a :href="'mailto:' + config.author.email">{{ config.author.email }}</a
      >.
    </p>
    <div class="text-center my-5">
      <button
        type="button"
        @click="$router.push('/form-disclaimer')"
        class="btn btn-lg btn-primary"
      >
        Start
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
</style>
