// composables/useEmpresas.ts
import { ref } from "vue";
import axios from "axios";
import type { Empresa } from "@/types/empresa";

export function useEmpresas() {
  const empresas = ref<Empresa[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchEmpresas = async (accion: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.get<Empresa[]>(
        `http://localhost:3000/api/empresas/${accion}`
      );

      if (Array.isArray(data)) {
        empresas.value = data;
      } else {
        console.error("Error: la respuesta no es un array");
      }
    } catch (err: any) {
      error.value = err.message || "Error al obtener los combustibles";
      console.error("Error al obtener empresas:", err);
    } finally {
      loading.value = false;
    }
  };

  const updateEmpresa = async (
    nomEstacion: string,
    cuit: string,
    ingBrutos: string,
    direccion: string,
    cp: string,
    localidad: string,
    provincia: string,
    telefono: string,
    actividad: string,
    idUser: number,
    idEstacion: number,
    accion: string
  ): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.put(
        `http://localhost:3000/api/empresas/${idEstacion}/${accion}`,
        {
          nomEstacion: nomEstacion
          , cuit: cuit
          , ingBrutos: ingBrutos
          , direccion: direccion
          , cp: cp
          , localidad: localidad
          , provincia: provincia
          , telefono: telefono
          , actividad: actividad
          , idUser: idUser
        }
      );
      const idx = empresas.value.findIndex((e) => e.id === idEstacion);
      if (idx !== -1) empresas.value[idx] = data;
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Error al actualizar empresa";
      console.error("Error al actualizar empresa:", err);
      return false; // Fallo
    } finally {
      loading.value = false;
    }
  }

  return { empresas, fetchEmpresas, updateEmpresa };
}
