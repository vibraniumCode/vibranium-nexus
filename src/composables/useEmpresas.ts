import { Impuesto } from './../types/impuesto';
// composables/useEmpresas.ts
import { ref } from "vue";
import axios from "axios";
import type { Empresa } from "@/types/empresa";
import { formatDate } from "@/utils/helpers";

export function useEmpresas() {
  const empresas = ref<Empresa[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const apiUrl = "https://vibranium-nexus-backend.onrender.com/api"

  const fetchEmpresas = async (accion: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.get<Empresa[]>(
        `${apiUrl}/empresas/${accion}`
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
    nombre: string,
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
  ): Promise<{ success: boolean; message: string }> => {  // ✅ CAMBIAR RETURN
    try {
      loading.value = true;
      error.value = null;
      const { data } = await axios.put(
        `${apiUrl}/empresas/${idEstacion}/${accion}`,
        {
          nomEstacion: nombre,
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

      const idx = empresas.value.findIndex((e) => e.id === idEstacion);
      if (idx !== -1) empresas.value[idx] = data;

      return { success: true, message: "Empresa actualizada correctamente" };  // ✅ CAMBIAR
      console.log("Empresa actualizada:", data);
    } catch (err: any) {
      const mensaje = err.response?.data?.message || err.message || "Error al actualizar empresa";
      error.value = mensaje;
      console.error("Error al actualizar empresa:", err);
      return { success: false, message: mensaje };  // ✅ CAMBIAR
    } finally {
      loading.value = false;
    }
  };

  const deleteEmpresa = async (accion: string, idEstacion: number): Promise<{ success: boolean; message: string }> => {
    try {
      loading.value = true;
      error.value = null;
      await axios.delete(
        `${apiUrl}/empresas/${idEstacion}/${accion}`
      );
      //Actualizar localmente
      // empresas.value = empresas.value.filter((e) => e.id !== idEstacion);
      return { success: true, message: "Empresa eliminada correctamente" };
    } catch (err: any) {
      const mensaje = err.response?.data?.message || err.message || "Error al eliminar empresa";
      error.value = mensaje;
      console.error("Error al eliminar empresa:", err);
      return { success: false, message: mensaje };
    } finally {
      loading.value = false;
    }
  }

  const createEmpresa = async (
    nombre: string,
    cuit: string,
    ingBrutos: string,
    direccion: string,
    cp: string,
    localidad: string,
    provincia: string,
    telefono: string,
    actividad: string | Date,
    idUser: number,
    accion: string
  ): Promise<{ success: boolean; message: string }> => {  // ✅ CAMBIAR RETURN
    try {
      loading.value = true;
      error.value = null;
      const { data } = await axios.post(
        `${apiUrl}/empresas/${accion}`,
        {
          nomEstacion: nombre,
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

      empresas.value.push(data);
      return { success: true, message: "Empresa creada correctamente" };  // ✅ CAMBIAR
    } catch (err: any) {
      const mensaje = err.response?.data?.message || err.message || "Error al crear empresa";
      error.value = mensaje;
      console.error("Error al crear empresa:", err);
      return { success: false, message: mensaje };  // ✅ CAMBIAR
    } finally {
      loading.value = false;
    }
  };

  const fetchEmpresaDetails = async (idEmpresa: number) => {
    try {
      loading.value = true;
      error.value = null;
      const empresa = ref<any>(null);
      const combustible = ref<any[]>([]);
      const impuesto = ref<any[]>([]);

      const { data } = await axios.get(
        `${apiUrl}/empresas/details/${idEmpresa}`
      );


      if (data && data.empresa) {
        empresa.value = data.empresa;
        combustible.value = data.combustible || [];
        impuesto.value = data.Impuesto || [];
      } else {
        throw new Error("No se recibieron datos válidos de la empresa");
      }
    } catch (err: any) {
      error.value = err.message || "Error al obtener los datos de la empresa";
      console.error("Error al obtener detalles de la empresa:", err);
    } finally {
      loading.value = false;
    }
  };

  return { empresas, loading, error, fetchEmpresas, updateEmpresa, deleteEmpresa, createEmpresa, fetchEmpresaDetails };
}