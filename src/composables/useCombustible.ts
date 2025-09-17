import { ref } from "vue";
import axios from "axios";
import type { Combustible } from "@/types/combustible";

export function useCombustibles() {
  const combustibles = ref<Combustible[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCombustible = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.get<Combustible[]>(
        "http://localhost:3000/api/combustible"
      );

      if (Array.isArray(data)) {
        combustibles.value = data;
      } else {
        throw new Error("La respuesta no es un array válido");
      }
    } catch (err: any) {
      error.value = err.message || "Error al obtener los combustibles";
      console.error("Error al obtener los combustibles:", err);
    } finally {
      loading.value = false;
    }
  };

  // Función para actualizar precio
  const updateCombustiblePrice = async (id: number, newPrice: number): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;

      // Validación básica
      if (isNaN(newPrice) || newPrice < 0) {
        throw new Error("El precio debe ser un número válido mayor a 0");
      }

      const response = await axios.put(
        `http://localhost:3000/api/combustible/${id}`,
        { precio: newPrice }
      );

      // Actualizar el estado local solo si la petición fue exitosa
      const index = combustibles.value.findIndex(c => c.id === id);
      if (index !== -1) {
        combustibles.value[index].precio = newPrice;
      }

      return true; // Éxito
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Error al actualizar precio";
      console.error("Error al actualizar precio:", err);
      return false; // Fallo
    } finally {
      loading.value = false;
    }
  };



  // // Función para eliminar combustible
  // const deleteCombustible = async (id: number): Promise<boolean> => {
  //   try {
  //     loading.value = true;
  //     error.value = null;

  //     await axios.delete(`http://localhost:3000/api/combustible/${id}`);

  //     // Actualizar estado local
  //     combustibles.value = combustibles.value.filter(c => c.id !== id);

  //     return true;
  //   } catch (err: any) {
  //     error.value = err.response?.data?.message || err.message || "Error al eliminar combustible";
  //     console.error("Error al eliminar combustible:", err);
  //     return false;
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  // Función para limpiar errores
  const clearError = () => {
    error.value = null;
  };

  return {
    combustibles,
    loading,
    error,
    fetchCombustible,
    updateCombustiblePrice,
    // deleteCombustible,
    clearError
  };
}