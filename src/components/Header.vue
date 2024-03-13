<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <nav id="header" class="navbar bg-grey">
    <div class="container-fluid m-1">
      <RouterLink
        to="/"
        class="navbar-brand d-flex flex-row flex-wrap align-items-center"
        ><img
          alt="Paediatric DKA Calculator logo"
          class="logo"
          src="@/assets/logo.png"
        />
        <h1 class="site-title">Paediatric DKA Calculator</h1></RouterLink
      >
    </div>
  </nav>
</template>

<style scoped>
.logo {
  width: 50px;
}
.site-title {
  font-size: 3vw;
  margin: 0;
  margin-left: 10px;
}
</style>
