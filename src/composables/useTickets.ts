import { ref } from "vue";
import axios from "axios";

interface Comprobante {
  nroComprobante: number;
  litros: number;
  importe: number;
  fechaFactura: string;
}

interface Resumen {
  cantidadComprobantes: number;
  totalCalculado: number;
}

interface TicketsResponse {
  comprobantes: Comprobante[];
  resumen: Resumen;
}

interface GenerarTicketsParams {
  importeTotal: number;
  litrosPromedio: number;
  margenLitros: number;
  importeMinimo: number;
  importeMaximo: number;
  fechaDesde: string | Date;
  fechaHasta: string | Date;
  idCombustible: number;
}

const apiUrl = "https://vibranium-nexus-backend.onrender.com/api";

const convertirStringADate = (fechaString: string): Date => {
  return new Date(fechaString + 'T00:00:00Z');
};

export const useTickets = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const tickets = ref<TicketsResponse | null>(null);

  const generarTickets = async (
    idEmpresa: string | number,
    params: GenerarTicketsParams
  ) => {
    try {
      loading.value = true;
      error.value = null;

      const paramsFormateados = {
        ...params,
        fechaDesde: convertirStringADate(params.fechaDesde),
        fechaHasta: convertirStringADate(params.fechaHasta)
      };

      console.log("Generando tickets con params:", paramsFormateados)

      const { data } = await axios.post<TicketsResponse>(
        `${apiUrl}/tickets/${idEmpresa}`,
        paramsFormateados
      );

      tickets.value = data;

      console.log("Respuesta de la API:", data);

      return {
        success: true,
        data: data,
        message: "Tickets generados exitosamente"
      };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al generar los tickets";

      return { success: false, message: error.value, data: null };
    } finally {
      loading.value = false;
    }
  };

  const limpiar = () => {
    tickets.value = null;
    error.value = null;
  };

  return {
    loading,
    error,
    tickets,
    generarTickets,
    limpiar
  };
};