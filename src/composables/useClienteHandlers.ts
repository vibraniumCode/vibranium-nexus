// composables/useEmpresaHandlers.ts
import { useClientes } from "./useClientes";
import type { Cliente } from "@/types/cliente";
import Swal from "sweetalert2";

export function useClienteHandlers() {
  const { updateCliente, deleteCliente, createCliente, fetchClientes, error } = useClientes();

  const handleClienteUpdate = async (
    formData: any,
    index: number,
    clientes: Cliente[]
  ): Promise<boolean> => {
    try {
      console.log("Actualizando cliente:", formData, "en índice:", index);

      const cliente = clientes[index];
      if (!cliente?.id) {
        console.error("No se pudo encontrar la empresa o falta el ID");
        return false;
      }

      // Llamar a la función updateEmpresa con todos los parámetros requeridos
      const success = await updateCliente(
        formData.nombre || cliente.nombre,
        formData.cuit || cliente.cuit,
        formData.direccion || cliente.direccion,
        1, // idUser - ajustar según tu lógica de autenticación
        cliente.id,
        "EDIT"
      );

      if (success) {
        console.log("Cliente actualizado correctamente");
        //hace una actualización inmutable del objeto en la posición index del array clientes
        clientes[index] = { ...clientes[index], ...formData };
        return true;
      } else {
        console.error("Error al actualizar cliente");
        return false;
      }
    } catch (err) {
      console.error("Error inesperado al actualizar cliente:", err);
      return false;
    }
  };

  const handleClienteDelete = async (index: number, clientes: Cliente[]) => {
    try {
      const cliente = clientes[index];
      if (!cliente?.id) {
        console.error("No se pudo encontrar el cliente o falta el ID");
        return false;
      }

      const result = await Swal.fire({
        title: "¿Está seguro de que desea eliminar este cliente?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) return false;

      const success = await deleteCliente("DLET", cliente.id);
      if (success) {
        await fetchClientes("CTA");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error inesperado al eliminar cliente:", err);
      return false;
    }
  };

  const handleClienteCreate = async (formData: any): Promise<boolean> => {
    try {
      console.log("Creando cliente con datos:", formData);

      const success = await createCliente(
        formData.nombre,
        formData.cuit,
        formData.direccion,
        1, // idUser - ajustar según tu lógica de autenticación
        "NEW"
      );

      if (success) {
        console.log("Empresa creada correctamente");
        return true;
      } else {
        console.error("Error al crear empresa");
        return false;
      }
    } catch (err) {
      console.error("Error inesperado al crear empresa:", err);
      return false;
    }
  };

  return {
    handleClienteUpdate,
    handleClienteDelete,
    handleClienteCreate,
  };
}