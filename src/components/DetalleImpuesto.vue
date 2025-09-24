<template>
  <div class="bg-white rounded-lg shadow-lg mt-4 p-6">
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

    <div v-if="loading">Cargando...</div>

    <div v-else>
      <div class="flex">
        <!-- Tabla con el detalle actual (sin cambios) -->
        <div class="w-1/2 pr-4">
          <table
            class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-sm text-gray-700 uppercase dark:text-neutral-400"
            >
              <tr>
                <th
                  class="px-6 py-3 bg-gray-50 dark:bg-neutral-800 text-center"
                >
                  Impuesto
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 dark:bg-neutral-800 text-center"
                >
                  Importe
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(impuesto, i) in detalle"
                :key="i"
                :class="[i % 2 === 1 ? 'bg-gray-100' : 'bg-white']"
              >
                <td class="px-6 py-4 text-center">
                  {{ impuesto.impEstacion }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ impuesto.importe }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Área del gráfico con dropdown -->
        <div class="w-1/2 pl-4">
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

          <div v-if="loadingChart">
            <p class="text-sm text-gray-500">Cargando gráfico...</p>
          </div>

          <Charts
            v-else-if="chartData.categories.length > 0"
            :categories="chartData.categories"
            :series="chartData.series"
          />

          <div v-else class="text-center py-8">
            <p class="text-gray-500">No hay datos disponibles para mostrar</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useImpuestos } from "@/composables/useImpuestos";
import { formatDate } from "@/utils/helpers";
import Charts from "./common/Charts.vue";

const { fetchImpEstacion } = useImpuestos();
const fecha_carga = ref("");
const nombreEst = ref("");

interface ImpuestoDetalle {
  nombre?: string;
  impEstacion: string;
  importe: number;
  fec_carga?: string;
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

const props = defineProps<{
  id: number;
  estacion: string;
  centerColumns?: boolean;
  centerRows?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const detalle = ref<ImpuestoDetalle[]>([]);
const tiposImpuestos = ref<TipoImpuesto[]>([]);
const impuestoSeleccionado = ref<number | string>("");
const loading = ref(false);
const loadingChart = ref(false);

// Datos para el gráfico
const chartData = ref({
  categories: [] as string[],
  series: [] as Array<{ name: string; data: number[] }>,
});

async function cargarDetalle() {
  loading.value = true;
  try {
    const data = await fetchImpEstacion("DET", props.id);
    detalle.value = data.map((item: any) => ({
      impEstacion: item.tipo ?? "",
      importe: Number(item.importe ?? 0),
    }));

    const { fec_carga, nombre } = data[0];
    fecha_carga.value = formatDate(fec_carga);
    nombreEst.value = nombre;

    // Cargar los tipos de impuestos desde CHT para obtener los IDs correctos
    await cargarTiposImpuestos();

    // Cargar datos iniciales del chart (todos los impuestos)
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
    // Obtener todos los datos de CHT para extraer los tipos únicos con sus IDs
    const datosChart = (await fetchImpEstacion(
      "CHT",
      props.id,
      null,
      3
    )) as DatoChart[];

    if (datosChart && datosChart.length > 0) {
      // Crear mapa único de tipos con sus IDs
      const tiposUnicosMap = new Map<number, string>();
      datosChart.forEach((item) => {
        if (item.impuestoId && item.tipo) {
          tiposUnicosMap.set(item.impuestoId, item.tipo);
        }
      });

      // Convertir el mapa a array
      tiposImpuestos.value = Array.from(tiposUnicosMap.entries()).map(
        ([id, tipo]) => ({
          id,
          tipo,
        })
      );

      console.log("Tipos de impuestos cargados:", tiposImpuestos.value);
    }
  } catch (err) {
    console.error("Error al cargar tipos de impuestos:", err);
    tiposImpuestos.value = [];
  }
}

async function cargarDatosChart() {
  loadingChart.value = true;
  try {
    console.log(
      "Cargando datos chart para impuesto:",
      impuestoSeleccionado.value
    );

    // Llamar al SP con acción 'CHT' para obtener datos de comparación mensual
    const datosChart = (await fetchImpEstacion(
      "CHT",
      props.id,
      impuestoSeleccionado.value || null,
      3 // últimos 3 meses
    )) as DatoChart[];

    console.log("Datos recibidos del chart:", datosChart);

    if (!datosChart || datosChart.length === 0) {
      chartData.value = {
        categories: [],
        series: [],
      };
      return;
    }

    // Procesar los datos para el gráfico
    procesarDatosChart(datosChart);
  } catch (err) {
    console.error("Error al cargar datos del chart:", err);
    chartData.value = {
      categories: [],
      series: [],
    };
  } finally {
    loadingChart.value = false;
  }
}

function procesarDatosChart(datos: DatoChart[]) {
  console.log("Procesando datos:", datos);
  console.log("Impuesto seleccionado:", impuestoSeleccionado.value);

  // Obtener todos los meses únicos y ordenarlos
  const mesesUnicos = [...new Set(datos.map((d) => d.mesLabel))].sort();
  console.log("Meses únicos:", mesesUnicos);

  if (
    impuestoSeleccionado.value === "" ||
    impuestoSeleccionado.value === null
  ) {
    // Mostrar todos los impuestos como series separadas
    const tiposUnicos = [...new Set(datos.map((d) => d.tipo))];
    console.log("Tipos únicos (todos):", tiposUnicos);

    const series = tiposUnicos.map((tipo) => {
      const datosDelTipo = datos.filter((d) => d.tipo === tipo);
      const dataMes = mesesUnicos.map((mes) => {
        const datoMes = datosDelTipo.find((d) => d.mesLabel === mes);
        return datoMes ? datoMes.total : 0;
      });

      return {
        name: tipo,
        data: dataMes,
      };
    });

    chartData.value = {
      categories: mesesUnicos,
      series: series,
    };
  } else {
    // Mostrar solo el impuesto seleccionado
    const tipoSeleccionado = tiposImpuestos.value.find(
      (t) => t.id == impuestoSeleccionado.value // Usar == para comparar number con string
    );
    console.log("Tipo seleccionado:", tipoSeleccionado);

    const datosDelTipo = datos.filter(
      (d) => d.impuestoId == impuestoSeleccionado.value // Usar == para comparar number con string
    );
    console.log("Datos del tipo seleccionado:", datosDelTipo);

    const dataMes = mesesUnicos.map((mes) => {
      const datoMes = datosDelTipo.find((d) => d.mesLabel === mes);
      return datoMes ? datoMes.total : 0;
    });
    console.log("Data por mes:", dataMes);

    chartData.value = {
      categories: mesesUnicos,
      series: [
        {
          name: tipoSeleccionado?.tipo || "Impuesto",
          data: dataMes,
        },
      ],
    };
  }

  console.log("Chart data final:", chartData.value);
}

// Observar cambios en el ID de la estación
watch(() => props.id, cargarDetalle, { immediate: true });
</script>
