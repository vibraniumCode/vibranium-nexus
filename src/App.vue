<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const route = useRoute();

// ✅ Cambiar layout según la meta de la ruta
const layout = computed(() => {
  return route.meta.layout === "auth" ? AuthLayout : DashboardLayout;
});
</script>
