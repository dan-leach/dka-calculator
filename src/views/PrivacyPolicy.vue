<script setup>
import router from "../router";
import { data } from "../assets/data.js";

import { inject } from "vue";
const config = inject("config");
</script>

<template>
  <div class="container my-4 needs-validation">
    <h2 class="display-3">Privacy policy</h2>
    <p>
      This policy explains how the data you enter into the DKA Calculator is
      used and stored. The overarching principle is that patient identifiable
      data does not leave the device on which you are generating the protocol,
      however some anonymised data is transmitted and stored for audit purposes.
    </p>
    <p>
      Data stored by the DKA Calculator can be requested by the clinical team
      for the treating centre to support local audit.
    </p>
    <p>
      If you have any questions please contact
      <a :href="'mailto:' + config.author.email">{{ config.author.email }}</a
      >.
    </p>
    <div v-for="input of data.inputs">
      <h3 v-if="input.privacyLabel">{{ input.privacyLabel }}</h3>
      <h3 v-else>{{ input.label }}</h3>
      <p v-html="input.privacyInfo" v-if="input.privacyInfo"></p>
      <p v-html="input.info" v-else></p>
    </div>
  </div>
</template>
