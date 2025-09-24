<template>
  <div class="relative shadow-md sm:rounded-lg" v-bind="$attrs">
    <!-- Header with search and actions -->
    <div class="p-6 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ props.title }}</h3>
      </div>

      <!-- Search and filters bar -->
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
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
              v-model="searchQuery"
              type="text"
              placeholder="Busqueda general..."
              class="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div v-if="props.showReport" class="flex items-center gap-2">
          <button
            class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Exportar Reporte
          </button>

          <button
            class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Enviar Email
          </button>
        </div>
      </div>
    </div>

    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead class="text-sm text-gray-700 uppercase dark:text-neutral-400">
        <tr>
          <th
            v-for="(col, index) in computedColumns"
            :key="index"
            class="px-6 py-3 bg-gray-50 dark:bg-neutral-800"
            :class="{ 'text-center': centerColumns }"
          >
            {{ col }}
          </th>
          <!-- Nueva columna de acciones -->
          <th
            v-if="props.showActions"
            class="px-6 py-3 bg-gray-50 dark:bg-neutral-800 text-center"
          >
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in computedRows"
          :key="rowIndex"
          :class="[rowIndex % 2 === 1 ? 'bg-gray-100' : 'bg-white']"
        >
          <td
            v-for="(value, colIndex) in row"
            :key="colIndex"
            class="px-6 py-4 text-center"
            :class="[centerRows ? 'text-center' : '']"
            v-html="value"
          ></td>
          <!-- Celda con el menú de acciones -->
          <td v-if="props.showActions" class="px-6 py-4 text-center">
            <div class="relative inline-block text-left">
              <!-- Botón de los 3 puntos -->
              <button @click="toggleMenu(rowIndex)" class="p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6 hover:stroke-neutral-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>

              <!-- Dropdown -->
              <div
                v-if="openMenu === rowIndex"
                class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <!-- Ver detalle - solo si está habilitado -->
                <button
                  v-if="props.actionConfig?.showDetail !== false"
                  @click="toggleDetail(rowIndex)"
                  class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  Ver detalle
                </button>
                <!-- Editar - solo si está habilitado -->
                <button
                  v-if="props.actionConfig?.showEdit !== false"
                  @click="handleEdit(rowIndex)"
                  class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  {{ props.actionConfig?.editLabel || "Editar" }}
                </button>
                <!-- Eliminar - solo si está habilitado -->
                <button
                  v-if="props.actionConfig?.showDelete !== false"
                  @click="$emit('delete-row', rowIndex)"
                  class="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Tabla detalle aparte -->
    <DetalleImpuesto
      v-if="detalleId"
      :id="detalleId"
      @close="detalleId = null"
    />

    <!-- Input de edición rápida -->
    <div v-if="expandedInput !== null" class="py-4 bg-gray-50">
      <div class="max-w-md">
        <label
          class="block text-sm font-medium text-gray-700 mb-2"
          :for="`input-${expandedInput}`"
        >
          {{ props.data[expandedInput!].tipo }}
        </label>
        <input
          :id="`input-${expandedInput}`"
          v-model="props.data[expandedInput!].precio"
          type="text"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors duration-200 hover:border-gray-400 focus:outline-none"
          :placeholder="`Ingresa el precio para ${props.data[expandedInput!].tipo}`"
        />

        <div class="flex gap-2 mt-3">
          <button
            @click="saveChanges(expandedInput!)"
            :disabled="isSaving"
            class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSaving">Guardando...</span>
            <span v-else>Guardar</span>
          </button>
          <button
            @click="expandedInput = null"
            class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Formulario de edición completo -->
    <div v-if="expandedForm !== null && props.formFields">
      <Form
        title="Editar Registro"
        subtitle="Modifica los datos del registro seleccionado"
        :fields="props.formFields"
        :columns="2"
        :initialData="props.data[expandedForm]"
        @submit="handleFormSubmit"
        @cancel="expandedForm = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ActionConfig, TableColumn } from "@/types/table";
