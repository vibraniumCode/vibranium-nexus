<template>
  <div class="bg-white rounded-lg shadow-lg mt-4 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center p-4">
      <div>
        <h3 class="text-md font-semibold text-gray-900">
          Detalle de {{ nombreEst }}
        </h3>
        <p class="text-xs">{{ fecha_carga }}</p>
      </div>
      <button
        @click="emit('close')"
        class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
      >
        Cerrar
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Cargando...</p>
    </div>

    <!-- Content -->
    <div v-else class="flex">
      <!-- Tabla de detalle -->
      <div class="w-1/2 pr-4">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-sm text-gray-700 uppercase">
            <tr>
              <th class="px-6 py-3 bg-gray-50 text-center">Impuesto</th>
              <th class="px-6 py-3 bg-gray-50 text-center">Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(impuesto, i) in detalle"
              :key="i"
              :class="i % 2 === 1 ? 'bg-gray-100' : 'bg-white'"
            >
              <td class="px-6 py-4 text-center">{{ impuesto.impEstacion }}</td>
              <td class="px-6 py-4 text-center">{{ impuesto.importe }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Gráfico -->
      <div class="w-1/2 pl-4">
        <!-- Selector de impuesto -->
        <div class="mb-4">
          <select
            v-model="impuestoSeleccionado"
            @change="cargarDatosChart"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="">Todos los impuestos</option>
            <option
              v-for="impuesto in tiposImpuestos"
              :key="impuesto.id"
              :value="impuesto.id"
            >
              {{ impuesto.tipo }}
            </option>
          </select>
        </div>

        <!-- Loading del chart -->
        <div v-if="loadingChart" class="text-center py-8">
          <p class="text-sm text-gray-500">Cargando gráfico...</p>
        </div>

        <!-- Chart -->
        <Charts
          v-else-if="chartData.categories.length > 0"
          :categories="chartData.categories"
          :series="chartData.series"
        />

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <p class="text-gray-500">No hay datos disponibles para mostrar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useImpuestos } from "@/composables/useImpuestos";
import { formatDate } from "@/utils/helpers";
import Charts from "./common/Charts.vue";

// Types
interface ImpuestoDetalle {
  impEstacion: string;
  importe: number;
}

interface TipoImpuesto {
  id: number;
  tipo: string;
}

interface DatoChart {
  impuestoId: number;
  tipo: string;
  yr: number;
  mth: number;
  mesLabel: string;
  total: number;
}

// Props & Emits
const props = defineProps<{
  id: number;
  estacion: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

// Composables
const { fetchImpEstacion } = useImpuestos();

// State
const detalle = ref<ImpuestoDetalle[]>([]);
const tiposImpuestos = ref<TipoImpuesto[]>([]);
const impuestoSeleccionado = ref<number | string>("");
const loading = ref(false);
const loadingChart = ref(false);
const fecha_carga = ref("");
const nombreEst = ref("");

const chartData = ref({
  categories: [] as string[],
  series: [] as Array<{ name: string; data: number[] }>,
});

// Methods
async function cargarDetalle() {
  loading.value = true;
  try {
    const data = await fetchImpEstacion("DET", props.id);

    detalle.value = data.map((item: any) => ({
      impEstacion: item.tipo ?? "",
      importe: Number(item.importe ?? 0),
    }));

    if (data[0]) {
      fecha_carga.value = formatDate(data[0].fec_carga);
      nombreEst.value = data[0].nombre;
    }

    await cargarTiposImpuestos();
    await cargarDatosChart();
  } catch (err) {
    console.error("Error al cargar detalle:", err);
    detalle.value = [];
  } finally {
    loading.value = false;
  }
}

async function cargarTiposImpuestos() {
  try {
    const datosChart = (await fetchImpEstacion(
      "CHT",
      props.id,
      null,
      3
    )) as DatoChart[];

    if (datosChart?.length > 0) {
      const tiposUnicosMap = new Map<number, string>();

      datosChart.forEach((item) => {
        if (item.impuestoId && item.tipo) {
          tiposUnicosMap.set(item.impuestoId, item.tipo);
        }
      });

      tiposImpuestos.value = Array.from(tiposUnicosMap.entries()).map(
        ([id, tipo]) => ({ id, tipo })
      );
    }
  } catch (err) {
    console.error("Error al cargar tipos de impuestos:", err);
    tiposImpuestos.value = [];
  }
}

async function cargarDatosChart() {
  loadingChart.value = true;
  try {
    const datosChart = (await fetchImpEstacion(
      "CHT",
      props.id,
      impuestoSeleccionado.value || null,
      3
    )) as DatoChart[];

    if (!datosChart?.length) {
      chartData.value = { categories: [], series: [] };
      return;
    }

    procesarDatosChart(datosChart);
  } catch (err) {
    console.error("Error al cargar datos del chart:", err);
    chartData.value = { categories: [], series: [] };
  } finally {
    loadingChart.value = false;
  }
}

function procesarDatosChart(datos: DatoChart[]) {
  const mesesUnicos = [...new Set(datos.map((d) => d.mesLabel))].sort();

  if (!impuestoSeleccionado.value) {
    // Todos los impuestos
    const tiposUnicos = [...new Set(datos.map((d) => d.tipo))];

    const series = tiposUnicos.map((tipo) => {
      const datosDelTipo = datos.filter((d) => d.tipo === tipo);
      const dataMes = mesesUnicos.map((mes) => {
        const datoMes = datosDelTipo.find((d) => d.mesLabel === mes);
        return datoMes?.total ?? 0;
      });

      return { name: tipo, data: dataMes };
    });

    chartData.value = { categories: mesesUnicos, series };
  } else {
    // Impuesto seleccionado
    const tipoSeleccionado = tiposImpuestos.value.find(
      (t) => t.id === Number(impuestoSeleccionado.value)
    );

    const datosDelTipo = datos.filter(
      (d) => d.impuestoId === Number(impuestoSeleccionado.value)
    );

    const dataMes = mesesUnicos.map((mes) => {
      const datoMes = datosDelTipo.find((d) => d.mesLabel === mes);
      return datoMes?.total ?? 0;
    });

    chartData.value = {
      categories: mesesUnicos,
      series: [{ name: tipoSeleccionado?.tipo ?? "Impuesto", data: dataMes }],
    };
  }
}

// Lifecycle
watch(() => props.id, cargarDetalle, { immediate: true });
</script>
