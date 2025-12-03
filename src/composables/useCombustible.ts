import { ref } from "vue";
import axios from "axios";
import type { Combustible, TCombustible } from "@/types/combustible";
import { Console } from "console";

export function useCombustibles() {
  const tcombustibles = ref<TCombustible[]>([]);
  const combustibles = ref<Combustible[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const idAccion = ref<number | null>(null);
  const apiUrl = "https://vibranium-nexus-backend.onrender.com/api"

  const fetchTCombustibles = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.get(
        `${apiUrl}/combustible`
      );

      if (Array.isArray(data)) {
        tcombustibles.value = data;
        console.log("Tipos de combustible obtenidos:", data);
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

  const fetchCombustibles = async (idEmpresa: number) => {
    try {
      loading.value = true;
      error.value = null;

      console.log("🔄 Buscando combustibles para empresa:", idEmpresa); // ✅ DEBUG

      const { data } = await axios.get<Combustible[]>(
        `${apiUrl}/combustible/${idEmpresa}`
      );

      console.log("✅ Combustibles obtenidos:", data); // ✅ DEBUG
      combustibles.value = data;

    } catch (err: any) {
      console.error("❌ Error al obtener combustibles:", err.response?.status, err.response?.data); // ✅ DEBUG
      error.value = err.message || "Error al cargar combustibles";
      combustibles.value = []; // ✅ VACIAR ARRAY EN ERROR
    } finally {
      loading.value = false;
    }
  };

  const crearTCombustible = async (
    txtDesc: string,
  ) => {
    try {
      loading.value = true;
      error.value = null;
      console.log("Creando tipo de combustible con:", { txtDesc });
      const { data } = await axios.post(
        `${apiUrl}/combustible/tipo/new`,
        {
          txtDesc
        }
      );
      await fetchTCombustibles();

      return { success: true, message: data.message || "Tipo de Combustible agregado" };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al agregar el tipo de combustible";

      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const crearEmpresaCombustible = async (
    idEmpresa: number,
    idCombustible: number,
    monto: number
  ) => {
    try {
      loading.value = true;
      error.value = null;
      idAccion.value = 1;
      console.log("Creando combustible con:", { idEmpresa, idCombustible, monto, idAccion: idAccion.value });

      const { data } = await axios.post(
        `${apiUrl}/combustible/new/${idAccion.value}`,
        {
          idEmpresa,
          idCombustible,
          monto,
        }
      );

      return { success: true, message: "Combustible agregado", data };
    } catch (err: any) {
      console.error("Error al crear combustible:", err);
      error.value =
        err.response?.data?.message || "Error al crear combustible";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };


  const deleteEmpresaCombustible = async (
    idEmpresa: number,
    idCombustible: number
  ) => {
    try {
      loading.value = true;
      error.value = null;
      idAccion.value = 1;
      const { data } = await axios.delete(
        `${apiUrl}/combustible/${idEmpresa}/${idCombustible}/dlet/${idAccion.value}`
      );

      return { success: true, message: data.message || "Combustible eliminado" };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al eliminar el combustible";

      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const updateEmpresaCombustible = async (
    idEmpresa: number,
    idCombustible: number,
    monto: number
  ) => {
    try {
      loading.value = true;
      error.value = null;
      idAccion.value = 1;

      // La ruta debe coincidir con tu backend
      const { data } = await axios.put(
        `${apiUrl}/combustible/${idEmpresa}/${idCombustible}/upd/${idAccion.value}`,
        {
          monto
        }
      );

      return { success: true, message: data.message || "Combustible actualizado" };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar el combustible";

      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  return {
    tcombustibles,
    combustibles,
    loading,
    error,
    fetchTCombustibles,
    fetchCombustibles,
    crearTCombustible,
    crearEmpresaCombustible,
    deleteEmpresaCombustible,
    updateEmpresaCombustible,
  };
}