import { useCombustibles } from "@/composables/useCombustible";
import { useImpuestos } from "@/composables/useImpuestos";
import DetalleImpuesto from "@/components/DetalleImpuesto.vue";
import Form from "@/components/common/Form.vue";

const { fetchImpEstacion } = useImpuestos();

const props = withDefaults(
  defineProps<{
    title: string;
    data: Record<string, any>[];
    columns: TableColumn[];
    centerColumns?: boolean;
    centerRows?: boolean;
    showActions?: boolean;
    showReport?: boolean;
    actionConfig?: ActionConfig;
    // Nueva prop para definir el tipo de edición
    editType?: "input" | "form";
    // Campos del formulario si se usa editType="form"
    formFields?: Array<{
      name: string;
      type: string;
      label: string;
      placeholder?: string;
      required?: boolean;
    }>;
  }>(),
  {
    centerColumns: false,
    centerRows: false,
    showActions: false,
    showReport: false,
    editType: "input",
    formFields: () => [],
  }
);

// Definir emits incluyendo el nuevo evento de edición por formulario
const emit = defineEmits<{
  "delete-row": [index: number];
  "form-submit": [data: any, index: number];
}>();

// Usar el composable
const { updateCombustiblePrice } = useCombustibles();

// Query de búsqueda
const searchQuery = ref("");

// Estados para diferentes tipos de expansión
const expandedRow = ref<number | null>(null);
const expandedInput = ref<number | null>(null);
const expandedForm = ref<number | null>(null);

// Columnas visibles (labels)
const computedColumns = computed(() => props.columns.map((c) => c.label));

// Data filtrada según el search
const filteredData = computed(() => {
  if (!searchQuery.value) return props.data;
  return props.data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

// Filas con solo los campos permitidos
const computedRows = computed(() =>
  filteredData.value.map((item) =>
    props.columns.map((c) => item[c.key as string])
  )
);

const openMenu = ref<number | null>(null);
const isSaving = ref(false);
const detalleId = ref<number | null>(null);

function toggleMenu(index: number) {
  openMenu.value = openMenu.value === index ? null : index;
}

function toggleDetail(index: number) {
  detalleId.value = props.data[index].id;
  openMenu.value = null;
}

// Nueva función que maneja ambos tipos de edición
function handleEdit(index: number) {
  openMenu.value = null; // Cerrar el menú siempre

  // Decidir qué tipo de edición usar
  const editType = props.editType || "input"; // Por defecto usar input

  if (editType === "form" && props.formFields && props.formFields.length > 0) {
    formUpdate(index);
  } else {
    inputUpdate(index);
  }
}

function formUpdate(index: number) {
  // Cerrar otros expandidos
  expandedInput.value = null;
  expandedForm.value = expandedForm.value === index ? null : index;
}

function inputUpdate(index: number) {
  // Cerrar otros expandidos
  expandedForm.value = null;
  expandedInput.value = expandedInput.value === index ? null : index;
}

// Manejar el envío del formulario
function handleFormSubmit(formData: any) {
  const index = expandedForm.value!;
  emit("form-submit", formData, index);
  expandedForm.value = null;
}

async function saveChanges(index: number) {
  try {
    const currentItem = props.data[index];
    console.log("entro", currentItem);

    if (!currentItem || !currentItem.id) {
      console.error("No se pudo encontrar el item o falta el ID");
      return;
    }

    const newPrice = Number(currentItem.precio);

    if (isNaN(newPrice) || newPrice < 0) {
      alert("Por favor, ingresa un precio válido mayor a 0");
      return;
    }

    isSaving.value = true;

    const success = await updateCombustiblePrice(currentItem.id, newPrice);

    if (success) {
      expandedInput.value = null;
      console.log("Precio actualizado correctamente");
    } else {
      console.error("Error al actualizar el precio");
    }
  } catch (error) {
    console.error("Error inesperado:", error);
  } finally {
    isSaving.value = false;
  }
}
</script>
