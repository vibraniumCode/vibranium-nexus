// composables/useEmpresas.ts
import { ref } from "vue";
import axios from "axios";
import type { Empresa } from "@/types/empresa";
import { formatDate } from "@/utils/helpers";

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
      empresas.value = Array.isArray(data)
        ? data.map((e: any) => ({
          ...e,
          Actividad: e.Actividad ? formatDate(String(e.Actividad)) : "",
        }))
        : [];

    } catch (err: any) {
      error.value = err.message || "Error al obtener empresas";
      console.error("Error al obtener empresas:", err);
    } finally {
      loading.value = false;
    }
  };

  const updateEmpresa = async (
    nombre: string, // ✅ Cambiado de "nomEstacion" a "nombre"
    cuit: string,
    ingBrutos: string,
    direccion: string,
    cp: string,
    localidad: string,
    provincia: string,
    telefono: string,
    actividad: string | Date,
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
          nomEstacion: nombre, // ✅ Backend espera "nomEstacion"
          cuit,
          ingBrutos,
          direccion,
          cp,
          localidad,
          provincia,
          telefono,
          actividad,
          idUser,
        }
      );

      // Actualizar localmente
      const idx = empresas.value.findIndex((e) => e.id === idEstacion);
      if (idx !== -1) empresas.value[idx] = data;

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Error al actualizar empresa";
      console.error("Error al actualizar empresa:", err);
      return false;
    } finally {
      loading.value = false;
    }

  };

  const deleteEmpresa = async (accion: string, idEstacion: number): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;
      await axios.delete(
        `http://localhost:3000/api/empresas/${idEstacion}/${accion}`
      );
      //Actualizar localmente
      // empresas.value = empresas.value.filter((e) => e.id !== idEstacion);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Error al eliminar empresa";
      console.error("Error al eliminar empresa:", err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  return { empresas, loading, error, fetchEmpresas, updateEmpresa, deleteEmpresa };
}