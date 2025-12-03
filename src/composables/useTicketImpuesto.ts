import { ref } from "vue";
import axios from "axios";


const apiUrl = "https://vibranium-nexus-backend.onrender.com/api";


export const useTicketDetalle = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);


  const generarImpuestoTicket = async (
    litros: number,
    idCombustible: number,
    totalFinal: number,
    idEmpresa: number,
  ) => {
    try {
      loading.value = true;
      error.value = null;
      //console.log("Generando impuestos ticket con params:", { litros, idCombustible, totalFinal, idEmpresa })
      const { data } = await axios.post(
        `${apiUrl}/tickets/impuestos/${idEmpresa}`,
        { litros, idCombustible, totalFinal }
      );
      console.log("Impuestos generados:", data);
      return {
        success: true,
        data: data,
        message: "Impuestos generados exitosamente"
      };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al generar los impuestos del ticket";

      return { success: false, message: error.value, data: null };
    } finally {
      loading.value = false;
    }
  };

  const limpiar = () => {
    error.value = null;
  };

  return {
    loading,
    error,
    generarImpuestoTicket,
    limpiar
  };
};