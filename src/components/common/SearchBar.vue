<template>
  <div class="relative">
    <div class="relative group">
      <!-- Ícono -->
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <svg
          class="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Input -->
      <input
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        type="text"
        :placeholder="placeholder"
        class="block pl-10 pr-3 py-2 border border-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:ring-0 transition-colors duration-200 group-hover:border-indigo-600"
        :class="widthClass"
      />
    </div>

    <!-- Badge de resultados (opcional) -->
    <div
      v-if="showResultCount && modelValue && resultCount !== null"
      class="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        {{ resultCount }} resultado{{ resultCount !== 1 ? "s" : "" }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    widthClass?: string;
    showResultCount?: boolean;
    resultCount?: number | null;
  }>(),
  {
    placeholder: "Búsqueda general...",
    widthClass: "w-80",
    showResultCount: false,
    resultCount: null,
  }
);

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
