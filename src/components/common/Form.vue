<template>
  <div class="bg-white shadow-lg mt-6 p-8 border border-gray-100">
    <!-- Header -->
    <div class="border-b border-gray-200 pb-4 mb-6">
      <div class="border-l-4 border-indigo-600 pl-3">
        <h2 class="text-2xl font-semibold text-gray-900">{{ title }}</h2>
        <p v-if="subtitle" class="text-gray-500 text-sm mt-1">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Form -->
    <form
      @submit.prevent="handleSubmit"
      class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
    >
      <div
        v-for="field in fields"
        :key="field.name"
        :class="getFieldClass(field)"
      >
        <label
          :for="field.name"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>

        <!-- Input -->
        <input
          v-if="['text', 'email', 'number'].includes(field.type)"
          :id="field.name"
          v-model="formData[field.name]"
          :type="field.type"
          :placeholder="field.placeholder"
          :required="field.required"
          class="w-full px-3 py-2 text-gray-600 border border-gray-400 hover:border-indigo-600 focus:ring-0 focus:ring-indigo-100 outline-none transition-all"
        />

        <!-- Select -->
        <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          v-model="formData[field.name]"
          :required="field.required"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
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
          class="w-full px-3 py-2 border border-gray-300 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
        ></textarea>
      </div>

      <!-- Botones -->
      <div
        class="col-span-full flex justify-end gap-4 pt-6 border-t border-gray-200 mt-4"
      >
        <button
          type="button"
          @click="handleCancel"
          class="px-5 py-2.5 rounded-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2.5 bg-indigo-600 text-white rounded-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Guardando...</span>
          <span v-else>Guardar</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "vue-toast-notification";

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
    submitHandler?: (data: Record<string, any>) => Promise<any>;
  }>(),
  {
    initialData: () => ({}),
    submitHandler: undefined,
  }
);

// Cambié los emits para incluir success y error
const emit = defineEmits<{
  submit: [data: Record<string, any>];
  cancel: [];
  success: [response: any];
  error: [error: any];
}>();

const formData = ref<Record<string, any>>({});
const isSubmitting = ref(false);
const $toast = useToast();

function getFieldClass(field: FormField): string {
  return field.width === "full" ? "col-span-full" : "col-span-1";
}

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    if (props.submitHandler) {
      const response = await props.submitHandler({ ...formData.value });
      emit("success", response);
      $toast.success("Formulario enviado con éxito.");
    } else {
      // No mostrar toast aquí: el padre debe manejar la llamada y notificar éxito/error
      emit("submit", { ...formData.value });
    }
  } catch (err: any) {
    emit("error", err);
    $toast.error(err?.message || "Error al enviar el formulario.");
  } finally {
    isSubmitting.value = false;
  }
}

function handleCancel() {
  emit("cancel");
  $toast.info("Formulario cancelado.");
}

onMounted(() => {
  formData.value = { ...props.initialData };
  props.fields.forEach((field) => {
    if (!(field.name in formData.value)) formData.value[field.name] = "";
  });
});
</script>
