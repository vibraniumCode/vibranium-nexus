// composables/useEmpresaHandlers.ts
import { useEmpresas } from "./useEmpresas";
import type { Empresa } from "@/types/empresa";
import Swal from "sweetalert2";

export function useEmpresaHandlers() {
  const { updateEmpresa, deleteEmpresa, fetchEmpresas, error } = useEmpresas();

  const handleEmpresaUpdate = async (
    formData: any,
    index: number,
    empresas: Empresa[]
  ): Promise<boolean> => {
    try {
      console.log("Actualizando empresa:", formData, "en índice:", index);

      const empresa = empresas[index];
      if (!empresa?.id) {
        console.error("No se pudo encontrar la empresa o falta el ID");
        return false;
      }

      // Llamar a la función updateEmpresa con todos los parámetros requeridos
      const success = await updateEmpresa(
        formData.nombre || empresa.nombre,
        formData.cuit || empresa.cuit,
        formData.ingBrutos || empresa.ingBrutos,
        formData.direccion || empresa.direccion,
        formData.cp || empresa.cp,
        formData.localidad || empresa.localidad,
        formData.provincia || empresa.provincia,
        formData.telefono || empresa.telefono,
        // actividadDate,
        formData.Actividad || empresa.actividad,
        1, // idUser - ajustar según tu lógica de autenticación
        empresa.id,
        "EDIT"
      );

      if (success) {
        console.log("Empresa actualizada correctamente");
        //hace una actualización inmutable del objeto en la posición index del array empresas
        empresas[index] = { ...empresas[index], ...formData };
        return true;
      } else {
        console.error("Error al actualizar empresa");
        return false;
      }
    } catch (err) {
      console.error("Error inesperado al actualizar empresa:", err);
      return false;
    }
  };

  const handleEmpresaDelete = async (index: number, empresas: Empresa[]) => {
    try {
      const empresa = empresas[index];
      if (!empresa?.id) {
        console.error("No se pudo encontrar la empresa o falta el ID");
        return false;
      }

      const result = await Swal.fire({
        title: "¿Está seguro de que desea eliminar esta empresa?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) return false;

      const success = await deleteEmpresa("DLET", empresa.id);
      if (success) {
        await fetchEmpresas("CTA");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error inesperado al eliminar empresa:", err);
      return false;
    }
  };


  return {
    handleEmpresaUpdate,
    handleEmpresaDelete,
  };
}