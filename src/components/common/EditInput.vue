<template>
  <div class="py-4 bg-gray-50 px-6">
    <div class="max-w-md">
      <label
        class="block text-sm font-medium text-gray-700 mb-2"
        :for="`input-${fieldName}`"
      >
        {{ label }}
      </label>
      <input
        :id="`input-${fieldName}`"
        v-model="inputValue"
        :type="inputType"
        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200 hover:border-gray-400 focus:outline-none"
        :placeholder="placeholder"
      />

      <div class="flex gap-2 mt-3">
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSaving">Guardando...</span>
          <span v-else>{{ saveLabel }}</span>
        </button>
        <button
          @click="$emit('cancel')"
          :disabled="isSaving"
          class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    label: string;
    fieldName: string;
    placeholder?: string;
    inputType?: string;
    saveLabel?: string;
    isSaving?: boolean;
  }>(),
  {
    inputType: "text",
    saveLabel: "Guardar",
    isSaving: false,
    placeholder: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  save: [value: string | number];
  cancel: [];
}>();

const inputValue = ref(props.modelValue);

// Sincronizar con el prop cuando cambia
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);

// Emitir cambios en tiempo real
watch(inputValue, (newVal) => {
  emit("update:modelValue", newVal);
});

function handleSave() {
  emit("save", inputValue.value);
}
</script>
