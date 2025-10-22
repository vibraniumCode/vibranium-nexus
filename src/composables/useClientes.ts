// composables/useEmpresas.ts
import { ref } from "vue";
import axios from "axios";
import type { Cliente } from "@/types/cliente";

export function useClientes() {
  const clientes = ref<Cliente[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchClientes = async (accion: string) => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.get<Cliente[]>(
        `http://localhost:3000/api/clientes/${accion}`
      );
      if (Array.isArray(data)) {
        clientes.value = data;
      } else {
        throw new Error("La respuesta no es un array válido");
      }
    } catch (err: any) {
      error.value = err.message || "Error al obtener los clientes";
      console.error("Error al obtener los clientes:", err);
    } finally {
      loading.value = false;
    }
  };
  const updateCliente = async (
    nombre: string,
    cuit: number,
    direccion: string,
    idUser: number,
    idCliente: number,
    accion: string
  ): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;
      const { data } = await axios.put(
        `http://localhost:3000/api/clientes/${idCliente}/${accion}`,
        {
          nombre,
          cuit,
          direccion,
          idUser,
        }
      );

      // Actualizar localmente
      const idx = clientes.value.findIndex((e) => e.id === idCliente);
      if (idx !== -1) clientes.value[idx] = data;

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Error al actualizar cliente";
      console.error("Error al actualizar cliente:", err);
      return false;
    } finally {
      loading.value = false;
    }

  };

  const deleteCliente = async (accion: string, idCliente: number): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;
      await axios.delete(
        `http://localhost:3000/api/clientes/${idCliente}/${accion}`
      );
      //Actualizar localmente
      // clientes.value = clientes.value.filter((e) => e.id !== idCliente);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Error al eliminar cliente";
      console.error("Error al eliminar cliente:", err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  const createCliente = async (
    nombre: string,
    cuit: string,
    direccion: string,
    idUser: number,
    accion: string
  ): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;
      const { data } = await axios.post(
        `http://localhost:3000/api/clientes/${accion}`,
        {
          nombre,
          cuit,
          direccion,
          idUser
        }
      );

      // Agregar localmente
      clientes.value.push(data);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || "Error al crear cliente";
      console.error("Error al crear cliente:", err);
      return false;
    } finally {
      loading.value = false;
    }
  };
  return { clientes, loading, error, fetchClientes, updateCliente, deleteCliente, createCliente };
}