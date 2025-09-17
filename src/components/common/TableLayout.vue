<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg" v-bind="$attrs">
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
        <tr v-for="(row, rowIndex) in computedRows" :key="rowIndex" class="">
          <td
            v-for="(value, colIndex) in row"
            :key="colIndex"
            class="px-6 py-4 bg-white text-center"
            :class="[centerRows ? 'text-center' : '']"
            v-html="value"
          ></td>
          <!-- Celda con el menú de acciones -->
          <td v-if="props.showActions" class="px-6 py-4 bg-white text-center">
            <div class="relative inline-block text-left">
              <!-- Botón de los 3 puntos -->
              <button
                @click="toggleMenu(rowIndex)"
                class="p-2 rounded-full hover:bg-gray-100 text-black"
              >
                ...
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
                  @click="inputUpdate(rowIndex)"
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
    <div v-if="expandedRow !== null" class="mt-6">
      <h4 class="text-md font-semibold text-gray-800 mb-2">
        Detalle de la empresa
      </h4>
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead class="text-sm text-gray-700 uppercase dark:text-neutral-400">
          <tr>
            <th
              class="px-6 py-3 bg-gray-50 dark:bg-neutral-800"
              :class="{ 'text-center': centerColumns }"
            >
              Campo
            </th>
            <th
              class="px-6 py-3 bg-gray-50 dark:bg-neutral-800"
              :class="{ 'text-center': centerColumns }"
            >
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(val, key) in props.data[expandedRow!]" :key="key">
            <td
              class="px-6 py-4 bg-white text-center"
              :class="[centerRows ? 'text-center' : '']"
            >
              {{ key }}
            </td>
            <td
              class="px-6 py-4 bg-white text-center"
              :class="[centerRows ? 'text-center' : '']"
            >
              {{ val }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Versión mejorada de tu sección de input -->
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
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ActionConfig, TableColumn } from "@/types/table";
import { useCombustibles } from "@/composables/useCombustible";

const props = defineProps<{
  title: string;
  data: Record<string, any>[];
  columns: TableColumn[];
  centerColumns?: boolean;
  centerRows?: boolean;
  showActions?: boolean;
  showReport?: boolean;
  actionConfig?: ActionConfig;
}>();

// Usar el composable
const { updateCombustiblePrice } = useCombustibles();

//query de busqueda
const searchQuery = ref("");

// columnas visibles (labels)
const computedColumns = computed(() => props.columns.map((c) => c.label));

const expandedRow = ref<number | null>(null); //estado para el detalle abierto
const expandedInput = ref<number | null>(null); //estado para el detalle abierto

//data filtrada segun el search
const filteredData = computed(() => {
  if (!searchQuery.value) return props.data;
  return props.data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

// filas con solo los campos permitidos
const computedRows = computed(() =>
  filteredData.value.map((item) =>
    props.columns.map((c) => item[c.key as string])
  )
);

const openMenu = ref<number | null>(null);
const isSaving = ref(false);

function toggleMenu(index: number) {
  openMenu.value = openMenu.value === index ? null : index;
}

function toggleDetail(index: number) {
  expandedRow.value = expandedRow.value === index ? null : index;
}

function inputUpdate(index: number) {
  expandedInput.value = expandedInput.value === index ? null : index;
  // IMPORTANTE: Cerrar el menú cuando se abre el input
  openMenu.value = null;
}

async function saveChanges(index: number) {
  try {
    // Obtener el item actual de los datos originales
    const currentItem = props.data[index];
    console.log("entro", currentItem);
    // Validar que tenemos los datos necesarios
    if (!currentItem || !currentItem.id) {
      console.error("No se pudo encontrar el item o falta el ID");
      return;
    }

    // Obtener el nuevo precio (convertir a número si es string)
    const newPrice = Number(currentItem.precio);

    // Validación adicional del precio
    if (isNaN(newPrice) || newPrice < 0) {
      alert("Por favor, ingresa un precio válido mayor a 0");
      return;
    }

    // Indicar que se está guardando
    isSaving.value = true;

    // Llamar al composable para actualizar
    const success = await updateCombustiblePrice(currentItem.id, newPrice);

    if (success) {
      // Si fue exitoso, cerrar el input de edición
      expandedInput.value = null;

      // Opcional: mostrar mensaje de éxito
      console.log("Precio actualizado correctamente");
      // O puedes usar una librería de notificaciones como toast
    } else {
      // Si hubo error, el composable ya maneja el error
      console.error("Error al actualizar el precio");
    }
  } catch (error) {
    console.error("Error inesperado:", error);
  } finally {
    isSaving.value = false;
  }
}
</script>
