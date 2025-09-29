<template>
  <div class="relative">
    <div
      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
    >
      <svg
        class="h-5 w-5 text-gray-400"
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
    <input
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      type="text"
      :placeholder="placeholder"
      class="block pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
      :class="widthClass"
    />

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
