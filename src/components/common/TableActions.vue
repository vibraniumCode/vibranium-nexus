<template>
  <div class="flex items-center gap-2">
    <!-- Botón de Exportar -->
    <button
      v-if="showExport"
      @click="$emit('export')"
      :disabled="isExporting"
      class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span v-if="isExporting">Exportando...</span>
      <span v-else>{{ exportLabel }}</span>
    </button>

    <!-- Botón de Email -->
    <button
      v-if="showEmail"
      @click="$emit('email')"
      :disabled="isSendingEmail"
      class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span v-if="isSendingEmail">Enviando...</span>
      <span v-else>{{ emailLabel }}</span>
    </button>

    <!-- Botón de Imprimir (opcional) -->
    <button
      v-if="showPrint"
      @click="$emit('print')"
      class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
      {{ printLabel }}
    </button>

    <!-- Slot para acciones personalizadas -->
    <slot name="custom-actions"></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showExport?: boolean;
    showEmail?: boolean;
    showPrint?: boolean;
    exportLabel?: string;
    emailLabel?: string;
    printLabel?: string;
    isExporting?: boolean;
    isSendingEmail?: boolean;
  }>(),
  {
    showExport: true,
    showEmail: true,
    showPrint: false,
    exportLabel: "Exportar Reporte",
    emailLabel: "Enviar Email",
    printLabel: "Imprimir",
    isExporting: false,
    isSendingEmail: false,
  }
);

defineEmits<{
  export: [];
  email: [];
  print: [];
}>();
</script>
