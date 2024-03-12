<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>

<template>
  <div class="container my-4">
    <h2 class="display-3">Patient details</h2>
    <p class="ms-1">
      To generate a care pathway for your patient please complete the form
      below. For more information about how this data is used click the
      <font-awesome-icon :icon="['fas', 'circle-info']" /> icon by each field or
      refer to the
      <RouterLink to="/privacy-policy" class="">privacy policy</RouterLink>.
    </p>
    <!--patientName-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="patientName"
            placeholder="x"
          />
          <label for="patientName">Full name</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#patientNameHelp"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div class="collapse form-text" id="patientNameHelp">
        Patient name is printed onto the generated care pathway document in the
        patient demographics area. It is not stored by the DKA Calculator.
      </div>
    </div>
    <!--patientDOB-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="date"
            class="form-control"
            id="patientDOB"
            placeholder="x"
          />
          <label for="patientDOB">Date of birth</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#patientDOBHelp"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div class="collapse form-text" id="patientDOBHelp">
        Patient date of birth is printed onto the generated care pathway
        document in the patient demographics area. It is not stored directly by
        the DKA Calculator, but is used to calculate a patient age (in years)
        which is stored for audit purposes.
      </div>
    </div>
    <!--patientSex-->
    <div class="mb-4">
      <div class="d-flex justify-content-center">
        <div>
          <input
            type="radio"
            class="btn-check"
            name="options"
            id="male"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary me-2" for="male">Male</label>

          <input
            type="radio"
            class="btn-check"
            name="options"
            id="female"
            autocomplete="off"
          />
          <label class="btn btn-outline-secondary" for="female">Female</label>
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            data-bs-toggle="collapse"
            data-bs-target="#patientSexHelp"
            class="ms-2"
          />
        </div>
      </div>
      <div class="collapse form-text" id="patientSexHelp">
        Patient sex is stored by the DKA Calculator for audit purposes.
      </div>
    </div>
    <!--patientNumber-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="number"
            class="form-control"
            id="patientNumber"
            placeholder="x"
          />
          <label for="patientNumber">NHS number</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#patientNumberHelp"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div class="collapse form-text" id="patientNumberHelp">
        Patient NHS (or hospital number) is printed onto the generated care
        pathway document in the patient demographics area. It is not stored
        directly by the DKA Calculator. To allow linkage of audit data between
        episodes the NHS number is used to generate a unique patient ID which is
        stored. The patient's NHS number cannot be found from the calculated
        unique patient ID (<a
          href="https://www.codecademy.com/resources/blog/what-is-hashing/"
          target="_blank"
          >read more about secure hashing</a
        >).
      </div>
    </div>
    <!--patientPostcode-->
    <div class="mb-4">
      <div class="input-group">
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="patientName"
            placeholder="x"
          />
          <label for="patientPostcode">Postcode</label>
        </div>
        <span
          class="input-group-text"
          data-bs-toggle="collapse"
          data-bs-target="#patientPostcodeHelp"
          ><font-awesome-icon :icon="['fas', 'circle-info']"
        /></span>
      </div>
      <div class="collapse form-text" id="patientPostcodeHelp">
        The patient postcode is not stored by the DKA Calculator. It is used to
        find an Index of Multiple Deprivation (IMD) decile which is stored for
        audit purposes.
      </div>
    </div>
    <!--next-->
    <div class="text-center">
      <button type="button" class="btn btn-lg btn-red">Continue</button>
    </div>
    <!--notes-->
    <div class="d-none">
      NHS number (override to allow hospital number instead, with dismissable
      popup)<br />
      Postcode<br />
      <hr />
      Clinical features:<br />
      Protocol start date/time<br />
      pH<br />
      Weight<br />
      Shock<br />
      Pre-existing diabetes<br />
      Insulin rate<br />
      <hr />
      Region<br />
      Centre<br />
      Training/real<br />
      Audit ID - patient(auto)<br />
      Audit ID - episode(auto)<br />
      IMD(auto)<br />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 750px;
}
.btn-outline-secondary {
  width: 150px;
}
a {
  color: black;
}
</style>
