// composables/useImpuestoHandlers.ts
import { ref } from "vue";
import { useImpuestos } from "@/composables/useImpuestos";
import { formatDate } from "@/utils/helpers";
import type {
  ImpuestoDetalle,
  TipoImpuesto,
  DatoChart,
  ChartData,
} from "@/types/impuesto";

export function useImpuestoHandlers() {
  const { fetchImpEstacion } = useImpuestos();

  const detalle = ref<ImpuestoDetalle[]>([]);
  const tiposImpuestos = ref<TipoImpuesto[]>([]);
  const impuestoSeleccionado = ref<number | string>("");
  const loading = ref(false);
  const loadingChart = ref(false);
  const fecha_carga = ref("");
  const nombreEst = ref("");
  const chartData = ref<ChartData>({ categories: [], series: [] });

  // 🔹 Cargar detalle principal
  const cargarDetalle = async (id: number) => {
    loading.value = true;
    try {
      const data = await fetchImpEstacion("DET", id);
      detalle.value = data.map((item: any) => ({
        impEstacion: item.tipo ?? "",
        importe: Number(item.importe ?? 0),
      }));

      if (data[0]) {
        fecha_carga.value = formatDate(data[0].fec_carga);
        nombreEst.value = data[0].nombre;
      }

      await cargarTiposImpuestos(id);
      await cargarDatosChart(id);
    } catch (err) {
      console.error("Error al cargar detalle:", err);
      detalle.value = [];
    } finally {
      loading.value = false;
    }
  };

  // 🔹 Cargar tipos de impuestos (para el selector)
  const cargarTiposImpuestos = async (id: number) => {
    try {
      const datosChart = (await fetchImpEstacion("CHT", id, null, 3)) as DatoChart[];

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
  };

  // 🔹 Cargar datos del gráfico
  const cargarDatosChart = async (id: number) => {
    loadingChart.value = true;
    try {
      const datosChart = (await fetchImpEstacion(
        "CHT",
        id,
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
  };

  // 🔹 Procesar datos del gráfico
  const procesarDatosChart = (datos: DatoChart[]) => {
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
      // Solo impuesto seleccionado
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
  };

  return {
    detalle,
    tiposImpuestos,
    impuestoSeleccionado,
    loading,
    loadingChart,
    fecha_carga,
    nombreEst,
    chartData,
    cargarDetalle,
    cargarDatosChart,
  };
}
