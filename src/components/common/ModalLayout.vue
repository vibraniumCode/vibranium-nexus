<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center">
    <div
      class="absolute inset-0 bg-opacity-40 backdrop-blur-xs"
      @click="close"
    ></div>

    <div class="bg-white p-6 rounded-lg shadow-lg w-auto relative z-10">
      <div class="flex justify-between items-center border-b pb-2 mb-4">
        <h2 class="text-lg font-bold">{{ title }}</h2>
        <button
          @click="close"
          class="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-600"
        >
          X
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ show: boolean; title: string }>();
const emit = defineEmits(["close"]);

const close = () => emit("close");
</script>
