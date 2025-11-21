import { ref } from "vue";
import axios from "axios";
import type { Impuesto } from "@/types/impuesto";

export function useImpuestos() {
  const impuestos = ref<Impuesto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const idAccion = ref<number | null>(null);
  const apiUrl = "https://vibranium-nexus-backend.onrender.com/api"

  const fetchTImpuesto = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.get<Impuesto[]>(
        `${apiUrl}/Impuestos`
      );

      if (Array.isArray(data)) {
        impuestos.value = data;
      } else {
        throw new Error("La respuesta no es un array válido");
      }
    } catch (err: any) {
      error.value = err.message || "Error al obtener los impuestos";
      console.error("Error al obtener los impuestos:", err);
    } finally {
      loading.value = false;
    }
  };

  const crearTImpuesto = async (
    tipo: string,
  ) => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.post(
        `${apiUrl}/impuestos/new`,
        {
          tipo
        }
      );
      await fetchTImpuesto();

      return { success: true, message: data.message || "Tipo de Impuesto agregado" };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al agregar el tipo de impuesto";

      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const crearImpuesto = async (
    idEmpresa: number,
    idCombustible: number,
    idImpuesto: number,
    monto: number
  ) => {
    try {
      loading.value = true;
      error.value = null;
      idAccion.value = 2;

      const { data } = await axios.post(
        `${apiUrl}/impuestos/tipo/new/${idAccion.value}`,
        {
          idEmpresa,
          idCombustible,
          idImpuesto,
          monto,
        }
      );

      return { success: true, message: data.message || "Impuesto agregado" };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al agregar el impuesto";

      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const deleteImpuesto = async (
    idEmpresa: number,
    idCombustible: number,
    idImpuesto: number,
  ) => {
    try {
      loading.value = true;
      error.value = null;
      idAccion.value = 2;
      console.log("Eliminando impuesto:", `${apiUrl}/impuestos/${idEmpresa}/${idCombustible}/${idImpuesto}/dlet/${idAccion.value}`);
      const { data } = await axios.delete(
        `${apiUrl}/impuestos/${idEmpresa}/${idCombustible}/${idImpuesto}/dlet/${idAccion.value}`
      );

      return { success: true, message: data.message || "Impuesto eliminado" };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al eliminar el impuesto";

      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateImpuesto = async (
    idEmpresa: number,
    idCombustible: number,
    idImpuesto: number,
    monto: number
  ) => {
    try {
      loading.value = true;
      error.value = null;
      idAccion.value = 2;

      // La ruta debe coincidir con tu backend
      const { data } = await axios.put(
        `${apiUrl}/impuestos/${idEmpresa}/${idCombustible}/${idImpuesto}/upd/${idAccion.value}`,
        {
          monto
        }
      );

      return { success: true, message: data.message || "Impuesto actualizado" };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar el impuesto";

      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };




  return {
    impuestos,
    loading,
    error,
    fetchTImpuesto,
    crearTImpuesto,
    crearImpuesto,
    deleteImpuesto,
    updateImpuesto,
    // clearError
  };
}