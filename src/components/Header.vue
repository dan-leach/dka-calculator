<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <nav id="header" class="navbar bg-grey">
    <div class="container-fluid m-1">
      <RouterLink
        to="/"
        class="navbar-brand d-flex flex-row flex-wrap align-items-center"
        ><img alt="BSPED logo" class="logo me-4" src="@/assets/bsped.png" />
        <h1 class="site-title">Paediatric DKA Calculator</h1></RouterLink
      >
    </div>
  </nav>
</template>

<style scoped>
.logo {
  width: 20vw;
}
.site-title {
  font-size: 4vw;
  margin: 0;
  margin-left: 10px;
}
.navbar {
  padding: 0;
}
</style>
