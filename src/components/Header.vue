<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <nav id="header" class="navbar bg-grey">
    <div class="container-fluid">
      <RouterLink
        to="/"
        class="navbar-brand d-flex flex-row flex-wrap align-items-center justify-content-center"
        ><img alt="BSPED logo" class="logo" src="@/assets/bsped.png" />
        <h1 class="display-5 mx-4 my-0">Paediatric DKA Calculator</h1></RouterLink
      >
    </div>
  </nav>
</template>

<style scoped>
.logo {
  width: 10vw;
}
.site-title {
  font-size: 3vw;
  margin: 0;
  margin-left: 10px;
}
.navbar {
  padding: 0;
}
@media only screen and (max-width: 600px) {.logo {
  width: 40vw;
}}
</style>
