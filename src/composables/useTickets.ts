import { ref } from "vue";
import axios from "axios";

interface Comprobante {
  nroComprobante: number;
  litros: number;
  importe: number;
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
  idCombustible: number;
}

const apiUrl = "https://vibranium-nexus-backend.onrender.com/api";

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
      console.log("Generando tickets con params:", params)
      const { data } = await axios.post<TicketsResponse>(
        `${apiUrl}/tickets/${idEmpresa}`,
        params
      );

      tickets.value = data;
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