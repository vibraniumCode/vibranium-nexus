import { ref } from "vue";
import axios from "axios";
import type { Impuesto } from "@/types/impuesto";

export function useImpuestos() {
  const impuestos = ref<Impuesto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchImpuesto = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.get<Impuesto[]>(
        "http://localhost:3000/api/Impuestos"
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

  const crearImpuesto = async (
    idEmpresa: number,
    idCombustible: number,
    idImpuesto: number,
    monto: number
  ) => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.post(
        "http://localhost:3000/api/impuestos/new",
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

      const { data } = await axios.delete(
        `http://localhost:3000/api/impuestos/${idEmpresa}/${idCombustible}/${idImpuesto}/dlet`
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

      // La ruta debe coincidir con tu backend
      const { data } = await axios.put(
        `http://localhost:3000/api/impuestos/${idEmpresa}/${idCombustible}/${idImpuesto}/upd`,
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








  // Función actualizada para soportar parámetros adicionales
  // const fetchImpEstacion = async (
  //   accion: string,
  //   idEstacion: number,
  //   idImpuesto?: number | null,
  //   meses?: number
  // ) => {
  //   try {
  //     loading.value = true;
  //     error.value = null;

  //     // Construir la URL base
  //     let url = `http://localhost:3000/api/Impuestos/${accion}/${idEstacion}`;

  //     // Agregar parámetros opcionales si están presentes
  //     const params = new URLSearchParams();

  //     if (idImpuesto !== null && idImpuesto !== undefined) {
  //       params.append('idImpuesto', idImpuesto.toString());
  //     }

  //     if (meses !== null && meses !== undefined) {
  //       params.append('meses', meses.toString());
  //     }

  //     // Si hay parámetros, agregarlos a la URL
  //     if (params.toString()) {
  //       url += `?${params.toString()}`;
  //     }

  //     console.log("URL construida:", url);

  //     const { data } = await axios.get<ImpEstacion[]>(url);

  //     if (Array.isArray(data)) {
  //       console.log("Respuesta del API:", data);
  //       return data;
  //     } else {
  //       throw new Error("La respuesta no es un array válido");
  //     }
  //   } catch (err: any) {
  //     error.value = err.message || "Error al obtener los impuestos de la estación";
  //     console.error("Error al obtener los impuestos de la estación:", err);
  //     return [];
  //   } finally {
  //     loading.value = false;
  //   }
  // };
  // const clearError = () => {
  //   error.value = null;
  // };

  return {
    impuestos,
    loading,
    error,
    fetchImpuesto,
    crearImpuesto,
    deleteImpuesto,
    updateImpuesto,
    // fetchImpEstacion,
    // clearError
  };
}