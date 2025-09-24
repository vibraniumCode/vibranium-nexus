<template>
  <div class="bg-white p-6 rounded-lg shadow-lg mt-6">
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h2>
      <p v-if="subtitle" class="text-gray-600">{{ subtitle }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Grid container for form fields -->
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="field in fields"
          :key="field.name"
          :class="getFieldClass(field)"
        >
          <!-- Label -->
          <label
            :for="field.name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <!-- Input de texto -->
          <input
            v-if="
              field.type === 'text' ||
              field.type === 'email' ||
              field.type === 'number'
            "
            :id="field.name"
            v-model="formData[field.name]"
            :type="field.type"
            :placeholder="field.placeholder"
            :required="field.required"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />

          <!-- Select -->
          <select
            v-else-if="field.type === 'select'"
            :id="field.name"
            v-model="formData[field.name]"
            :required="field.required"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="">Seleccione una opción</option>
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- Textarea -->
          <textarea
            v-else-if="field.type === 'textarea'"
            :id="field.name"
            v-model="formData[field.name]"
            :placeholder="field.placeholder"
            :required="field.required"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          ></textarea>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Guardando...</span>
          <span v-else>Guardar</span>
        </button>
        <button
          type="button"
          @click="handleCancel"
          class="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface FormField {
  name: string;
  type: "text" | "email" | "number" | "select" | "textarea";
  label: string;
  placeholder?: string;
  required?: boolean;
  width?: "full" | "half";
  options?: Array<{ label: string; value: any }>;
}

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    fields: FormField[];
    initialData?: Record<string, any>;
    columns?: number;
  }>(),
  {
    columns: 2,
    initialData: () => ({}),
  }
);

const emit = defineEmits<{
  submit: [data: Record<string, any>];
  cancel: [];
}>();

const formData = ref<Record<string, any>>({});
const isSubmitting = ref(false);

// Función para determinar las clases CSS del campo
function getFieldClass(field: FormField): string {
  // Si el campo tiene width definido, úsalo, sino usar 'half' por defecto
  const width = field.width || "half";

  if (width === "full") {
    return "col-span-2"; // Ocupa ambas columnas
  } else {
    return "col-span-1"; // Ocupa una columna
  }
}

function handleSubmit() {
  isSubmitting.value = true;

  // Simular delay de envío
  setTimeout(() => {
    emit("submit", { ...formData.value });
    isSubmitting.value = false;
  }, 500);
}

function handleCancel() {
  emit("cancel");
}

// Inicializar datos del formulario
onMounted(() => {
  // Inicializar con datos iniciales si existen
  if (props.initialData) {
    formData.value = { ...props.initialData };
  }

  // Asegurar que todos los campos estén inicializados
  props.fields.forEach((field) => {
    if (!(field.name in formData.value)) {
      formData.value[field.name] = "";
    }
  });
});
</script>
