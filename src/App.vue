<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <div class="wrapper d-flex justify-content-center">
      <nav>
        <button class="btn btn-primary">
          <RouterLink class="text-white" to="/">UserCart</RouterLink>
        </button>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style lang="scss">
@import './assets/all.scss';
</style>
