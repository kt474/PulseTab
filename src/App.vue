<script setup lang="ts">
import Main from "./components/Main.vue";
import { Analytics } from "@vercel/analytics/vue";
</script>

<template>
  <Analytics />
  <Main />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
