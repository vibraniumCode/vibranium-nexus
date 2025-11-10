import { ref } from "vue";
import axios from "axios";
import type { Combustible, TCombustible } from "@/types/combustible";

export function useCombustibles() {
  const tcombustibles = ref<TCombustible[]>([]);
  const combustibles = ref<Combustible[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTCombustibles = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.get(
        "http://localhost:3000/api/combustible"
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

      const { data } = await axios.get(`http://localhost:3000/api/combustible/${idEmpresa}`);
      combustibles.value = data;
    } catch (err: any) {
      console.error("Error al obtener combustibles:", err);
      error.value = err.message || "Error al cargar combustibles";
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
      const { data } = await axios.post(
        "http://localhost:3000/api/combustible/new",
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

  return {
    tcombustibles,
    combustibles,
    loading,
    error,
    fetchTCombustibles,
    fetchCombustibles,
    crearTCombustible,
  };
}