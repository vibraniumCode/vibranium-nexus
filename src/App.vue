<template>
  <div>
    <!-- ✅ SessionWarning SIEMPRE visible cuando estás autenticado -->
    <SessionWarning v-if="isAuthenticated" />

    <!-- Layout dinámico -->
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import SessionWarning from "@/components/SessionWarning.vue";

const route = useRoute();
const isAuthenticated = ref(false);

// Verificar si hay token
onMounted(() => {
  const token = localStorage.getItem("token");
  isAuthenticated.value = !!token;
  console.log("✅ TOKEN DETECTADO:", !!token);
});

// ✅ Cambiar layout según la meta de la ruta
const layout = computed(() => {
  return route.meta.layout === "auth" ? AuthLayout : DashboardLayout;
});
</script>
