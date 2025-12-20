<template>
  <div class="w-full flex flex-col">
    <div class="flex-1 bg-gray-200 p-2">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 mt-2">
        <h1
          class="text-3xl font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3"
        >
          Informes
        </h1>
      </div>

      <!-- Dashboard Card -->
      <div class="h-full w-full mb-6 bg-white p-6 font-sans">
        <div class="flex justify-between">
          <div class="flex space-x-4">
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <input
                id="fechaDesde"
                type="date"
                v-model="fechaDesde"
                class="px-3 py-2 border text-sm text-gray-600 border-gray-400 hover:border-indigo-600 focus:outline-none focus:ring-0"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <input
                id="fechaHasta"
                type="date"
                v-model="fechaHasta"
                class="px-3 py-2 border text-sm text-gray-600 border-gray-400 hover:border-indigo-600 focus:outline-none focus:ring-0"
              />
            </div>

            <div class="flex justify-end mt-6 space-x-4">
              <div>
                <button
                  @click="handleGenerar"
                  :disabled="loading"
                  class="bg-indigo-600 text-white px-5 py-2 font-medium rounded-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ loading ? "Informando..." : "Generar informe" }}
                </button>
              </div>
              <div>
                <button
                  @click="descargarPDF"
                  :disabled="informes.length === 0"
                  class="bg-green-600 text-white px-5 py-2 font-medium rounded-sm hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Descargar PDF
                </button>
              </div>
              <p v-if="error" class="text-sm text-red-600 mt-5">
                {{ error }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <TableLayout
        title="Informes"
        :data="informes"
        :columns="columnasResultado"
        :centerColumns="true"
        :showActions="false"
        :showReport="true"
        v-model:expandedRow="expandedRow"
        @toggle-expand="handleToggleExpand"
      >
      </TableLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TableLayout from "@/components/common/TableLayout.vue";
import { empresaColumns, empresaFormFields } from "@/constants/empresaConfig";
import { useInforme } from "@/composables/useInforme";

// Composables
const { generarInformes, loading, error, informes, descargarPDF } =
  useInforme();

// Configuración de columnas para TableLayout
const columnasResultado = [
  { key: "FECHA", label: "Fecha" },
  { key: "HORA", label: "Hora" },
  { key: "N_FACTURA", label: "Ticket" },
  { key: "N_LITROS", label: "Litros" },
  { key: "IMPORTE", label: "Importe" },
];

// State
const expandedRow = ref<number | null>(null);
const fechaDesde = ref<string>("");
const fechaHasta = ref<string>("");

const handleToggleExpand = (index: number | null) => {
  expandedRow.value = index;
};

// Wrapper para validar y llamar al composable sin pasar el event
const handleGenerar = async () => {
  // Validación cliente-side antes de llamar al composable
  if (!fechaDesde.value || !fechaHasta.value) {
    error.value = "Por favor selecciona un rango de fechas";
    return;
  }

  // Llamada al composable con los strings de fecha del input (YYYY-MM-DD)
  await generarInformes(fechaDesde.value, fechaHasta.value);
};

// Lifecycle
onMounted(async () => {
  // Si quieres auto-generar en mount deja la llamada; actualmente uso ejemplos fijos
  // await generarInformes("10/12/2025", "15/12/2025");
});
</script>
