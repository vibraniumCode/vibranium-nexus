<template>
  <!-- Alert Container -->
  <div
    v-if="isVisible"
    class="fixed top-4 right-4 z-50 animate-slide-in"
    :class="positionClass"
  >
    <div
      class="flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-md border"
      :class="[typeClasses.bg, typeClasses.border, typeClasses.text]"
    >
      <!-- Icono -->
      <div class="flex-shrink-0">
        <component :is="typeClasses.icon" class="w-5 h-5" />
      </div>

      <!-- Contenido -->
      <div class="flex-1">
        <p class="font-semibold text-sm">{{ title }}</p>
        <p v-if="message" class="text-xs opacity-90">{{ message }}</p>
      </div>

      <!-- Botón cerrar -->
      <button
        @click="close"
        class="flex-shrink-0 opacity-70 hover:opacity-100 transition"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  CheckCircleIcon,
  ExclamationIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/solid";

export interface AlertProps {
  title: string;
  message?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number; // millisegundos, 0 = no cierra automáticamente
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const props = withDefaults(defineProps<AlertProps>(), {
  type: "info",
  duration: 4000,
  position: "top-right",
});

const isVisible = ref(true);

const typeClasses = computed(() => {
  const styles = {
    success: {
      bg: "bg-slate-900/80 border-emerald-500/30",
      border: "border-emerald-500/30",
      text: "text-emerald-100",
      icon: CheckCircleIcon,
    },
    error: {
      bg: "bg-slate-900/80 border-red-500/30",
      border: "border-red-500/30",
      text: "text-red-100",
      icon: XCircleIcon,
    },
    warning: {
      bg: "bg-slate-900/80 border-yellow-500/30",
      border: "border-yellow-500/30",
      text: "text-yellow-100",
      icon: ExclamationIcon,
    },
    info: {
      bg: "bg-slate-900/80 border-blue-500/30",
      border: "border-blue-500/30",
      text: "text-blue-100",
      icon: InformationCircleIcon,
    },
  };

  return styles[props.type];
});

const positionClass = computed(() => {
  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };
  return positions[props.position];
});

const close = () => {
  isVisible.value = false;
};

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close();
    }, props.duration);
  }
});
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>
